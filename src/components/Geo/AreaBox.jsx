import React from "react";

const AreaBox = ({ area }) => {
    return (
        <div className="flex bg-gray-500 p-4 min-h overflow-y-auto items-center">
            <div style={{ display: "flex", alignItems: "center" }}>
                <h2 className="text h-full flex items-center">
                    <span className="text-lg font-bold mr-1">Area of AOI:</span>
                </h2>
                {area !== null && (
                    <p>
                        {(area * 1e-6).toFixed(2)} km<sup>2</sup>{" "}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AreaBox;
