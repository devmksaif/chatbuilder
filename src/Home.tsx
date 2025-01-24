import React, { useState } from 'react';
import TopnetLogo from './pf.jpg'; // Replace with the path to your image
import TopnetAI from './ai-Photoroom.jpg'
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { RingLoader } from 'react-spinners'; // You can choose from other spinners as well
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

interface UserCreds {
    username: string;
    password: string;
}
export default function Home() {
    const Encrypt = CryptoJS
    const Session = Cookies
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()


    const handleLoadingAuthentication = () => {
        const Token = Cookies.get("token")
        if(Token != undefined) {
            navigate("/dashboard")
        }
    }

    const handleAuthentication = (event) => {
        event.preventDefault()
        if (!username) {
            setError("Le nom d'utilisateur ne doit pas etre vide")
            return;
        }
        if (!password) {
            setError("Le mot de passe ne doit pas etre vide")
            return;
        }
        setLoading(true)
        setTimeout(async () => {
            try {
                const capsulated_data: UserCreds = {
                    username: username,
                    password: Encrypt.MD5(password).toString(Encrypt.enc.Hex).toString()
                }
                console.log(capsulated_data)
                const response = await axios.post(`${process.env.REACT_APP_API_URL_MAIN}/fetch_user`, capsulated_data);
                const ResponseData = response.data
                
                if (ResponseData) {
                    console.log(ResponseData)
                    if (ResponseData.error === "not_found") {
                        setError("Le nom d'utilisateur ou le mot de passe est incorrect")
                        setLoading(false)
                        return;
                    } else if (ResponseData.success === "found") {
                        setError('')
                        Session.set('token', capsulated_data.username + ":" + capsulated_data.password, { expires: 1, path: '/' })
                        setLoading(false)
                        navigate("/dashboard")
                        return;
                    } else if (ResponseData.error === "server_error") {
                        setError("Erreur dans le reseau")
                        setLoading(false)
                        return;
                    }
                }
    
            } catch (error) {
                setError("Erreur dans le reseau")
                return;
            }
        },2000)
        



    }



    return (
        <>
            <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-blue-300" onLoad={handleLoadingAuthentication}>

                <motion.div  initial={{ x: '100vw' }}  
                            animate={{ x: 0 }}        
                            transition={{ type: 'spring', stiffness: 20, duration: 1 }}  className="flex w-3/4 max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden ">
                    
                    <div className="w-1/2 p-8 flex flex-col">
                        <div className="w-1/2 self-center">
                            <img
                                src={TopnetAI}
                                alt="Description of the image"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className='self-center mt-3 mb-3 text-red-500 items-center'>
                            {
                                error && <p>{error}</p>
                            }
                        </div>
                        <form className="flex flex-col gap-4 mt-5" onSubmit={handleAuthentication} autoComplete="off">
                            <div>
                                <label className="text-left block text-gray-700 text-sm font-semibold mb-2" htmlFor="email"></label>
                                <input
                                    onChange={e => setUsername(e.target.value)}
                                    value={username}
                                    disabled={loading}
                                    type="text"
                                    id="email"
                                    maxLength={12}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Votre nom d'utilisateur"

                                    required
                                />
                            </div>
                            <div>
                                <label className=" text-left block text-gray-700 text-sm font-semibold mb-2" htmlFor="password"></label>
                                <input
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    disabled={loading}
                                    type="password"
                                    id="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                            </div>
                            {
                                loading ? (
                                    <>
                                        
                                            <button
                                                disabled={loading}
                                                type="submit"
                                                className="w-full bg-blue-300 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200 items-center justify-center text-center flex flex-row"
                                            >
                                                Authenticating...
                                                <RingLoader color="white" loading={loading} size={28} />
                                            </button>
                                            
                                       

                                    </>

                                ) : (
                                    <button

                                        type="submit"
                                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                                    >
                                        Se connecter
                                    </button>
                                )
                            }

                        </form>

                    </div>

                    {/* Image Section */}
                    <div className="w-1/2">
                        <img
                            src={TopnetLogo}
                            alt="Description of the image"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </motion.div>
            </main>
        </>
    );
}