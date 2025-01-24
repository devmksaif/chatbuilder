import React, { useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import axios from 'axios';
import { debounce } from 'lodash';

const TriggerText = ({ id, data, isConnectable }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [responseValue, setResponseValue] = useState<string>('');

    const updateData = async (updatedData) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MAIN}/nodes` + "/" + id, {
                id: id,
                data: updatedData
            });
            console.log(updateData);
        } catch (error) {
            console.error("Failed to update node data:", error);
        }
    };

    const updateDataDebounced = debounce(async (updatedData) => {
        await updateData(updatedData);
    }, 500);

    useEffect(() => {
        if (data) {
            const updatedData = { ...data, inputValue, responseValue };
            updateDataDebounced(updatedData);
        }
    }, [inputValue, responseValue, data]); // Add data to the dependency array

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleResponseChange = (e) => {
        setResponseValue(e.target.value);
    };

    useEffect(() => {
        if (data) {
            if (data.inputValue) {
                setInputValue(data.inputValue);
            }
            if (data.responseValue) {
                setResponseValue(data.responseValue);
            }
        }
    }, [data]); // Run only when data changes

    if (!data) {
        return <div>Loading...</div>; // or some placeholder if data is not available
    }

    return (
        <>
            {id !== '1' && (
                <Handle
                    type="target"
                    position={Position.Left}
                    onConnect={data.callbackConn}
                    isConnectable={isConnectable}
                    style={{
                        background: '#4CAF50',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                    }}
                />
            )}
            <Handle
                type="source"
                position={Position.Right}
                id={id}
                isConnectable={isConnectable}
                onConnect={data.callbackConn}
                style={{
                    background: '#2196F3',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                }}
            />
            <div
                style={{
                    padding: '15px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%', // Allow it to stretch
                    minHeight: '100px', // Set a minimum height
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '10px',
                    }}
                >
                    {data.label}
                    {id === "1" && "(Input Node)"}
                </div>
                {id !== '1' && (
                    <>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Trigger Value"
                            style={{
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                marginBottom: '10px',
                                width: '100%',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                            }}
                        />
                        <textarea
                            value={responseValue}
                            onChange={handleResponseChange}
                            placeholder="Response"
                            style={{
                                padding: '8px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                width: '100%',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default TriggerText;
