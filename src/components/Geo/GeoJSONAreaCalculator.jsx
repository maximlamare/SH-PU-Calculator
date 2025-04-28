import React, { useState, useRef } from "react";
import Tooltip from "../Tooltip/Tooltip";

const GeoJSONAreaCalculator = ({ onGeoJSONUpload, onClearGeoJSON }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleClear = () => {
        // Clear functions for the clear button
        setError(null);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClearGeoJSON();
    };

    const handleUploadGeoJSON = () => {
        if (!file) {
            setError("Please select a file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const geoJSON = JSON.parse(e.target.result);
                onGeoJSONUpload(geoJSON);
                setError(null);
            } catch (error) {
                console.error("Error reading GeoJSON file:", error);
                setError(`Error reading GeoJSON file: ${error.message}`);
                onGeoJSONUpload(null);
            }
        };
        reader.onerror = (e) => {
            console.error("Error reading file:", e);
            setError(`Error reading file: ${e.target.error.message}`);
            onGeoJSONUpload(null);
        };

        reader.readAsText(file);
    };

    return (
        <div className="bg-gray-500 min-h overflow-y-auto p-4">
            <h2 className="heading-secondary mb-4">
                <div className="flex items-center">
                    <div className="text-lg font-bold mr-2">GeoJSON file:</div>
                    <Tooltip
                        infoStyles="ml-1"
                        content="Upload a GeoJSON file containing a polygon or multi-polygons of your AOI. Alternatively, you can draw a polygon on the map."
                        direction="right"
                        wrapperClassName="tooltip-content"
                    />
                </div>
            </h2>
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept=".geojson"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="flex-grow max-w-full overflow-hidden whitespace-nowrap text-ellipsis bg-white p-1 border-gray-200 border"
                />
                <button
                    type="button"
                    onClick={handleUploadGeoJSON}
                    className="flex justify-right items-center bg-green-500 ml-auto py-2 px-4 text-black font-bold"
                >
                    Upload file
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="bg-white border-green-500 border py-2 px-4 text-gray-900"
                >
                    Clear AOI
                </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default GeoJSONAreaCalculator;
