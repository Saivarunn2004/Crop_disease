// src/components/PredictionResult.jsx
import React from 'react';

const PredictionResult = ({ result }) => {
  return (
    <div style={styles.resultBox}>
      <h3>🧠 Prediction Result</h3>
      <p><strong>Class:</strong> {result.class}</p>
      <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
    </div>
  );
};

const styles = {
  resultBox: {
    marginTop: '2rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#e0f7fa',
    width: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'left',
  },
};

export default PredictionResult;