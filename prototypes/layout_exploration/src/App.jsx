import "./colors.css";
import "./App.css";
import SensorCard from "./SensorCard";
import sensors from "./mockData";

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Change Is in the Air</h1>
        <p className="app__subtitle">
          Community Air Quality Dashboard — Portland &amp; Gresham
        </p>
      </header>

      <main className="app__main">
        <div className="app__filter-bar">
          <span className="app__filter-label">Showing all sensors</span>
          <div className="app__legend">
            <span className="app__legend-item app__legend-item--good">Good</span>
            <span className="app__legend-item app__legend-item--average">Average</span>
            <span className="app__legend-item app__legend-item--poor">Poor</span>
          </div>
        </div>

        <div className="app__grid">
          {sensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;