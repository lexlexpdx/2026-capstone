import requests
import json
import time
import os

# --- Configuration ---
PURPLEAIR_API_KEY       = "REDACTED"
TB_HOST                 = "localhost"
TB_PORT                 = 8080
TB_EMAIL                = "REDACTED"
TB_PASSWORD             = "REDACTED"

NW_LAT =    45.574140   # e.g.  45.60
NW_LNG =  -122.703930   # e.g. -122.80
SE_LAT =    45.470109   # e.g.  45.45
SE_LNG =  -122.374174   # e.g. -122.55

PA_FIELDS = "name,pm2.5,pm2.5_24hour,pm2.5_10minute,humidity,temperature,latitude,longitude"
POLL_INTERVAL_SECONDS = 300

# Local cache file mapping sensor_index -> access_token
CACHE_FILE = os.path.expanduser("~/purpleair_device_cache.json")

# --- Auth ---
tb_jwt_token = None

def tb_login():
    global tb_jwt_token
    url = f"http://{TB_HOST}:{TB_PORT}/api/auth/login"
    resp = requests.post(url, json={"username": TB_EMAIL, "password": TB_PASSWORD}, timeout=10)
    resp.raise_for_status()
    tb_jwt_token = resp.json()["token"]
    print("[AUTH] ThingsBoard JWT token refreshed")

def tb_headers():
    return {
        "Content-Type": "application/json",
        "X-Authorization": f"Bearer {tb_jwt_token}"
    }

# --- Device cache ---
def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE) as f:
            return json.load(f)
    return {}

def save_cache(cache):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

# --- ThingsBoard device provisioning ---
def get_or_create_device(sensor_index, sensor_name, cache):
    key = str(sensor_index)
    if key in cache:
        return cache[key]

    # Create the device
    url = f"http://{TB_HOST}:{TB_PORT}/api/device"
    payload = {
        "name": f"PurpleAir-{sensor_name}-{sensor_index}",
        "type": "PurpleAir"
    }

    resp = requests.post(url, headers=tb_headers(), json=payload, timeout=10)

    # Re-auth and retry once if token expired
    if resp.status_code == 401:
        tb_login()
        resp = requests.post(url, headers=tb_headers(), json=payload, timeout=10)

    resp.raise_for_status()
    device_id = resp.json()["id"]["id"]

    # Fetch its access token
    token_url = f"http://{TB_HOST}:{TB_PORT}/api/device/{device_id}/credentials"
    token_resp = requests.get(token_url, headers=tb_headers(), timeout=10)
    token_resp.raise_for_status()
    access_token = token_resp.json()["credentialsId"]

    cache[key] = access_token
    save_cache(cache)
    print(f"[NEW DEVICE] Created device for sensor {sensor_name} ({sensor_index})")
    return access_token

# --- PurpleAir fetch ---
def fetch_purpleair():
    url = "https://api.purpleair.com/v1/sensors"
    headers = {"X-API-Key": PURPLEAIR_API_KEY}
    params = {
        "fields": PA_FIELDS,
        "nwlng":  NW_LNG,
        "nwlat":  NW_LAT,
        "selng":  SE_LNG,
        "selat":  SE_LAT,
    }
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()

# --- Push telemetry to a specific device ---
LOCATION_KEYS = {"latitude", "longitude"}

def push_to_thingsboard(access_token, sensor_dict):
    base_url = f"http://{TB_HOST}:{TB_PORT}/api/v1/{access_token}"

    # Split into attributes (static location) and telemetry (time-series)
    attributes = {k: v for k, v in sensor_dict.items() if k in LOCATION_KEYS and v is not None}
    telemetry  = {k: v for k, v in sensor_dict.items() if k not in LOCATION_KEYS and v is not None}

    if attributes:
        resp = requests.post(f"{base_url}/attributes", json=attributes, timeout=10)
        resp.raise_for_status()

    if telemetry:
        resp = requests.post(f"{base_url}/telemetry", json=telemetry, timeout=10)
        resp.raise_for_status()

def calculate_aqi(raw_pm25, humidity):
    """
    Calculate EPA AQI from a raw PurpleAir PM2.5 reading.
    Applies EPA correction formula before calculating AQI.
    Uses the 24-hour PM2.5 breakpoints from the EPA AQI technical document.
    Returns a tuple of (aqi: int, category: str)
    """

    # --- EPA correction ---
    # Requires humidity; if missing fall back to uncorrected value
    if humidity is not None:
        corrected = 0.534 * raw_pm25 - 0.0844 * humidity + 5.604
    else:
        corrected = raw_pm25

    # Clamp to zero — correction can produce negatives at very low readings
    corrected = max(0.0, corrected)

    # --- Breakpoint table: (Conc_low, Conc_high, AQI_low, AQI_high, Category) ---
    breakpoints = [
        (0.0,    9.0,    0,   50,  "Good"),
        (9.1,   35.4,   51,  100,  "Moderate"),
        (35.5,  55.4,  101,  150,  "Unhealthy for Sensitive Groups"),
        (55.5, 125.4,  151,  200,  "Unhealthy"),
        (125.5, 225.4, 201,  300,  "Very Unhealthy"),
        (225.5, 325.4, 301,  500,  "Hazardous"),
    ]

    # --- Piecewise linear interpolation ---
    for (c_low, c_high, aqi_low, aqi_high, category) in breakpoints:
        if c_low <= corrected <= c_high:
            aqi = ((aqi_high - aqi_low) / (c_high - c_low)) * (corrected - c_low) + aqi_low
            return round(aqi), category

    # Beyond hazardous range
    if corrected > 325.4:
        return 500, "Hazardous"

    return 0, "Good"

# --- Main loop ---
if __name__ == "__main__":
    print("Starting PurpleAir → ThingsBoard poller (per-device mode)...")
    tb_login()
    cache = load_cache()

    while True:
        try:
            raw = fetch_purpleair()
            fields = raw.get("fields", [])
            sensors = raw.get("data", [])

            print(f"[POLL] Found {len(sensors)} sensors in bounding box")

            for sensor in sensors:
                sensor_dict = dict(zip(fields, sensor))
                sensor_index = sensor_dict.get("sensor_index", sensor_dict.get("id"))
                sensor_name  = sensor_dict.get("name", f"unknown_{sensor_index}")

                # Get or create the TB device for this sensor
                access_token = get_or_create_device(sensor_index, sensor_name, cache)

                # Calculate AQI and add to telemetry
                raw_pm25 = sensor_dict.get("pm2.5_24hour") or sensor_dict.get("pm2.5")
                humidity = sensor_dict.get("humidity")

                if raw_pm25 is not None:
                    aqi, aqi_category = calculate_aqi(raw_pm25, humidity)
                    sensor_dict["aqi"] = aqi
                    sensor_dict["aqi_category"] = aqi_category

                # Build clean telemetry (exclude name, keep numeric fields)
                telemetry = {k: v for k, v in sensor_dict.items()
                             if k != "name" and v is not None}

                push_to_thingsboard(access_token, telemetry)

            print(f"[OK] Pushed telemetry for {len(sensors)} devices")

        except Exception as e:
            print(f"[ERROR] {e}")

        time.sleep(POLL_INTERVAL_SECONDS)