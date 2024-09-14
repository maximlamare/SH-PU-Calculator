import React, { useState, useRef } from 'react';
import HeaderLogo from './components/Header.js';
import GeoJSONAreaCalculator from './GeoJSONAreaCalculator.js';
import MapComponent from './MapComponent.js';
import AreaBox from './AreaBox.js';

const App = () => {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [area, setArea] = useState(null); // Add state for area
  const clearGeoJSONRef = useRef(null);


  const clearGeoJSONData = () => {
    // Clear the map when the clear button is hit
    setGeoJSONData(null);
    setArea(null);
    if (clearGeoJSONRef.current) {
      clearGeoJSONRef.current();
    }
  };

  return (
    <div className="App">
      <div id="code-editor-modal"></div>
      <div className="flex items-center justify-between lg:flex-row flex-col">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
      </div>
      <div className="flex mx-4 lg:mx-4">
        <div className="w-1/2 p-1">
          <GeoJSONAreaCalculator setGeoJSONData={setGeoJSONData} clearGeoJSONData={clearGeoJSONData} />
          <div className="my-3"></div>
          <AreaBox area={area} />
        </div>
        <div className="w-1/2 p-1" style={{ height: '90vh' }}>
          <MapComponent geoJSONData={geoJSONData} setArea={setArea} clearGeoJSON={clearGeoJSONRef} />
        </div>
      </div>
    </div>
  );
};

export default App;