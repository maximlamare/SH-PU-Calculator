import React from "react";

const HeaderLogo = () => {
	return (
		<div className="flex items-center px-4">
			<img src={`/copernicus.png`} className="sm:w-48 w-24 h-auto" alt="logo" />
			<h1 className="heading-primary ml-8 mt-5 text-3xl">
				<i className="text-white cursor-default"> PU Calculator</i>
			</h1>
		</div>
	);
};

export default HeaderLogo;
