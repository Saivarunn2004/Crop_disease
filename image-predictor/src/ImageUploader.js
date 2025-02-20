import { useState } from "react";

export default function ImageUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error predicting image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
                <button 
                    onClick={handleUpload} 
                    disabled={loading} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                >
                    {loading ? "Processing..." : "Predict"}
                </button>
                {prediction && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <p className="font-semibold">Prediction:</p>
                        <p>Class: <span className="font-bold text-blue-600">{prediction.class}</span></p>
                        <p>Confidence: <span className="font-bold text-green-600">{(prediction.confidence * 100).toFixed(2)}%</span></p>
                    </div>
                )}
            </div>
        </div>
    );
}