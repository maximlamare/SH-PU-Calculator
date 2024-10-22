import React from 'react';

const PUBox = ({ PUs, computeClicked, reset }) => {
    return (
        <div className="flex bg-gray-100 rounded-lg min-h-[100px] overflow-y-auto items-center justify-center">
            <div className="text-center">
                <p className="text-lg font-semibold">
                    <span className="mr-1">Total PUs</span>
                </p>
                {reset ? (
                    <p className="text-xl font-bold">0</p>
                ) : computeClicked ? (
                    PUs === null ? (
                        <p className="text-xl font-bold text-red-500">Error: AOI not set</p>
                    ) : (
                        <p className="text-xl font-bold">{Number(PUs).toFixed(2)}</p>
                    )
                ) : (
                    <p className="text-xl font-bold">0</p>
                )}
            </div>
        </div>
    );
};

export default PUBox;