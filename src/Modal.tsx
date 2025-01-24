/* eslint-disable react-hooks/rules-of-hooks */
// Modal.js
import axios from 'axios';
import React, { useState } from 'react';
import { RingLoader } from 'react-spinners';
import Cookies from 'js-cookie';

const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [name, setName] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading,setLoading] = useState<boolean>(false)

    const handleCreateNewFlow = ()  => {
        if (!name) {
            setError("Le nom ne doit pas etre vide")
            return;
        }
        const Session: any = Cookies;
        const username = Session.get("token");
        if (username != undefined) {
            setLoading(true)
            setTimeout(async () => {
                try {
                    const user = username.split(":")[0];
                    const response = await axios.post(`${process.env.REACT_APP_API_URL_MAIN}/add_flow`, { username: user, name: name });

                    console.log(response.data);

                    // Handle error if the flow already exists
                    if (response.data.error && response.data.error === "exists") {
                        setLoading(false);
                        setError("Vous avez une flow deja existe");
                        return;
                    }

                    // If success, close the modal or handle success case
                    if (response.data.success) {
                        setLoading(false);
                        onClose();
                    } else {
                        setLoading(false);
                        setError("Une erreur servenue lors de la création de la flow");
                    }

                } catch (e) {
                    setError("Une erreur servenue");
                    setLoading(false);
                    console.log(e);
                }

            }, 2000)
        }
       
    }
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6">
                <h2 className="text-xl font-semibold mb-4 ">Creez un nouveau flow</h2>
                {
                    error.length > 0 ? (
                        <div className="self-center items-center mb-5">
                            <div className="font-bold text-red-500">
                                {error}
                            </div>
                        </div>
                    ) : (null)
                }
                <div className="grid grid-flow-col">

                    <input 
                        type="text"
                        placeholder="Nom du flow"
                        value={name}
                        onChange={e => setName(e.target.value) }
                    className="w-72 p-3 rounded-xl border-gray-200 border"
                    />
                </div>
               
                
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
                            <button
                                    onClick={handleCreateNewFlow}
                                    className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Creez
                                </button>
                            </>
                               

                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Modal;