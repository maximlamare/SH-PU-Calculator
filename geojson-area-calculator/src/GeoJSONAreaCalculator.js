import React, { useState } from 'react';
import * as turf from '@turf/turf';

const GeoJSONAreaCalculator = () => {
    const [file, setFile] = useState(null);
    const [area, setArea] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCalculateArea = () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const geoJSON = JSON.parse(e.target.result);
                const area = turf.area(geoJSON);
                setArea(area);
                setError(null);
            } catch (error) {
                setError('Error reading GeoJSON file.');
                setArea(null);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div>
            <h1>GeoJSON Area Calculator</h1>
            <input type="file" accept=".geojson" onChange={handleFileChange} />
            <button onClick={handleCalculateArea}>Calculate Area</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {area !== null && <p>Area: {area} square meters</p>}
        </div>
    );
};

export default GeoJSONAreaCalculator;