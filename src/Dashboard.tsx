import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface User {
    name: string;
    role: string;
    etat: string;
}

const initialUsers: User[] = [
    { name: "Ahmed", role: "Admin", etat: "Actif" },
    { name: "Saif", role: "Technicien", etat: "Actif" },
    { name: "Mahdi", role: "Technicien", etat: "Inactif" }
];

export default function Dashboard({ flowsArray }) {
    const [usersList, setUsersList] = useState<User[]>([...initialUsers]);

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <>
            <div className='flex flex-col items-center w-full h-full p-6   '>
                <h1 className='text-center text-4xl font-bold text-gray-800 mb-8'>Tableau de bord</h1>
                <h2 className='self-start text-left font-semibold text-3xl text-gray-700 mb-4'>Informations sur les flows</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {/* Satisfaction Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}
                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Satisfaction des Utilisateurs</div>
                            <div className="text-blue-500 text-2xl font-bold">2334%</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Analyse de Sentiment</div>
                            <div className="text-blue-500 text-2xl font-bold">22% Positif</div>
                        </div>
                        <div className="mt-4">
                            <svg className="w-full h-16" viewBox="0 0 100 20">
                                <path fill="none" stroke="gray" strokeWidth="1" d="M0 10 L10 5 L20 15 L30 10 L40 15 L50 5 L60 10 L70 5 L80 15 L90 10 L100 15" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Requests Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 50, delay: 0.1 }}
                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Requêtes Résolues</div>
                            <div className="text-blue-500 text-2xl font-bold">0</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Escalations</div>
                            <div className="text-blue-500 text-2xl font-bold">0</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Taux de Résolution</div>
                            <div className="text-blue-500 text-2xl font-bold">0%</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Totalité des réclamations</div>
                            <div className="text-blue"></div>
                            <div className="text-blue-500 text-2xl font-bold">0</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Totalité des flows</div>
                            <div className="text-blue-500 text-2xl font-bold">{flowsArray.length}</div>
                        </div>
                        <div className="mt-4">
                            <svg className="w-full h-16" viewBox="0 0 100 20">
                                <path fill="none" stroke="green" strokeWidth="1" d="M0 10 L10 5 L20 15 L30 10 L40 15 L50 5 L60 10 L70 5 L80 15 L90 10 L100 15" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Frequent Questions Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 50, delay: 0.2 }}
                        className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Questions les Plus Fréquentées</div>
                            <div className="text-blue-500 text-xl font-bold">"TEST"</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Heures d'Activité</div>
                            <div className="text-blue-500 text-2xl font-bold">12:00</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-gray-600 text-sm">Satisfaction des utilisateurs</div>
                            <div className="text-blue-500 text-2xl font-bold">22%</div>
                        </div>
                        <div className="mt-4">
                            <svg className="w-full h-16" viewBox="0 0 100 20">
                                <path fill="none" stroke="currentColor" strokeWidth="1" d="M0 10 L10 5 L20 15 L30 10 L40 15 L50 5 L60 10 L70 5 L80 15 L90 10 L100 15" />
                                <path fill="none" stroke="blue" strokeWidth="1" d="M0 10 L10 8 L20 12 L30 9 L40 14 L50 6 L60 11 L70 7 L80 13 L90 9 L100 14" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                <h2 className='self-start font-semibold text-3xl mb-6 text-gray-800 mt-8'>Liste d'utilisateurs</h2>
                <div className="overflow-x-auto bg-white p-6 w-full md:w-3/4 lg:w-2/3 mx-auto rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <table className="min-w-full bg-white rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left text-lg font-bold text-gray-800">Nom</th>
                                <th className="py-3 px-4 text-left text-lg font-bold text-gray-800">Role</th>
                                <th className="py-3 px-4 text-left text-lg font-bold text-gray-800">Etat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                    <td className="py-4 px-4 border-b border-gray-200 text-md text-gray-700 font-semibold hover:text-blue-600 text-left">{user.name}</td>
                                    <td className="py-4 px-4 border-b border-gray-200 text-md text-gray-700 font-semibold hover:text-blue-600 text-left">{user.role}</td>
                                    <td className="py-4 px-4 border-b border-gray-200 text-md text-gray-700 font-semibold text-left">
                                        <span className={`font-semibold ${user.etat === 'Actif' ? 'text-green-500' : 'text-red-500'}`}>{user.etat}</span>
                                    </td>
 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-black rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl mt-6 w-full md:w-1/3">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-100 text-sm font-bold">Totale utilisateurs</div>
                        <div className="text-blue-500 text-xl font-bold">70</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-gray-100 text-sm font-bold">Heures d'Activité</div>
                        <div className="text-blue-500 text-2xl font-bold">12:00</div>
                    </div>
                    <div className="mt-4">
                        <svg className="w-full h-16" viewBox="0 0 100 20">
                            <path fill="none" stroke="currentColor" strokeWidth="1" d="M0 10 L10 5 L20 15 L30 10 L40 15 L50 5 L60 10 L70 5 L80 15 L90 10 L100 15" />
                            <path fill="none" stroke="white" strokeWidth="1" d="M0 10 L10 8 L20 12 L30 9 L40 14 L50 6 L60 11 L70 7 L80 13 L90 9 L100 14" />
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
    }