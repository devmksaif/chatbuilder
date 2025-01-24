

import React from "react";


function Divider(props) {

    return (
        <>
          <div className="flex items-center my-8">
            <div className="flex-grow border-t-2 border-gray-300"></div>
            <span className="mx-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-lg">{props.text}</span>
            <div className="flex-grow border-t-2 border-gray-300"></div>
          </div>
        </>
      );
}


export default Divider