import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  const dailyData = {};
  transactions.forEach(tx => {
    const date = new Date(tx.date).toLocaleDateString();
    dailyData[date] = (dailyData[date] || 0) + Number(tx.amount);
  });

  const dailyChart = {
    labels: Object.keys(dailyData),
    datasets: [
      {
        label: 'Daily Spending ($)',
        data: Object.values(dailyData),
        backgroundColor: 'rgba(75,192,192,0.6)',
      }
    ]
  };

  const monthlyData = {};
  transactions.forEach(tx => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyData[month] = (monthlyData[month] || 0) + Number(tx.amount);
  });

  const monthlyChart = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Monthly Spending',
        data: Object.values(monthlyData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#8E44AD', '#2ECC71', '#E67E22',
        ]
      }
    ]
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginTop: '6rem', marginBottom:'3rem'}}>Spending Overview</h3>
      
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ flex: '1 1 400px', maxWidth: '500px', minWidth: '300px', height: '300px',}}>
          <Bar data={dailyChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div style={{ flex: '1 1 300px', maxWidth: '400px', minWidth: '250px', height: '300px' }}>
          <Pie data={monthlyChart} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;
