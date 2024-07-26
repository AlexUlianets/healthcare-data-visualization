import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const BarChartComponent = ({ riskLevels }) => {
  const data = {
    labels: ['1', '2', '3+'],
    datasets: [
      {
        label: 'Patients at Risk',
        data: [riskLevels['1'], riskLevels['2'], riskLevels['3+']],
        backgroundColor: '#D63D6D',
        borderColor: '#D63D6D',
        borderWidth: 1,
      },
    ],
  };

  // Options for Bar Chart
  const options = {
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true,
        max: riskLevels.length, // Limit the to riskLevels.length
        ticks: {
          stepSize: 50,
          color: '#fff',
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Patients at Risk',
          color: '#fff',
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          }
        },
        grid: {
          color: '#fff',
          borderDash: [1, 6],
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      datalabels: {
        color: 'white',
        anchor: 'center',
        align: 'center',
        formatter: function(value) {
          return value;
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 4,
        padding: {
          top: 6,
          left: 8,
          right: 8,
          bottom: 6
        },
      },
    },
  };

  return (
      <div className="bar-chart-block">
        <h2 className="chart-header">Patients at Risk by Number of Health Barriers</h2>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
  );
};

export default BarChartComponent;
