import React from "react";

const HeaderLogo = () => {
    return (
        <>
            <img
                src={`/copernicus.png`}
                className="sm:w-48 w-24 h-auto"
                alt="logo"
            />
            <h1 className="heading-primary ml-8 mt-5 text-3xl">
                <i className="text-white cursor-default"> PU Calculator</i>
            </h1>
        </>
    );
};

export default HeaderLogo;
