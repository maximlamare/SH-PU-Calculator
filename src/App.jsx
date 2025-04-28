import React, { useState, useRef, useCallback } from "react";
import HeaderLogo from "./components/Header.jsx";
import GeoJSONAreaCalculator from "./components/Geo/GeoJSONAreaCalculator.jsx";
import MapComponent from "./components/Geo/MapComponent.jsx";
import AreaBox from "./components/Geo/AreaBox.jsx";
import Parameters from "./components/Parameters.jsx";
import PUBox from "./components/Results.jsx";

const App = () => {
    const [geoJSONData, setGeoJSONData] = useState(null);
    const [newGeoJSONData, setNewGeoJSONData] = useState(null);
    const [area, setArea] = useState(0);
    const [PUs, setPUs] = useState(0);
    const [computeClicked, setComputeClicked] = useState(false);
    const [reset, setReset] = useState(false);
    const clearGeoJSONRef = useRef(null);

    const handleAreaUpdate = useCallback((newArea) => {
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

    const handleGeoJSONUpdate = useCallback((data) => {
        setNewGeoJSONData(data);
    }, []);

    return (
        <div className="App">
            <div id="code-editor-modal" />
            <div className="flex items-center justify-between lg:flex-row flex-co mx-4 lg:mx-4 bg-bbb-500">
                <div className="flex items-center">
                    <HeaderLogo />
                </div>
            </div>

            <div className="flex px-4 lg:px-4 h-[80vh]">
                <div className="w-1/2 p-1">
                    <GeoJSONAreaCalculator
                        onGeoJSONUpload={handleGeoJSONUpload}
                        onClearGeoJSON={clearGeoJSONData}
                    />
                    <div className="my-3" />
                    <AreaBox area={area} />
                    <div className="my-3" />
                    <Parameters
                        geoJSONData={newGeoJSONData}
                        onComputePUs={handleComputePUs}
                        onReset={handleReset}
                    />
                    <div className="my-3" />
                    <PUBox
                        PUs={PUs}
                        computeClicked={computeClicked}
                        reset={reset}
                    />
                </div>
                <div className="w-1/2 p-1 h-[80vh]">
                    <MapComponent
                        onAreaUpdate={handleAreaUpdate}
                        geoJSONData={geoJSONData}
                        clearGeoJSONRef={clearGeoJSONRef}
                        onGeoJSONUpdate={handleGeoJSONUpdate}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
