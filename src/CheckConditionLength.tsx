import { Handle, Position } from "@xyflow/react";
import React from "react";


function CheckConditionLength({ isConnectable, data, id }) {
    const [conditionInput, setConditionInput] = React.useState<string>("0");


    const handleConditionInput = (e) => {
        const textInput = e.target.value;
        if(textInput === ''){
            setConditionInput("0");
        } else if(isNaN(textInput)){
            setConditionInput("0");
        }else {
            setConditionInput(textInput);
            data.inputValue = textInput;
        }
    }
    return (
        <>


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
            <div>
                <h2>Check Condition</h2>
                <input type="text" className="right-bottom-input w-full p-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Condition Length" value={data.inputValue} onChange={handleConditionInput} />
            </div>

            
        </>
    )
}


export default CheckConditionLength;