import React, { useEffect, useState } from 'react';
import axios from '../user_api/axios'; // Use the correct axios instance for the backend
import HistoryList from '../components/PredictionHistory'; // Displays history of predictions

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch the history with the token saved in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated. Please log in again.');
          return;
        }

        const res = await axios.get('/api/predictions/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch prediction history:', err);
        setError('Failed to fetch history.');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <HistoryList history={history} />
    </div>
  );
};

export default Dashboard;