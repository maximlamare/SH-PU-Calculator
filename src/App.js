import React, { useState, useRef, useCallback } from 'react';
import HeaderLogo from './components/Header.js';
import GeoJSONAreaCalculator from './components/Geo/GeoJSONAreaCalculator.js';
import MapComponent from './components/Geo/MapComponent.js';
import AreaBox from './components/Geo/AreaBox.js';
import Parameters from './components/Parameters.js';
import PUBox from './components/Results.js';

const App = () => {
  const [geoJSONData, setGeoJSONData] = useState(null);
  const [area, setArea] = useState(0);
  const [PUs, setPUs] = useState(0);
  const [computeClicked, setComputeClicked] = useState(false);
  const [reset, setReset] = useState(false);
  const clearGeoJSONRef = useRef(null);

  const handleAreaUpdate = useCallback((newArea) => {
    console.log('handleAreaUpdate called with:', newArea);
    setArea(newArea);
  }, []);

  const handleComputePUs = useCallback((result) => {
    setPUs(result);
    setComputeClicked(true);
    setReset(false);
  }, []);

  const handleReset = useCallback(() => {
    setPUs(null);
    setComputeClicked(false);
    setReset(true);
  }, []);

  const clearGeoJSONData = () => {
    setGeoJSONData(null);
    setArea(0);
    if (clearGeoJSONRef.current) {
      clearGeoJSONRef.current();
    }
  };

  const handleGeoJSONUpload = useCallback((data) => {
    setGeoJSONData(data);
  }, []);

  return (
    <div className="App">
      <div id="code-editor-modal"></div>
      <div className="flex items-center justify-between lg:flex-row flex-co mx-4 lg:mx-4">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
      </div>
      <div className="flex mx-4 lg:mx-4">
        <div className="w-1/2 p-1">
          <GeoJSONAreaCalculator onGeoJSONUpload={handleGeoJSONUpload} onClearGeoJSON={clearGeoJSONData} />
          <div className="my-3"></div>
          <AreaBox area={area} />
          <div className="my-3"></div>
          <Parameters
            area={area}
            onComputePUs={handleComputePUs}
            onReset={handleReset}
          />
          <div className="my-3"></div>
          <PUBox PUs={PUs} computeClicked={computeClicked} reset={reset} />
        </div>
        <div className="w-1/2 p-1 h-64">
          <MapComponent
            onAreaUpdate={handleAreaUpdate}
            geoJSONData={geoJSONData}
            clearGeoJSONRef={clearGeoJSONRef}
          />
        </div>
      </div>
    </div >
  );
};

export default App;