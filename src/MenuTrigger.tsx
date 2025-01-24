import { Handle, Position } from '@xyflow/react'
import React, { useState, useEffect } from 'react'
import { Menu } from './Menu';
import axios from 'axios';
import { ModifiedNode } from './ModifiedNode';
import { debounce } from 'lodash';


export default function MenuTrigger({ isConnectable, data, id, }) {

    const [listMenus, setListMenus] = useState<Menu[]>([]);
    const [inputValue , setInputValue] = useState('');
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
    const updateDataDebounced = debounce(async (updatedData) => {
        await updateData(updatedData);
    }, 300); // Adjust delay as necessary
    useEffect(() => {
        const updatedData = { ...data, menuList: [...listMenus] };
        updateDataDebounced(updatedData);
     
    }, [listMenus]);

    const addNewMenu = () => {
        const newId = listMenus.length + 1;
        setListMenus((prevMenus) => [
            ...prevMenus,
            { // Add the new menu at the end
                name: `New Menu ${newId}`,
                value: '',
                id: newId
            }
        ]);
    }
        
    const handleMenuChange = (id: number, field: string, value: string) => {
        setListMenus((prevMenus) =>
            prevMenus.map(menu =>
                menu.id === id ? { ...menu, [field]: value } : menu
            )
        );
        
        
    }

    const deleteMenu = (id: number) => {
        setListMenus((prevMenus) => prevMenus.filter(menu => menu.id !== id));
      
    }

    useEffect(() => { 
        if(data.menuList){
            setListMenus(data.menuList)
            
        }
    
    },[data.menuList])

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
                
                <button onClick={addNewMenu} className="button-send">
                    Add new menu
                </button>
                {
                    listMenus.length > 0 ? (
                        listMenus.map((menu) => (
                            <div key={menu.id} style={{ margin: '10px 0', flexDirection: "column" }}>
                                <input
                                    style={{
                                        padding: '8px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        marginBottom: '10px',
                                        width: '100%',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                    }}
                                    type="text"
                                    value={menu.value}
                                    onChange={(e) => handleMenuChange(menu.id, 'value', e.target.value)}
                                    placeholder="Menu value"
                                />
                                {/* Delete button next to each menu */}
                                <button onClick={() => deleteMenu(menu.id)} style={{ marginTop: '5px' }} className="button-send">
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <div>No menus to show</div>
                    )
                }
            </div>
        </>
    );
}
