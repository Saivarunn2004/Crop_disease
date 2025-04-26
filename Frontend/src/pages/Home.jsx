// src/pages/Home.jsx
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import PredictionResult from '../components/PredictionResult';

const Home = () => {
  const [prediction, setPrediction] = useState(null);

  return (
    <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
      <ImageUpload onPredict={setPrediction} />
      {prediction && <PredictionResult result={prediction} />}
    </div>
  );
};

export default Home;