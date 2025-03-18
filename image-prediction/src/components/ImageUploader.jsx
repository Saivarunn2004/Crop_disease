import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import CardContent from "./Cardcontent";
import Card from "./Card";
import { Upload, Loader, CheckCircle, AlertCircle } from "lucide-react";

const ImageClassifier = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handlePredict = async () => {
    if (!image) return alert("Please upload an image first!");

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to get a response from backend!");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to get a prediction. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg border border-gray-200">
      <CardContent>
        <h1 className="text-2xl font-bold mb-4 text-gray-700 text-center">🌱 Plant Disease Detector</h1>

        {/* File Upload Input */}
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full p-2 border-2 border-dashed border-blue-400 rounded-lg bg-white text-gray-600 cursor-pointer hover:bg-blue-50 transition"
        />

        {/* Predict Button */}
        <Button
          onClick={handlePredict}
          className={`mt-4 flex items-center justify-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin" /> : <Upload />}
          Predict
        </Button>

        {/* Prediction Results */}
        {result && (
          <div className="mt-6 p-4 bg-white shadow rounded-lg text-center border border-gray-200 transition hover:scale-105">
            {result.confidence > 0.7 ? (
              <CheckCircle size={36} color="green" className="mx-auto" />
            ) : (
              <AlertCircle size={36} color="red" className="mx-auto" />
            )}
            <p className="text-lg font-semibold mt-2 text-gray-800">
              Prediction: <strong className="text-blue-600">{result.class}</strong>
            </p>
            <p className="text-gray-600">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageClassifier;