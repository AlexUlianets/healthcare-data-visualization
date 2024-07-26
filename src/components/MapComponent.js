import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {mockFipsToState} from "../mocks";

const MapComponent = ({ patientsData }) => {
    useEffect(() => {
        // Initialize the map centered on the USA
        const map = L.map('map').setView([37.0902, -95.7129], 5);

        // Add grayscale tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const statePatientData = processPatientData(patientsData);

        // Add circles for states based on patient data
        statePatientData.forEach(({ state, count, coordinates }) => {
            L.circle(coordinates, {
                color: '#D63D6D',
                fillColor: '#D63D6D',
                fillOpacity: 0.5,
                radius: Math.sqrt(count) * 15000,
                weight: 2,
                dashArray: '1, 2'
            }).addTo(map).bindPopup(`${state}: ${count} patients`);
        });

        return () => {
            map.remove();
        };
    }, [patientsData]);

    const processPatientData = (patients) => {
        // Mock function: Map FIPS to state abbreviations and coordinates
        const stateData = {};

        patients.forEach(patient => {
            const { state, coordinates } = mockFipsToState[patient.tract_fips] || {};
            if (state) {
                if (!stateData[state]) {
                    stateData[state] = { count: 0, coordinates };
                }
                stateData[state].count += 1;
            }
        });
        return Object.keys(stateData).map(state => ({
            state,
            count: stateData[state].count,
            coordinates: stateData[state].coordinates
        }));
    };

    return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
