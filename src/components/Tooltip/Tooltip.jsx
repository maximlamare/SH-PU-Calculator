import { InformationCircleIcon } from "@heroicons/react/24/solid"; // Updated import path for v2
import Tippy from "@tippyjs/react";
import React, { useState } from "react";
import "tippy.js/dist/tippy.css"; // Use the main CSS file

const Tooltip = ({ infoStyles, content }) => {
	return (
		<Tippy
			content={<div className="text-xs">{content}</div>}
			trigger={"mouseenter focus"}
			arrow={false}
			placement="top-start"
		>
			<button type="button" className={infoStyles}>
				<InformationCircleIcon className="h-7 w-7" />
			</button>
		</Tippy>
	);
};

export default Tooltip;
