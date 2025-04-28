import React, { useState } from "react";
import { totalPuContribution } from "../js/functions/puContributors";
import { calculateAutoDimensions } from "../js/functions/geoCalculations";

const Parameters = ({ geoJSONData, onComputePUs, onReset }) => {
    const [mosaicking, setMosaicking] = useState("SIMPLE"); // Add state for mosaicking
    const [resolution, setResolution] = useState(10);
    const [resolutionClass, setResolutionClass] = useState(1);
    const [inputBands, setInputBands] = useState(3);
    const [dataType, setDataType] = useState("8bit");
    const [inputSamples, setInputSamples] = useState(1); // Add state for the extra number input

    const handleMosaickingChange = (e) => {
        setMosaicking(e.target.value);
        if (e.target.value === "SIMPLE") {
            setInputSamples(1);
        }
    };
    const handleInputBandsChange = (e) => setInputBands(e.target.value);
    const handleDataTypeChange = (e) => setDataType(e.target.value);
    const handleInputSamplesChange = (e) => {
        setInputSamples(e.target.value);
    };

    const resolutionMapping = {
        S1HIW: { value: 10, text: "Sentinel-1 HIGH IW/SM - 10m" },
        S1HEW: { value: 25, text: "Sentinel-1 HIGH EW - 25m" },
        S1M: { value: 40, text: "Sentinel-1 MEDIUM - 40m" },
        S210: { value: 10, text: "Sentinel-2: 10m" },
        S3OLCIL1B: { value: 300, text: "Sentinel-3 OLCI L1B - 300m" },
        S3OLCIL2: { value: 300, text: "Sentinel-3 OLCI L2 - 300m" },
        S3SLSTRL1B: { value: 500, text: "Sentinel-3 SLSTR1B L1B - 500m" },
        S5: { value: 7000, text: "Sentinel-5P - 7km" },
        DEM: { value: 30, text: "Digital Elevation Model - 30m" },
        OTHER: { value: 1, text: "Other" },
    };
    const handleResolutionClassChange = (e) => {
        const key = e.target.value;
        setResolutionClass(key);
        setResolution(resolutionMapping[key].value);
    };
    const handleResolutionChange = (e) => {
        const value = e.target.value;
        setResolution(value);
    };

    const handleComputePUs = () => {
        if (
            !geoJSONData ||
            !geoJSONData.features ||
            geoJSONData.features.length === 0
        ) {
            onComputePUs(null);
            return;
        }
        // Get height and width from geoJSONData
        const [height, width] = calculateAutoDimensions(
            geoJSONData,
            resolution,
        );
        const result = totalPuContribution(
            height,
            width,
            inputBands,
            dataType,
            inputSamples,
        );
        onComputePUs(result);
    };

    const handleReset = () => {
        setMosaicking("SIMPLE");
        setResolutionClass("S210");
        setInputSamples(1);
        setResolution(10);
        setInputBands(3);
        setDataType("8bit");
        onComputePUs(null);
        onReset(true);
    };

    return (
        <div className="flex bg-gray-100 rounded-lg min-h overflow-y-auto items-center p-4 ">
            <div className="flex flex-col items-start w-full">
                <h2 className="text-xl font-bold mb-4">Request Parameters</h2>
                <div className="mb-4">
                    <label className="block mb-2">
                        <a
                            href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#mosaicking"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-shgreen"
                        >
                            Mosaicking
                        </a>{" "}
                        method:
                        <select
                            value={mosaicking}
                            onChange={handleMosaickingChange}
                            className="block mt-1 p-1 border rounded"
                        >
                            <option value="SIMPLE">SIMPLE</option>
                            <option value="ORBIT">ORBIT</option>
                            <option value="TILE">TILE</option>
                        </select>
                    </label>
                </div>
                {mosaicking === "ORBIT" || mosaicking === "TILE" ? (
                    <div className="mb-4">
                        <label className="block mb-2">
                            Number of{" "}
                            <a
                                href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#samples"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-shgreen"
                            >
                                input samples
                            </a>{" "}
                            (images):
                            <input
                                type="number"
                                value={inputSamples}
                                onChange={handleInputSamplesChange}
                                className="block mt-1 p-1 border rounded"
                            />
                        </label>
                    </div>
                ) : null}
                <div className="mb-4">
                    <label className="block mb-2">
                        Resolution (m):
                        <select
                            value={resolutionClass}
                            onChange={handleResolutionClassChange}
                            className="block mt-1 p-1 border rounded"
                        >
                            {Object.keys(resolutionMapping).map((optionKey) => {
                                const option =
                                    resolutionMapping[optionKey].text;
                                return (
                                    <option value={optionKey} key={option}>
                                        {option}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </div>
                {resolutionClass === "OTHER" ? (
                    <div className="mb-4">
                        <label className="block mb-2">
                            Custom Resolution (m):
                            <input
                                type="number"
                                value={resolution}
                                onChange={handleResolutionChange}
                                className="block mt-1 p-1 border rounded"
                            />
                        </label>
                    </div>
                ) : null}
                <div className="mb-4">
                    <label className="block mb-2">
                        Number of{" "}
                        <a
                            href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#input-object-properties"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-shgreen"
                        >
                            Input Bands
                        </a>{" "}
                        in the Evalscript:
                        <input
                            type="number"
                            value={inputBands}
                            onChange={handleInputBandsChange}
                            className="block mt-1 p-1 border rounded"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        <a
                            href="https://docs.sentinel-hub.com/api/latest/evalscript/v3/#sampletype"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-shgreen"
                        >
                            SampleType
                        </a>{" "}
                        returned by the Evalscript:
                        <select
                            value={dataType}
                            onChange={handleDataTypeChange}
                            className="block mt-1 p-1 border rounded"
                        >
                            <option value="8bit">8bit</option>
                            <option value="16bit">16bit</option>
                            <option value="32bit">32bit</option>
                        </select>
                    </label>
                </div>
                <div className="flex justify-center w-full gap-4">
                    <button
                        type="button"
                        className="secondary-button ml-aut"
                        onClick={handleComputePUs}
                    >
                        Compute PUs
                    </button>
                    <button
                        type="button"
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
