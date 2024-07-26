import React, { useEffect, useState } from 'react';
import PieChartComponent from './components/PieChartComponent';
import BarChartComponent from './components/BarChartComponent';
import MapComponent from './components/MapComponent';
import axios from 'axios';
import XLSX from 'xlsx';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {highRiskBarriers} from "./mocks";

const App = () => {
    const [patientsData, setPatientsData] = useState([]);
    const [barriersData, setBarriersData] = useState([]);
    const [patientsAtRisk, setPatientsAtRisk] = useState(0);
    const [riskLevels, setRiskLevels] = useState({ '1': 0, '2': 0, '3+': 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientResponse = await axios.get('/patients.xlsx', { responseType: 'arraybuffer' });
                const patientData = new Uint8Array(patientResponse.data);
                const patientWorkbook = XLSX.read(patientData, { type: 'array' });
                const patientSheetName = patientWorkbook.SheetNames[0];
                const patients = XLSX.utils.sheet_to_json(patientWorkbook.Sheets[patientSheetName]);
                setPatientsData(patients);

                const barrierResponse = await axios.get('/hbs.xlsx', { responseType: 'arraybuffer' });
                const barrierData = new Uint8Array(barrierResponse.data);
                const barrierWorkbook = XLSX.read(barrierData, { type: 'array' });
                const barrierSheetName = barrierWorkbook.SheetNames[0];
                const barriers = XLSX.utils.sheet_to_json(barrierWorkbook.Sheets[barrierSheetName]);
                setBarriersData(barriers);

                // Mock high-risk barriers
                const patientBarriers = {};

                // Collect barriers for each patient
                patients.forEach(patient => {
                    if (!patientBarriers[patient.patient_id]) {
                        patientBarriers[patient.patient_id] = new Set();
                    }
                    patientBarriers[patient.patient_id].add(patient.barrier_id);
                });

                const levels = { '1': 0, '2': 0, '3+': 0 };
                const riskCount = Object.values(patientBarriers).reduce((count, barriers) => {
                    const barrierArray = Array.from(barriers);

                    // Check for high-risk barriers
                    const isHighRisk = barrierArray.some(barrier => highRiskBarriers.includes(barrier));

                    // Count patients based on high-risk status or number of barriers
                    if (isHighRisk) {
                        count += 1;
                    }

                    // Categorize patients by the number of barriers
                    if (isHighRisk && barrierArray.length === 1) levels['1'] += 1;
                    else if (isHighRisk && barrierArray.length === 2) levels['2'] += 1;
                    else if (isHighRisk && barrierArray.length >= 3) levels['3+'] += 1;

                    return count;
                }, 0);

                console.log(`Total patients: ${patients.length}`);
                console.log(`Total at risk: ${riskCount}`);
                console.log(`Risk levels:`, levels);

                setPatientsAtRisk(riskCount);
                setRiskLevels(levels);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };


        fetchData();
    }, []);

    return (
        <div className="App">
            <div className="left-panel">
                <header className="App-header">
                    <div className="header-title">
                        <button className="update-button">
                            <div className="update-button">
                                <i className="fas fa-sync-alt"></i>
                            </div>
                        </button>
                        <h1>Health Barriers Overview</h1>
                    </div>
                    <div className="stats">
                        <div>Patients: {patientsData.length}</div>
                        <div>
                            Patients at Risk:
                            {patientsAtRisk} ({((patientsAtRisk / patientsData.length) * 100).toFixed(1)}%)
                        </div>
                    </div>
                </header>
                <div className="charts">
                    <PieChartComponent patientsData={patientsData} barriersData={barriersData} />
                    <BarChartComponent riskLevels={riskLevels} />
                </div>
            </div>
            <div className="right-panel">
                <MapComponent patientsData={patientsData} />
            </div>
        </div>
    );
}

export default App;
