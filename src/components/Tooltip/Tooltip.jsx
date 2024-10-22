import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline'; // Updated import path for v2
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // Use the main CSS file

const Tooltip = ({ infoStyles, content }) => {
  const [active, setActive] = useState(false);

  const handleShow = () => {
    setActive(!active);
  };
  const handleHide = () => {
    setActive(false);
  };
 

  return (
    <Tippy
      interactive
      delay={[0, 0]}
      content={
        <div
          className={`rounded-lg py-2 px-5 bg-white`}
          style={{ color: 'black', fontWeight: 'normal', outline: 'none', boxShadow: 'none'  }}
        >
          {content}
        </div>
      }
      onClickOutside={handleHide}
      visible={active}
    >
      <button onClick={handleShow} className={infoStyles} style={{ outline: 'none', boxShadow: 'none' }}>
        <InformationCircleIcon className="h-5 w-5" />
      </button>
    </Tippy>
  );
};

export default Tooltip;