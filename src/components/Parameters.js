import React, { useState } from 'react';
import { totalPuContribution } from '../js/functions/puContributors';


const Parameters = ({ area, onComputePUs, onReset }) => {
    const [resolution, setResolution] = useState(10);
    const [inputBands, setInputBands] = useState(3);
    const [dataType, setDataType] = useState('8bit');
    const [outputRasters, setOutputRasters] = useState(1);

    const handleResolutionChange = (e) => setResolution(e.target.value);
    const handleInputBandsChange = (e) => setInputBands(e.target.value);
    const handleDataTypeChange = (e) => setDataType(e.target.value);
    const handleOutputRastersChange = (e) => setOutputRasters(e.target.value);

    const handleComputePUs = () => {
        if (!area || area <= 0) {
            onComputePUs(null);
            return;
        }

        let height = 512;
        let width = 512;

        const result = totalPuContribution(
            height,
            width,
            resolution,
            inputBands,
            dataType,
            outputRasters
        );
        onComputePUs(result);
    };

        const handleReset = () => {
        setResolution(10);
        setInputBands(3);
        setDataType('8bit');
        setOutputRasters(1);
        onComputePUs(null);
        onReset(true);
    };

    return (
        <div className="flex bg-gray-100 rounded-lg min-h overflow-y-auto items-center p-4 ">
            <div className="flex flex-col items-start w-full">
                <h2 className="text-xl font-bold mb-4">Request Parameters</h2>
                <div className="mb-4">
                    <label className="block mb-2">
                        Resolution (m):
                        <input
                            type="number"
                            value={resolution}
                            onChange={handleResolutionChange}
                            className="ml-2 p-1 border rounded"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        Number of <a href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#input-object-properties"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-shgreen">Input Bands</a> in the Evalscript:
                        <input
                            type="number"
                            value={inputBands}
                            onChange={handleInputBandsChange}
                            className="ml-2 p-1 border rounded"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        <a href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#sampletype"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-shgreen">SampleType</a> returned by the Evalscript:
                        <select
                            value={dataType}
                            onChange={handleDataTypeChange}
                            className="ml-2 p-1 border rounded"
                        >
                            <option value="8bit">8bit</option>
                            <option value="16bit">16bit</option>
                            <option value="32bit">32bit</option>
                        </select>
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        Number of output rasters from the Request:
                        <input
                            type="number"
                            value={outputRasters}
                            onChange={handleOutputRastersChange}
                            className="ml-2 p-1 border rounded"
                        />
                    </label>
                </div>
                <div className="flex justify-center w-full gap-4">
                    <button className="secondary-button ml-aut">
                         <button onClick={handleComputePUs}>Compute PUs</button>
                    </button>
                    <button 
                        className="bg-gray-300 hover:bg-gray-400 secondary-button"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Parameters;