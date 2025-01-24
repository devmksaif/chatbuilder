import { Handle, Position } from '@xyflow/react'
import React, { useState, useEffect } from 'react'
import { TextProps } from './TextProps'
import { ModifiedNode } from './ModifiedNode';
import axios from 'axios';
import {debounce} from 'lodash';

export default function InputTextTrigger({ isConnectable, data, id }) {

    const [fieldForm, setFieldForm] = useState<TextProps>(null);
    const [inputValue , setInputValue] = useState('');
    const [inputName, setInputName] = useState('');
     
     const updateDataDebounced = debounce(async (updatedData) => {
                await updateData(updatedData);
            }, 500); // Adjust delay as necessary
    const updateData = async (updatedData) => {
         
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MAIN}/nodes` + "/" + id, {
                id: id,
                data: updatedData
            });
            
        } catch (error) {
            console.error("Failed to update node data:", error);
        }
    };
    useEffect(() => {
        const updatedData = { ...data, fieldForm: { ...fieldForm, name: inputName, text : "" }, inputValue };
        updateDataDebounced(updatedData);
    }, [inputName, inputValue, fieldForm]);

    useEffect(() => {
        if (data.fieldForm) {
            setFieldForm(data.fieldForm);
            if (data.fieldForm.name) setInputName(data.fieldForm.name);
        }
        if (data.inputValue) {
            setInputValue(data.inputValue);
        }
    }, [data]);

     

    const handleInputValue = (e: any) => {
        const textInput = e.target.value;
        setInputValue(textInput);
    }

    const handleInputName = (e: any) => {
        const textInput = e.target.value;
        const testForm = {...fieldForm, inputName : textInput}
        setInputName(textInput);
        
        
    }

     

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
                id={id}
                position={Position.Right}
                isConnectable={isConnectable}
                style={{
                    background: '#f44336',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                }}
            />
            

            {/* Render dynamic menu inputs */}
            <div style={{
                padding: '15px',
                border: '2px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#c0c0c0',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                width: '200px',
                textAlign: 'center',
            }} >
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
                
                <div>
                
                            <input
                            type="text"
                            className="right-bottom-input w-full p-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            
                            value={inputValue}
                            placeholder='Trigger value...'
                             
                            onChange={handleInputValue}
                        />
                       
                <input
                            type="text"
                            className="right-bottom-input w-full p-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            
                            value={inputName}
                            placeholder='Name of the input...'
                             
                            onChange={handleInputName}
                        />
                </div>
                
                
            </div>
        </>
    );
}
