/*******************************************************************************
File name: mockData.js

Purpose: Mock sensor dataset for the Spring/Summer 2026 Change is in the Air
         Capstone project. Simulates BottleBot and QuantAQ sensor readings for
         UI development before real data is connected.
*******************************************************************************/

const sensors = [
  {
    id: 1,
    name: "Lents Neighborhood",
    type: "BottleBot",
    location: "Indoor",
    pm25: 8.2,
    pm10: 14.5,
    temperature: 68,
    humidity: 42,
    status: "good",
  },
  {
    id: 2,
    name: "Cully Neighborhood",
    type: "BottleBot",
    location: "Indoor",
    pm25: 22.7,
    pm10: 38.1,
    temperature: 71,
    humidity: 55,
    status: "average",
  },
  {
    id: 3,
    name: "Parkrose Neighborhood",
    type: "BottleBot",
    location: "Indoor",
    pm25: 41.3,
    pm10: 67.4,
    temperature: 74,
    humidity: 61,
    status: "poor",
  },
  {
    id: 4,
    name: "Gresham Community Site",
    type: "QuantAQ",
    location: "Outdoor",
    pm25: 11.0,
    pm10: 19.3,
    temperature: 63,
    humidity: 48,
    status: "good",
  },
  {
    id: 5,
    name: "Hazelwood Neighborhood",
    type: "BottleBot",
    location: "Indoor",
    pm25: 29.4,
    pm10: 44.8,
    temperature: 69,
    humidity: 53,
    status: "average",
  },
  {
    id: 6,
    name: "East Portland Community Site",
    type: "QuantAQ",
    location: "Outdoor",
    pm25: 55.8,
    pm10: 88.2,
    temperature: 66,
    humidity: 58,
    status: "poor",
  },
];

export default sensors;