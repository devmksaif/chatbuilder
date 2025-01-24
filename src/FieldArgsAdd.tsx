/* eslint-disable react-hooks/rules-of-hooks */
// Modal.js
import axios from 'axios';
import React, { useState } from 'react';
import { RingLoader } from 'react-spinners';
import Cookies from 'js-cookie';

const FieldArgsAdd = ({ isOpen, onClose,onUpdateArgs, argNamesArray, typeArg, responseArgsArray }) => {
    if (!isOpen) return null;

    const [argName, setArgName] = useState<string>("")
    const [argValue, setArgValue] = useState<string>("")
    const [nameResponseArg, setNameResponseArg] = useState<string>("")
    const [valueResponseArg, setValueResponseArg] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)


    const handleCreateNewArg = () => {
        if (argName && argValue) {
            const newDataArg = { argName, argValue };
            onClose();  // Close before updating state to avoid UI lag
            onUpdateArgs([newDataArg], "dataArgs");  // Use passed prop to update the parent component
            return;
        } else {
            setError("Both key and value are required.");
            return;
        }
    };
    


    const handleCreateNewResponseArg = () => {
        if (nameResponseArg) {
            const newResponseArg = { responseArgName: nameResponseArg };
            onClose();
            onUpdateArgs([newResponseArg], "responseArgs");
            return;
        } else {
            setError("Response argument name is required.");
            return;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 ">
                {
                    typeArg == "dataArgs" ? (
                        <h2 className="text-xl font-semibold mb-4 ">Creez un nouveau key : value field</h2>
                    ) : (
                        <h2 className="text-xl font-semibold mb-4 ">Creez un nouveau response argument name</h2>
                    )
                }
                {
                    error.length > 0 ? (
                        <div className="self-center items-center mb-5">
                            <div className="font-bold text-red-500">
                                {error}
                            </div>
                        </div>
                    ) : (null)
                }

                {
                    typeArg == "dataArgs" ? (
                        <div className="grid grid-flow-row">

                            <input
                                type="text"
                                placeholder="Name of the key [dataArgs]"
                                value={argName}
                                onChange={e => setArgName(e.target.value)}
                                className="w-72 p-3 rounded-xl border-gray-200 border"
                            />
                            <input
                                type="text"
                                placeholder="Name of the value [dataArgs]"
                                value={argValue}
                                onChange={e => setArgValue(e.target.value)}
                                className="w-72 p-3 rounded-xl border-gray-200 border"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-flow-row">

                            <input
                                type="text"
                                placeholder="Name of the response Arg [responseArgs]"
                                value={nameResponseArg}
                                onChange={e => setNameResponseArg(e.target.value)}
                                className="w-72 p-3 rounded-xl border-gray-200 border"
                            />
                           
                        </div>
                    )
                }





                <div className="flex justify-end">

                    {
                        loading ? (
                            <button
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 items-center text-center flex flex-row"
                            >
                                Loading...
                                <RingLoader color="white" loading={loading} size={28} />

                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-5"
                                >
                                    Fermer
                                </button>
                                {
                                    typeArg == "dataArgs" ? (
                                        <button
                                            onClick={handleCreateNewArg}
                                            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                        >
                                            Creez nouveau key value pair
                                        </button>) : (
                                        <button
                                            onClick={handleCreateNewResponseArg}
                                            className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                        >Creez nouveau response argument</button>
                                    )
                                }

                            </>


                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default FieldArgsAdd;