"use client"
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, ChartOptions } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'March'],
    datasets: [
        {
            label: 'Gains',
            data: [30, 50, 40, 60, 50, 30, 40, 50, 60, 70, 60, 50, 10, 20, 30],
            backgroundColor: '#6FC2B1',
            barPercentage: 0.5,
        },
        {
            label: 'Losses',
            data: [20, 40, 30, 50, 40, 20, 30, 40, 50, 60, 50, 40, 30, 20, 30],
            backgroundColor: '#F29D4B',
            barPercentage: 0.5,
        },
    ],
};

const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
        },
    },
    scales: {
        x: {
            type: 'category', // Explicit type declaration
            stacked: true,
            grid: {
                display: false,
            },
        },
        y: {
            type: 'linear', // Explicit type declaration
            stacked: true,
            grid: {
                display: false,
            }
        },
    },
};

const ProfitLossChart: React.FC = () => {
    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Gains/Losses:</h2>
            <div style={styles.chartWrapper}>
                <div style={styles.chartContainer}>
                    <Bar data={data} options={options} />
                </div>
            </div>
            <div style={styles.legendContainer}>
                <div style={styles.legendItem}>
                    <div className="flex flex-row">
                        <div style={{ ...styles.legendColor, backgroundColor: '#6FC2B1' }}></div>
                        <span>Gains</span>
                        <span style={styles.percentage}>+15% ($32,000)</span>
                    </div>
                </div>
                <div style={styles.legendItem}>
                    <div className="flex flex-row">
                        <div style={{ ...styles.legendColor, backgroundColor: '#F29D4B' }}></div>
                        <span>Losses</span>
                        <span style={styles.percentage}>-6% ($16,000)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        width: '100%',
        margin: '0 auto',
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    chartWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        height: '300px',
        width: '100%',
    },
    legendContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '10px',
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
    },
    legendColor: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        marginRight: '4px',
    },
    percentage: {
        marginLeft: '8px',
        color: '#6FC2B1',
    },
};

export default ProfitLossChart;
