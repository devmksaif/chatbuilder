import React, { useEffect, useState } from "react";
import axios from "axios";
import { Handle, Position } from "@xyflow/react";
import {debounce } from 'lodash'



function OllamaTrigger({id , data , isConnectable}) {
    const [apiValue , setApiValue] = useState<string>("")
    const [instructValue , setInstructValue] = useState<string>("")

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
        }, 600); // Adjust delay as necessary

    const handleAPIValueChange = (e) =>{
        setApiValue(e.target.value)
        data.apiValue = e.target.value;
    }

    const handleInstructValueChange = (e) =>{
        setInstructValue(e.target.value);
        data.inputValue = e.target.value;

    }


    useEffect(() => {

        const updatedData = { ...data , apiValue , inputValue : instructValue}
        updateDataDebounced(updatedData);

    },[apiValue,instructValue]);

    useEffect(() =>{
        if(data.inputValue) {
            setInstructValue(data.inputValue)
        }
        if(data.apiValue) {
            setApiValue(data.apiValue)
        }
    },
    [data.inputValue,data.apiValue,data])


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
            <div className="flex items-center grid grid-flow-row w-72 w-auto bg-white p-16 rounded-3xl hover:shadow-lg shadow-md transition-all duration-300 font-semibold">
                <div className="items-center justify-center">
                    <input type="text" value={apiValue} className=" p-3 rounded-3xl ring ring-blue-400 focus:ring-blue-500 w-72" placeholder="API URL OLLAMA" onChange={handleAPIValueChange} />
                    
                </div>
                <div className="mt-5   ">
                <textarea rows={5} value={instructValue} className="w-72 ring ring-blue-400 rounded-3xl p-3" placeholder="MODEL'S INSTRUCT" onChange={handleInstructValueChange} />
                </div>
            </div>
        </>
    )
}


export default OllamaTrigger;