# Healthcare Visualization Application

## Features

- **Map Visualization**: Displays patient distribution across states with interactive circle markers.
- **Pie Chart**: Illustrates the proportion of patients with different healthcare barriers.
- **Bar Chart**: Compares the number of patients with risk barriers.
- **Data Handling**: Loads data from Excel files and processes it for visualization.

## Components

### `App.js`

The main component that manages the overall state and data fetching for the application. It loads patient and barrier data, calculates the number of patients at risk, and passes this data to the visualization components.

**Key Functions:**
- `fetchData()`: Fetches and processes data from Excel files (`patients.xlsx` and `hbs.xlsx`).
- `calculateRiskLevels()`: Determines the risk levels of patients based on barriers.

### `MapComponent`

Displays an interactive map using Leaflet, showing patient data distribution across different states. States are marked with circles whose sizes correspond to the number of patients.

**Key Features:**
- Maps patient data to state-level coordinates.
- Displays state names and patient counts in popups.
- Uses a grayscale OpenStreetMap layer for the base map.

### `PieChart`

Visualizes the proportion of patients facing different healthcare barriers using a pie chart.

**Key Features:**
- Displays the percent of patients among different barriers.
- Highlights high-risk barriers with distinct colors.

### `BarChart`

Shows a comparison of the number of patients facing one, two, or three barriers.

**Key Features:**
- Stacked bar chart to represent different levels of risk.
- State-wise comparison of barrier distribution.

## Data Files

- `patients.xlsx`: Contains patient information including `patient_id` and `barrier_id`.
- `hbs.xlsx`: Contains details about healthcare barriers.

## Setup

1. **Clone the repository:**
   ```bash
   git clone 
   cd healthcare-data-visualization
   npm install
   npm run start
