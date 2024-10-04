'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { WalletContext } from '@/config/lib/use-connect';

Chart.register(ArcElement);

const data = {
    datasets: [
        {
            data: [16, 84], // 16% progress, 84% remaining
            backgroundColor: ['#6FC2B1', '#202225'],
            borderWidth: 0,
        },
    ],
};

const options = {
    cutout: '80%',
    plugins: {
        tooltip: {
            enabled: false,
        },
    },
};

const BalanceCard: React.FC = () => {
    const { checkPortfolioValue, address } = useContext(WalletContext);
    const [portfolioValue, setValue] = useState<any>({})
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const fundValue = await checkPortfolioValue();
                console.log(fundValue)
                setValue(fundValue);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchDetails();
    }, [address]);
    return (
        <div style={styles.card}>
            <div style={styles.doughnutContainer}>
                <Doughnut data={data} options={options} />
                <div style={styles.doughnutCenter}>
                    <span style={styles.percentText}>{portfolioValue.usd >= 0 ? portfolioValue.usd : 'Loading'}%</span>
                    <span style={styles.increaseText}>↑ {portfolioValue.usd >= 0 ? portfolioValue.usd : 'Loading'}%</span>
                </div>
            </div>
            <div style={styles.balanceInfo}>
                <span style={styles.balanceLabel}>My Balance</span>
                <h1 style={styles.balanceAmount}>${portfolioValue.usd >= 0 ? portfolioValue.usd : 'Loading'}</h1>
                <span style={styles.balanceDetail}>Show Amount Balance in <span style={styles.fundName}>Fund Name</span> ⌄</span>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        display: 'flex',
        textAlign: 'start',
        alignItems: 'start',
        backgroundColor: '#2C2C2E',
        padding: '20px 30px',
        borderRadius: '16px',
        color: '#ffffff',
        width: '100%',  // Ensure the component takes full width
        boxSizing: 'border-box', // Include padding and border in the element's total width and height
    },
    doughnutContainer: {
        position: 'relative',
        width: '120px',
        height: '120px',
        marginRight: '30px',
    },
    doughnutCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
    },
    percentText: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    increaseText: {
        fontSize: '12px',
        color: '#6FC2B1',
    },
    balanceInfo: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    balanceLabel: {
        fontSize: '14px',
        marginBottom: '8px',
        textAlign: 'start'
    },
    balanceAmount: {
        fontSize: '36px',
        fontWeight: 'bold',
        margin: 0,
    },
    balanceDetail: {
        fontSize: '14px',
        marginTop: '8px',
        color: '#6FC2B1',
    },
    fundName: {
        color: '#6FC2B1',
        fontWeight: 'bold',
    },
};

export default BalanceCard;
