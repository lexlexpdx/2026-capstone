import "./App.css";
import SensorCard from "./SensorCard";
import AlertWidget from "./AlertWidget";
import mockSensorData from "./mockSensorData";

function App() {
  return (
    <main className="app">
      <header>
        <h1>Community Air Quality Dashboard Prototype</h1>
        <p>Prototype display for mock BottleBot and QuantAQ sensor data.</p>
      </header>

      <AlertWidget sensors={mockSensorData} />

      <section className="card-grid">
        {mockSensorData.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </section>
    </main>
  );
}

export default App;