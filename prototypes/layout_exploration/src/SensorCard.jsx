/*******************************************************************************
File name: SensorCard.jsx

Purpose: Reusable SensorCard component for the Spring/Summer 2026 Change is
         in the Air Capstone project. Displays air quality readings for a single
         sensor and applies conditional styling based on air quality status.
*******************************************************************************/

import "./SensorCard.css";

function SensorCard({ sensor }) {
  const { name, type, location, pm25, pm10, temperature, humidity, status } =
    sensor;

  const statusLabels = {
    good: "Good",
    average: "Average",
    poor: "Poor",
  };

  const statusDescriptions = {
    good: "Air quality is satisfactory. Safe for all activities.",
    average: "Air quality is acceptable. Sensitive groups should take care.",
    poor: "Air quality is unhealthy. Limit time spent outdoors.",
  };

  return (
    <div className={`sensor-card sensor-card--${status}`}>
      <div className="sensor-card__header">
        <h2 className="sensor-card__name">{name}</h2>
        <div className="sensor-card__meta">
          <span className="sensor-card__badge">{type}</span>
          <span className="sensor-card__badge">{location}</span>
        </div>
      </div>

      <div className={`sensor-card__status sensor-card__status--${status}`}>
        <span className="sensor-card__status-label">
          {statusLabels[status]}
        </span>
        <p className="sensor-card__status-description">
          {statusDescriptions[status]}
        </p>
      </div>

      <div className="sensor-card__readings">
        <div className="sensor-card__reading">
          <span className="sensor-card__reading-label">PM2.5</span>
          <span className="sensor-card__reading-value">{pm25}</span>
          <span className="sensor-card__reading-unit">µg/m³</span>
        </div>
        <div className="sensor-card__reading">
          <span className="sensor-card__reading-label">PM10</span>
          <span className="sensor-card__reading-value">{pm10}</span>
          <span className="sensor-card__reading-unit">µg/m³</span>
        </div>
        <div className="sensor-card__reading">
          <span className="sensor-card__reading-label">Temp</span>
          <span className="sensor-card__reading-value">{temperature}</span>
          <span className="sensor-card__reading-unit">°F</span>
        </div>
        <div className="sensor-card__reading">
          <span className="sensor-card__reading-label">Humidity</span>
          <span className="sensor-card__reading-value">{humidity}</span>
          <span className="sensor-card__reading-unit">%</span>
        </div>
      </div>
    </div>
  );
}

export default SensorCard;