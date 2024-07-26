import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import {barrierColors} from "../mocks";

const PieChartComponent = ({ patientsData }) => {
    const pieChartRef = useRef(null);

    // State to manage pagination
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 8;

    // Calculate the count of patients for each barrier
    const barrierCounts = patientsData.reduce((acc, patient) => {
        const barrierId = patient.barrier_id;
        if (acc[barrierId]) {
            acc[barrierId]++;
        } else {
            acc[barrierId] = 1;
        }
        return acc;
    }, {});

    // Calculate total patients
    const totalPatients = patientsData.length;

    // Extract labels and colors
    const labels = barrierColors.map(item => item.name);
    const colors = barrierColors.map(item => item.color);

    const data = barrierColors.map(item => {
        const count = barrierCounts[item.id] || 0;
        return (count / totalPatients) * 100;
    });

    const pieData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            borderColor: 0
        }]
    };

    // Custom plugin to place percentage labels
    const labelPlugin = {
        id: 'labelPlugin',
        afterDatasetsDraw(chart) {
            const { ctx, chartArea } = chart;
            const { top, bottom, left, right } = chartArea;

            chart.data.datasets[0].data.forEach((value, index) => {
                const meta = chart.getDatasetMeta(0);
                const arc = meta.data[index];
                const { x, y, startAngle, endAngle, outerRadius } = arc;
                const angle = (startAngle + endAngle) / 2;
                const lineOffset = 10;
                const textOffset = 25;
                const textMargin = 5;

                const lineX = Math.cos(angle) * (outerRadius + lineOffset) + x;
                const lineY = Math.sin(angle) * (outerRadius + lineOffset) + y;
                const labelX = Math.cos(angle) * (outerRadius + lineOffset + textOffset + textMargin) + x;
                const labelY = Math.sin(angle) * (outerRadius + lineOffset + textOffset + textMargin) + y;

                const adjustedLabelX = Math.max(left - 20, Math.min(right + 20, labelX));
                const adjustedLabelY = Math.max(top - 20, Math.min(bottom + 20, labelY));

                // Draw the line from the chart to the label
                ctx.save();
                ctx.strokeStyle = 'grey';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * outerRadius + x, Math.sin(angle) * outerRadius + y);
                ctx.lineTo(lineX, lineY);
                ctx.lineTo(adjustedLabelX, adjustedLabelY);
                ctx.stroke();

                // Draw the percentage label
                ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '12px Arial';
                ctx.fillText(`${value.toFixed(1)}%`, adjustedLabelX, adjustedLabelY);
                ctx.restore();
            });
        }
    };

    useEffect(() => {
        ChartJS.register(labelPlugin);
    }, []);

    const options = {
        responsive: true,
        layout: {
            padding: 50 // padding around the canvas
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
            labelPlugin: true
        },
        animation: {
            duration: 0,
        },
    };

    const handleShowMore = () => {
        setStartIndex((prev) => Math.min(prev + itemsPerPage, labels.length - itemsPerPage));
    };

    const handleShowLess = () => {
        setStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
    };

    return (
        <div className="pie-chart-block">
            <h2 className="chart-header">Patients by Health Barrier</h2>
            <div className="pie-chart-content">
                <div className="pie-chart">
                    <Pie ref={pieChartRef} data={pieData} options={options} />
                </div>
                <div className="pie-chart-legend">
                    <ul>
                        {labels.slice(startIndex, startIndex + itemsPerPage).map((label, index) => (
                            <li key={index + startIndex}>
                                <span className="color-box" style={{ backgroundColor: colors[index + startIndex] }}></span>
                                {label}
                            </li>
                        ))}
                    </ul>
                    <div className="legend-controls">
                        {startIndex > 0 && (
                            <button className="show-less" onClick={handleShowLess}>
                                ▲
                            </button>
                        )}
                        {startIndex + itemsPerPage < labels.length && (
                            <button className="show-more" onClick={handleShowMore}>
                                ▼
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChartComponent;
