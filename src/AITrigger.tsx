import React, { useEffect, useState } from "react";
import { Handle, Position } from '@xyflow/react';
import axios from "axios";
import {debounce} from 'lodash';

export default function AITrigger({ isConnectable, data, id}) {
    const [apiValue, setApiValue] = useState("");
    const [inputValue, setInputValue] = useState("");
 
    const [responseValue, setResponseValue] = useState('')
    const updateData = async (updatedData) => {
         
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MAIN}/nodes` + "/" + id, {
                id: id,
                data: updatedData
            });
            console.log(updateData)
        } catch (error) {
            console.error("Failed to update node data:", error);
        }
    };
    const updateDataDebounced = debounce(async (updatedData) => {
            await updateData(updatedData);
        }, 300); // Adjust delay as necessary
    useEffect(() => {
         
        
        const updatedData = {...data , apiValue, responseValue, inputValue}
        updateDataDebounced(updatedData);
    }, [apiValue,responseValue,inputValue]);
    const handleApiValue = (e) => {
        setApiValue(e.target.value);
 
        
    };

 
    const handleInputChange = (e :any ) => {
        setInputValue(e.target.value);
      
    };
    const handleResponseChange = (e : any) => {
        setResponseValue(e.target.value);
       
    };

    useEffect(() => {
        if(data.inputValue) {
            setInputValue(data.inputValue);
        }
        if(data.responseValue) {
            setResponseValue(data.responseValue);
        }
        if(data.apiValue) {
            setApiValue(data.apiValue);
        }
    },[data.inputValue,data.responseValue,data.apiValue])


    return (
        <>
            {id !== '1' && (
                <Handle
                    type="target"
                    position={Position.Left}
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
                    backgroundColor: '#FFD580',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '200px',
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
                </div>
                <input
                    type="text"
                    value={apiValue}
                    onChange={handleApiValue}
                    placeholder="API URL"
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
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Trigger Pattern"
                    style={{
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                    }}
                />

                <input
                    type="text"
                    value={responseValue}
                    onChange={handleResponseChange}
                    placeholder="Response value"
                    style={{
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '100%',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                    }}
                />

            </div>
        </>
    );
}