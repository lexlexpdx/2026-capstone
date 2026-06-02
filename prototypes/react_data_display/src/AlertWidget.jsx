function AlertWidget({ sensors }) {
  const poorSensors = sensors.filter((sensor) => sensor.status === "poor");

  if (poorSensors.length === 0) {
    return (
      <div className="alert-widget good-alert">
        Current air quality looks okay across monitored areas.
      </div>
    );
  }

  return (
    <div className="alert-widget poor-alert">
      Air quality alert: {poorSensors.length} area(s) are currently marked poor.
    </div>
  );
}

export default AlertWidget;
