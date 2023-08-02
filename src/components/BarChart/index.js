import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './index.css'


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const processData = (data) => {
    const groupedData = {
        Sunday: { debit: 0, credit: 0 },
        Monday: { debit: 0, credit: 0 },
        Tuesday: { debit: 0, credit: 0 },
        Wednesday: { debit: 0, credit: 0 },
        Thursday: { debit: 0, credit: 0 },
        Friday: { debit: 0, credit: 0 },
        Saturday: { debit: 0, credit: 0 },
      };

      data.forEach((item) => {
        const date = new Date(item.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
        const type = item.type;
        groupedData[dayOfWeek][type] += item.sum;
      });
        //   console.log(groupedData)
          const daysOfWeek = Object.keys(groupedData);
          const debitData = daysOfWeek.map((day) => groupedData[day].debit);
          const creditData = daysOfWeek.map((day) => groupedData[day].credit);
          return { daysOfWeek, debitData, creditData };    
    }

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
    scales: {
        x: {
            grid: {
                display: false
            },
            beginAtZero: true,
        },
        y: {
            min: 0,
            max: 500,
            grid: {
                display: true
            },
            beginAtZero: true,
            ticks: {
                stepSize: 100,
                callback: (value) => value, // This function will format the tick labels (optional)
            }
        }
    }
}

const labels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];


const BarChart = props => {
    const { total7 } = props
    
    const { daysOfWeek, debitData, creditData } = processData(total7);
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Debit',
                data: debitData,
                backgroundColor: 'rgba(77, 120, 255, 1)', 
                borderRadius:'15px',
                borderWidth:2,
                borderColor:"rgba(77, 120, 255, 1)",
                barThickness:45,   
            },
            {
                label: 'Credit',
                data: creditData,
                backgroundColor: 'rgba(252, 170, 11, 1)', 
                borderRadius:'10px',
                borderWidth:2,
                borderColor:"rgba(252, 170, 11, 1)",
                barThickness:45,
            },
        ],
    };
    return (
        <div className='barchart-container'>
            <Bar options={options} data={chartData} />
        </div>
    )
}


export default BarChart