import React, { useEffect, useState } from "react"
import { Handle, Position } from "@xyflow/react"
import FieldArgsAdd from './FieldArgsAdd'
import axios from "axios";

export default function APIFetchTrigger({ isConnectable, id, data }) {
    const [inputValue, setInputValue] = useState<string>("");
    const [responseValue, setResponseValue] = useState<string>("")
    const [apiValue,setApiValue] = useState<string>("")
    const [dataArgs, setDataArgs] = useState<any>([])
    const [responseArgs,setResponseArgs] = useState<any>([])
    const [index,setIndex] = useState<number>(0)
    const  [openCreateField,setOpenCreateField] = useState<boolean>(false)
    const [typeArg,setTypeArg] = useState<string>("dataArgs")
    const [fallbackValue,setFallBackValue] = useState<string>("")

    
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
        const updatedData = { ...data, inputValue, responseValue, apiValue, dataArgsList: dataArgs, responseArgsList: responseArgs };
        updateData(updatedData);
    }, [inputValue, responseValue, apiValue, dataArgs, responseArgs,fallbackValue]);
    const openCreateFieldState = () => {
        setOpenCreateField(true)
    }

    const closeCreateFieldState = () => {

        setOpenCreateField(false);

    }

    const updateArray = (array: any, typeArgs: any) => {
        if (typeArgs === "dataArgs") {
            setDataArgs(prev => [...prev, ...array]);
        } else {
            setResponseArgs(prev => [...prev, ...array]);
        }
        
    }


    const fallBackChange = (e) => {
        data.fallBackMessage = e.target.value;
        setFallBackValue(e.target.value)
    }
    const handleInputChange  = (e) => {
        const InputValue  = e.target.value;
        setInputValue(InputValue);
        data.inputValue = e.target.value;
    }
    const responseValueChange = (e) => {
        const ResponseValue = e.target.value;
        data.responseValue = e.target.value;
        setResponseValue(ResponseValue);
    }


    const handleApiChange = (e) => {
        const ApiValue = e.target.value;
        setApiValue(ApiValue);
        data.apiValue = e.target.value;
    }

    const dataArgsButton = () => {
        setTypeArg("dataArgs")
        openCreateFieldState()
    }

    const responseArgsButton = () => {
        setTypeArg("responseArgs")
        openCreateFieldState()
    }

    useEffect(() => {
        if(data.inputValue) {
            setInputValue(data.inputValue);
        } 
        if(data.apiValue) {
            setApiValue(data.apiValue);
        } 
        if(data.responseValue) {
            setResponseValue(data.responseValue);
        } 
        if(data.responseArgsList) {
            setResponseArgs([...data.responseArgsList]);
        }
        if(data.dataArgsList) {
            setDataArgs([...data.dataArgsList]);
        }
        if(data.fallBackMessage){
            setFallBackValue(data.fallBackMessage);
        }
        
    },[])


    
    return (
        <>
        <FieldArgsAdd isOpen={openCreateField} onClose={closeCreateFieldState} onUpdateArgs={updateArray} argNamesArray={dataArgs} typeArg={typeArg} responseArgsArray={responseArgs} />

            <Handle
                type="target"
                position={Position.Left}
                onConnect={data.callbackConn}
                isConnectable={isConnectable}
                style={{
                    background: 'green',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id={id}
                isConnectable={isConnectable}
                onConnect={data.callbackConn}
                style={{
                    background: 'red',
                    borderRadius: '50%',
                    width: '12px',
                    height: '12px',
                }}
            />
            <div className="flex-grow grid grid-cols-2 items-center bg-white  rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 bg-opacity-50 p-4 ">
            <div className="grid grid-flow-row  justify-center items-center flex  " style={{width: 'auto' , height:'auto'}} >
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
                <input
                    type="text"
                    value={apiValue}
                    onChange={handleApiChange}
                    placeholder="API URL VALUE"
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
                    value={responseValue}
                    onChange={responseValueChange}
                    placeholder="RESPONSE VALUE"
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
                    value={fallbackValue}
                    onChange={fallBackChange}
                    placeholder="FALLBACK MESSAGE"
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
                
                <button onClick={responseArgsButton} className="p-2 bg-blue-500 hover:bg-blue-700 mt-5 text-white font-bold rounded-lg">
                    Add New Response Arg
                </button>
                </div>
                <div className="items-center flex">
                <div className="text-center self-center font-bold top-2  flex  absolute ml-10 ">Reponse Args</div>
                <div className="grid grid-row-flow gap-1 overflow-auto ml-10">
                
               
                {
                        responseArgs.length > 0 ? (
                            responseArgs.map((item,index) => {
                                return (
                                    <div key={index} className="grid grid-cols-3">
                                        <div>{item.responseArgName}</div><button onClick={() => setResponseArgs(prev => prev.filter((_, i) => i !== index))} className="p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg">Delete</button>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center font-bold">No Response Args Provided</div>
                        )
                    }
                </div>
                </div>
                 </div>
                    
                 
                
            
            
        </>
    )
}