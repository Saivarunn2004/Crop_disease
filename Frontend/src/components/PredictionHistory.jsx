// src/components/HistoryList.jsx
import React from 'react';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) return <p>No history found.</p>;

  return (
    <div>
      <h3>Prediction History</h3>
      <ul>
        {history.map((item) => (
          <li key={item._id}>
            <strong>{item.result}</strong> - {(item.confidence * 100).toFixed(2)}% 
            <br /> at {new Date(item.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;