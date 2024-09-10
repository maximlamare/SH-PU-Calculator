import React, { useState } from 'react';
import * as turf from '@turf/turf';
import MapComponent from './MapComponent';

const GeoJSONAreaCalculator = () => {
    const [file, setFile] = useState(null);
    const [area, setArea] = useState(null);
    const [error, setError] = useState(null);
    const [geoJSONData, setGeoJSONData] = useState(null);

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
                let area = 0;

                if (geoJSON.type === 'FeatureCollection' && geoJSON.features) {
                    area = turf.area(geoJSON);
                } else if (geoJSON.type === 'Feature' && geoJSON.geometry) {
                    area = turf.area(geoJSON);
                } else if (geoJSON.type === 'GeometryCollection' && geoJSON.geometries) {
                    geoJSON.geometries.forEach(geometry => {
                        area += turf.area(geometry);
                    });
                } else if (geoJSON.type === 'Polygon' || geoJSON.type === 'MultiPolygon') {
                    area = turf.area(geoJSON);
                } else {
                    throw new Error('Invalid GeoJSON file: Unsupported type or missing properties.');
                }

                setArea(area);
                setGeoJSONData(geoJSON);
                setError(null);
            } catch (error) {
                console.error('Error reading GeoJSON file:', error);
                setError('Error reading GeoJSON file: ' + error.message);
                setArea(null);
                setGeoJSONData(null);
            }
        };
        reader.onerror = (e) => {
            console.error('Error reading file:', e);
            setError('Error reading file: ' + e.target.error.message);
            setArea(null);
            setGeoJSONData(null);
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
            <MapComponent geoJSONData={geoJSONData} />
        </div>
    );
};

export default GeoJSONAreaCalculator;