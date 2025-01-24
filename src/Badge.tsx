import React from "react";

function Badge(props) {
    return (
        <div className="flex justify-center">
            <div className="relative inline-block text-center text-lg font-bold p-3 bg-gray-100 rounded-full hover:bg-white transition-all duration-300 shadow-lg border border-gray-300">
                <span className="mx-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-semibold">
                    {props.text}
                </span>
                <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
        </div>
    );
}

export default Badge;