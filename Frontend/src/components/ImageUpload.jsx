import React, { useState } from 'react';
import fastAPI from '../api/axios'; // Axios instance for FastAPI (port 8000)
import { getToken } from '../utils/auth'; // Utility function to get saved JWT
import PredictionResult from './PredictionResult';

const ImageUpload = ({ onPredict }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Step 1: Send to FastAPI backend (http://localhost:8000)
      const res = await fastAPI.post('/predict', formData);
      const predictionData = res.data;
      onPredict(predictionData);

      // Step 2: Send to Node.js backend (http://localhost:8080) to store history
      await fetch('http://localhost:8080/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          prediction: predictionData.class,
          confidence: predictionData.confidence,
          timestamp: new Date().toISOString()
        })
      });

    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Plant Disease Detection</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {preview && (
        <div style={styles.previewContainer}>
          <img src={preview} alt="Preview" style={styles.previewImage} />
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    margin: '2rem auto',
    padding: '1rem',
    maxWidth: '500px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    color: '#333',
  },
  form: {
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    marginLeft: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '1rem',
  },
  previewImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
};

export default ImageUpload;