import React from "react";

const AreaBox = ({ area }) => {
	return (
		<div className="flex bg-gray-100 rounded-lg min-h overflow-y-auto items-center">
			<div style={{ display: "flex", alignItems: "center" }}>
				<p className="text mx-1 pl-4 my-3 h-full flex items-center">
					<span className="mr-1">Area of AOI:</span>
				</p>
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
