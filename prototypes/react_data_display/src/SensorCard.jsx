import "./App.css";

function SensorCard({ sensor }) {
  return (
    <div className={`sensor-card ${sensor.status}`}>
      <h2>{sensor.name}</h2>

      <p className="location">{sensor.location}</p>

      <div className="sensor-data">
        <p>
          <strong>PM2.5:</strong> {sensor.pm25} µg/m³
        </p>
        <p>
          <strong>Temperature:</strong> {sensor.temperature}°F
        </p>
        <p>
          <strong>Humidity:</strong> {sensor.humidity}%
        </p>
      </div>

      <p className="status">
        Status: <span>{sensor.status}</span>
      </p>
    </div>
  );
}

export default SensorCard;