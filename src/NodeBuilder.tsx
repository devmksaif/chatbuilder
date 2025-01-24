import {
    Background,
    Controls,
    Edge,
    ReactFlow,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    type OnConnect,
    type OnEdgesChange,
    type OnNodesChange,
    type OnEdgesDelete,
    type OnNodesDelete,
    MarkerType,
    MiniMap,
    getIncomers,
    getOutgoers,
    getConnectedEdges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import AITrigger from './AITrigger';
import { Menu } from './Menu';
import MenuTrigger from './MenuTrigger';
import TriggerText from './TriggerText';
import TopnetAI from './topnet.png'
import MenuTriggerWithText from './MenuTriggerWithText';
import CheckConditionLength from './CheckConditionLength';
import { Alarm, House, Folder, Gear, QuestionCircle, DatabaseAdd, LightningCharge } from 'react-bootstrap-icons';
import { TextProps } from './TextProps';
import InputTextTrigger from './InputTextTrigger';
import { ModifiedNode } from './ModifiedNode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import CustomEdge from './CustomEdge';
import APIFetchTrigger from './APIFetchTrigger';
import OllamaTrigger from './OllamaTrigger';
import { RingLoader } from 'react-spinners';
import CreateFlow from './Modal';
import Badge from './Badge';
import Divider from './Divider';
import { AiFillApi, AiFillCloud, AiFillFolder, AiOutlineAccountBook, AiOutlineFolder, AiOutlineFolderAdd, AiOutlineFolderView, AiOutlineGateway, AiOutlineLogout, AiOutlineProfile, AiOutlineRobot, AiOutlineSetting, AiOutlineUser, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUserSwitch } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
interface InputTypes {
    name: string
}

interface MessageStructure {
    msg: string,
    sender: string,
}
interface MenuOptions {
    options: Menu[];
}
const initialNodes: ModifiedNode[] = [


];


const initialEdges: Edge[] = [

];

function NodeBuilder() {
    const [nodes, setNodes] = useState<ModifiedNode[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [nodeId, setNodeId] = useState<Number>(null)
    const [nameNode, setNameNode] = useState<String>("")
    const [getMessage, setMessage] = useState<string>("")
    const [messages, setMessages] = useState<MessageStructure[]>([])
    const [currentIndex, setCurrentIndex] = useState<string>("1")
    const [selectedInputNode, setSelectedInputTypeNode] = useState<string>("inputNode")
    const [menusStack, setMenusStack] = useState<MenuOptions[]>([]);
    const username = useRef<string>("")
    const [selectedEdge, setSelectedEdge] = useState<string>(null)
    const [fieldFormToggle, setFieldFormToggle] = useState<TextProps>(null)
    const [inputTriggerNode, setInputTriggerNode] = useState<string>("")
    const [dashboardToggle, setDashboardShown] = useState<boolean>(true)
    const [flowsToggle, setFlowsShown] = useState<boolean>(false)
    const [flows, setFlowsList] = useState([])
    const [currentFlow, setCurrentFlow] = useState("")
    const [loading, setLoading] = useState<boolean>(false)
    const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);
    const [preparedQuery, setPreparedQuery] = useState({})

    const openCreateFlow = () => setIsCreateFlowOpen(true);
    const closeCreateFlow = () => setIsCreateFlowOpen(false);


    const EdgesType = {
        smoothStep: CustomEdge
    }

    const inputTypes: InputTypes[] = [
        {
            name: "inputNode"
        },
        {
            name: "aiNode"
        },
        {
            name: 'menuTrigger'
        },
        {
            name: 'menuTriggerWithText'
        },
        {
            name: 'checkConditionLength'
        },
        {
            name: 'fieldFormNode'
        },
        {
            name: 'apiFetch'
        },
        {
            name : "ollamaTrigger"
        }
    ]
    const NodeTypes = {
        inputNode: TriggerText,
        aiNode: AITrigger,
        menuTrigger: MenuTrigger,
        menuTriggerWithText: MenuTriggerWithText,
        checkConditionLength: CheckConditionLength,
        fieldFormNode: InputTextTrigger,
        apiFetch: APIFetchTrigger,
        ollamaTrigger : OllamaTrigger
    }
    const navigate = useNavigate();
    const handleNameNodeChange = (e) => {
        const text = e.target.value
        setNameNode(text)
    }

    const getMessageHandle = (e) => {
        const inputMessage = e.target.value;
        setMessage(inputMessage);
    };

    const handleInputTypeChange = (e) => {
        const selectedNode = e.target.value
        setSelectedInputTypeNode(selectedNode)
    }



    const sendMessage = async (message: string) => {
        const sentMessage = message.trim().toLowerCase();
        if (!sentMessage) return;

        setMessages(prev => [...prev, { msg: sentMessage, sender: "You" }]);
        const connectedSources = edges.filter(edge => edge.source === currentIndex);

        for (const edge of connectedSources) {
            const node = nodes.find(n => n.id === edge.target);
            if (!node || node.triggered) continue;

            if (
                handleInputNode(node, sentMessage) ||
                await handleApiNode(node, sentMessage) ||
                handleMenuNodeWithText(node, sentMessage) ||
                handleFieldFormNode(node, sentMessage) ||
                await handleApiFetchNode(node)
            ) break;
        }
        setMessage("");
    };

    const handleInputNode = (node: ModifiedNode, sentMessage: string) => {
        if (node.type === 'inputNode' && sentMessage.includes(node.data.inputValue.toLowerCase().trim())) {
            triggerNode(node);
            setMessages(prev => [...prev, { msg: node.data.responseValue, sender: "AI" }]);
            handleNextNodes(node);
            return true;
        }
        return false;
    };

    const handleMenuNodeWithText = (node: ModifiedNode, sentMessage: string) => {
        if (node.type === "menuTriggerWithText" && sentMessage.includes(node.data.inputValue.toLowerCase().trim())) {
            triggerNode(node);
            setMessages(prev => [...prev, { msg: node.data.responseValue, sender: "AI" }]);
            pushMenu(node);
            handleNextNodes(node);
            return true;
        } else if (node.type === "menuTriggerWithText" && /^\d{8}$/.test(sentMessage)) {
            triggerNode(node);
            pushMenu(node);
            handleNextNodes(node);
            return true;
        }
        return false;
    };

    const handleFieldFormNode = (node: ModifiedNode, sentMessage: string) => {
        if (node.type === "fieldFormNode" && sentMessage.includes(node.data.inputValue.toLowerCase().trim())) {
            triggerNode(node);
            setFieldFormToggle(node.data.fieldForm);
            handleNextNodes(node);
            return true;
        }
        return false;
    };

    const handleApiNode = async (node: ModifiedNode, sentMessage: string) => {
        if (node.type === 'aiNode') {
            try {
                const response = await axios.post(node.data.apiValue, { query: sentMessage });
                if (response.data.intent === node.data.inputValue) {
                    triggerNode(node);
                    setMessages(prev => [...prev, { msg: node.data.responseValue, sender: "AI" }]);
                    handleNextNodes(node);
                    return true;
                }
            } catch {
                console.log("Error: cannot connect to the server");
            }
        }
        return false;
    };

    const handleApiFetchNode = async (node: ModifiedNode) => {
        if (node.type === "apiFetch") {
            triggerNode(node);
            let preparedStatement = {}
            preparedStatement[preparedQuery["name"].toLowerCase()] = preparedQuery["text"]
            try {
                const response = await axios.post(node.data.apiValue, preparedStatement);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setMessages(prev => [...prev, { msg: node.data.responseValue, sender: "AI" }]);
                    response.data.forEach(item => {
                        const appendMessages = node.data.responseArgsList
                            .map(arg => item[arg.responseArgName] ? `${capitalize(arg.responseArgName)}: ${item[arg.responseArgName]}` : "")
                            .filter(Boolean)
                            .join(" \n");
                        if (appendMessages) {
                            setMessages(prev => [...prev, { msg: appendMessages.trim(), sender: "AI" }]);
                        }
                    });
                } else {
                    setMessages(prev => [...prev, { msg: node.data.fallBackMessage, sender: "AI" }]);
                }
            } catch (e) {
                console.log(e);
            }
            return true;
        }
        return false;
    };

    const handleNextNodes = (node: ModifiedNode) => {
        const nextNodes = getNextNodes(node);
        const nextNode = nextNodes[0]
        if (nextNode) {
            if (nextNodes.length > 0 && nextNode.type === "menuTrigger" && !nextNode.triggered) {
                triggerNode(nextNodes[0]);
                pushMenu(nextNodes[0]);
            }
        }

    };

    const triggerNode = (node) => {
        node.triggered = true;
        setCurrentIndex(node.id);
    };

    const getNextNodes = (node) => edges.filter(edge => edge.source === node.id).map(edge => nodes.find(n => n.id === edge.target)).filter(Boolean);

    const pushMenu = (node) => setMenusStack(prev => [...prev, { options: node.data.menuList }]);

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);



    const resetNodes = (): void => {
        setNodes((prevNodes) => {
            let updatedNodes: ModifiedNode[] = [...prevNodes];
            setMenusStack([])
            updatedNodes.forEach((node, index) => {
                if (node.triggered === true) {
                    node.triggered = false;
                }
            });

            return updatedNodes;
        });
        setCurrentIndex("1")
        return;

    }




    useEffect(() => {
        const fetchUsername = async () => {
            const Session = Cookies;
            const token = await Session.get('token');
            if (token != undefined) {
                const splitToken = String(token).split(":");
                username.current = splitToken[0];
            } else {
                navigate("/");
            }
        };

        const fetchFlows = async () => {
            const Session = Cookies;
            const token = await Session.get('token');
            if (token != undefined) {
                const splitToken = String(token).split(":");
                const username = splitToken[0];
                setLoading(true)
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL_MAIN}/get_flow`, { username: username });
                    if (response.data.flows) {
                        setFlowsList(response.data.flows);
                        setCurrentFlow(response.data.flows[0].name)
                        setLoading(false)
                    } else {
                        setFlowsList([]);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchUsername();
        fetchFlows();
    }, []);

    const updateNodePositionInAPI = async (node: ModifiedNode) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL_MAIN}/nodesPos/${node.id}`, {
                position: node.position,
            });
            console.log('Node position updated successfully!');
        } catch (error) {
            console.error('Error updating node position:', error);
        }
    };
    const fetchNodesEdges = (current: string) => {
        setLoading(true);
        setTimeout(async () => {
            setNodes([])
            setEdges([])

            try {
                const edgesF = await axios.get(`${process.env.REACT_APP_API_URL_MAIN}/edges?flow_name=${current}`);
                const nodesF = await axios.get(`${process.env.REACT_APP_API_URL_MAIN}/nodes?flow_name=${current}`);

                if (nodesF.data.length > 0) {
                    const arrOfNodes = nodesF.data.filter((item) => item.flow === currentFlow);
                    arrOfNodes.push({
                        id: '1',
                        data: { label: 'Hello', inputValue: '', responseValue: '', apiValue: '', menuList: [], fieldForm: null, enableInput: false, flow: currentFlow, dataArgsList: [], responseArgsList: [] },
                        position: { x: 0, y: 0 },
                        type: 'inputNode',
                        triggered: false,
                        flow: currentFlow
                    })
                    const updatedNodes = arrOfNodes.map((node) => ({
                        ...node,
                        triggered: false,

                    }));


                    setNodes(updatedNodes);

                } else {
                    setNodes(prev => ([...prev, {
                        id: '1',
                        data: { label: 'Hello', inputValue: '', responseValue: '', apiValue: '', menuList: [], fieldForm: null, enableInput: false, flow: currentFlow, dataArgsList: [], responseArgsList: [], fallBackMessage: "" },
                        position: { x: 0, y: 0 },
                        type: 'inputNode',
                        triggered: false,
                        flow: currentFlow
                    }]))
                }

                if (edgesF.data.length > 0) {
                    const arrOfEdges = edgesF.data.filter((item) => item.flow === currentFlow);


                    setEdges(arrOfEdges);
                }

                setLoading(false);
            } catch (error) {
                setLoading(true);
                console.error('Error fetching from the server:', error);
            }
        }, 2000);
    };


    useEffect(() => {


        if (currentFlow) {

            fetchNodesEdges(currentFlow);
        }
    }, [currentFlow]);











    const removeNode = async (id: string) => {
        const NODE_URL = `${process.env.REACT_APP_API_URL_MAIN}/nodes/${id}`
        try {
            await axios.delete(NODE_URL);
            setNodes((prevNodes) => prevNodes.filter((item) => item.id !== id));
            setEdges((prevEdges) => prevEdges.filter((item) => item.source !== id && item.target !== id));

        } catch (error) {
            console.error("Error removing the node:", error);
        }
    };

    const removeEdge = async (id: string) => {
        const EDGES_URL = `${process.env.REACT_APP_API_URL_MAIN}/edges/${id}`
        try {
            await axios.delete(EDGES_URL);
            setEdges((prevEdges) => prevEdges.filter((item) => item.id !== id));

        } catch (error) {
            console.error("Error removing the edge:", error);
        }
    };





    const addNewNode = async () => {
        let getMax: number = nodes.reduce((max, node) => Math.max(max, Number(node.id)), 0) + 1;

        if (nameNode) {
            const newNode: ModifiedNode = {
                id: crypto.randomUUID(),
                data: { label: nameNode, inputValue: '', responseValue: '', apiValue: '', menuList: [], fieldForm: null, enableInput: false, flow: currentFlow, dataArgsList: [], responseArgsList: [], fallBackMessage: "" },
                position: { x: Math.random() * 100, y: 100 },
                type: selectedInputNode,
                triggered: false,
                flow: currentFlow

            };

            setNodes((prevNodes) => [...prevNodes, newNode]);
            try {
                const nodeResponse = await axios.post(`${process.env.REACT_APP_API_URL_MAIN}/nodes`, newNode);
                toast.success("Node added successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } catch {
                toast.error("Error creating new node", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }


        }
    };




    const onNodesChange: OnNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => {
                const updatedNodes = applyNodeChanges(changes, nds) as ModifiedNode[];

                changes.forEach((change) => {
                    if (change.type === 'select' && change.selected) {
                        setNodeId(Number(change.id));
                    } else if (change.type === 'remove') {
                        removeNode(change.id)
                    } else if (change.type === "position") {
                        const node = updatedNodes.find((node) => node.id === change.id);
                        if (node) {
                            updateNodePositionInAPI(node);
                        }
                    }
                });
                return updatedNodes;
            });
        },
        [setNodes]
    );


    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => {
                const updatedNodes = applyEdgeChanges(changes, eds) as Edge[];
                changes.forEach((change) => {
                    if (change.type === 'select' && change.selected) {
                        setSelectedEdge(change.id);
                    } else if (change.type === 'remove') {
                        removeEdge(change.id)
                    }
                });
                return updatedNodes;
            });
        },
        [setEdges]
    );
    const onConnect = useCallback(
        async (connection) => {
            const sourceNode = nodes.find(node => node.id === connection.source);
            const targetNode = nodes.find(node => node.id === connection.target);

            const dynamicLabel = sourceNode?.id + ' -> ' + targetNode?.id;

            const newEdge = {
                ...connection,

                id: crypto.randomUUID(),
                label: dynamicLabel || 'No Label',
                labelStyle: { fontWeight: 600, fontSize: 12, fill: '#333' },
                style: { stroke: sourceNode.type === "aiNode" ? 'purple' : sourceNode.type === "inputNode" ? "blue" : "green", strokeWidth: 2 },
                markerEnd: { type: MarkerType.Arrow },
                type: "smoothStep",
                flow: currentFlow
            };
            setEdges((eds) => addEdge(newEdge, eds));
            try {
                const nodeResponse = await axios.post(`${process.env.REACT_APP_API_URL_MAIN}/edges`, newEdge);
            } catch {
                console.log("Server Error")
            }


        },
        [nodes, setEdges]
    );



    const exportToFile = () => {

        const fileData = [
            { fileName: 'edges.json', content: JSON.stringify(edges) },
            { fileName: 'nodes.json', content: JSON.stringify(nodes) }
        ];


        fileData.forEach((file) => {
            const blob = new Blob([file.content], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = file.fileName;


            link.click();
        });
    };




    const currentMenu = menusStack.length > 0 ? menusStack[0] : null;


    const handleMenuClick = async (e) => {
        const getValue: string = e.target.value
        await sendMessage(getValue)
        console.log(menusStack)
        setMenusStack(prevStack => prevStack.splice(0, 1));
    }

    const handleTextChangeNode = (e) => {
        const textInput: string = e.target.value
        fieldFormToggle.text = textInput

        setInputTriggerNode(textInput)
        setPreparedQuery(JSON.parse(JSON.stringify(fieldFormToggle)))

    }

    const handleTextSendNode = () => {

        sendMessage(fieldFormToggle.text)
        setFieldFormToggle(null)


    }

    const handleLogout = () => {
        const Session = Cookies
        const Token = Session.get("token");
        if (Token != undefined) {
            Session.remove("token");
            navigate("/")
        }
    }

    return (

        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-white   p-6">
                    <div className="flex justify-center mb-6 grid grid-flow-row items-center">
                        <img src={TopnetAI} alt="AI" className="w-40 h-40 rounded-full border-4 border-blue-100 shadow-md" />
                        <div className='grid grid-flow-row mt-3'>
                            <div className='p-3 text-gray-500 font-semibold'>{username.current}</div>
                            <Badge text={"Admin"} />
                        </div>
                    </div>
                    <ul className="space-y-3">
                        <Divider text={"Home"} />
                        <li className="group">
                            <div className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm">
                                <House className="w-6 h-6 text-blue-500 mr-3" />
                                <button className="text-gray-700 font-medium group-hover:text-blue-600" onClick={() => {
                                    setDashboardShown(true);
                                    setFlowsShown(false);
                                }}>Tableau de bord</button>
                            </div>
                        </li>
                        <li className="group">
                            <div className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm">
                                <AiOutlineProfile className="w-6 h-6 text-blue-500 mr-3" />
                                <button className="text-gray-700 font-medium group-hover:text-blue-600" onClick={() => {
                                    setDashboardShown(true);
                                    setFlowsShown(false);
                                }}>Profile</button>
                            </div>
                        </li>
                        <Divider text={"Toolkit"} />
                        <li className="group" onClick={() => {
                            setFlowsShown(true);
                            setDashboardShown(false);
                            fetchNodesEdges(currentFlow)
                        }}>
                            <p className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm" >
                                <AiOutlineGateway
                                    size={28}
                                    className="text-blue-500 mr-3 flex-shrink-0"
                                />
                                <span className="text-gray-700 font-medium group-hover:text-blue-600">Flows</span>
                            </p>
                            <ul className="hidden group-hover:block">
                                <li>

                                    <button onClick={openCreateFlow} className="flex items-center p-3 pl-5 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm w-full  ">
                                        <AiOutlineFolderAdd size={28} className='text-blue-500 mr-3' />
                                        <span className="text-gray-700 font-medium hover:text-blue-600">Nouveau flow</span>
                                    </button>

                                </li>
                                {flows.map((item, index) => (
                                    <li key={index} className="items-center flex">
                                        <button
                                            onClick={() => {
                                                setCurrentFlow(item.name);
                                                fetchNodesEdges(item.name);
                                                setFlowsShown(true);
                                                setDashboardShown(false);
                                            }}
                                            className="flex-row flex items-center p-3 pl-10 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm w-full"
                                        >
                                            <AiOutlineFolderView
                                                size={28}
                                                className="text-blue-500 mr-3 flex-shrink-0"
                                            />
                                            <span className="text-gray-700 font-medium hover:text-blue-600 truncate">
                                                {item.name}
                                            </span>
                                        </button>
                                    </li>
                                ))}

                            </ul>
                        </li>
                        <li className="group">
                            <p className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm">
                                <Gear className="w-6 h-6 text-blue-500 mr-3" />
                                <span className="text-gray-700 font-medium group-hover:text-blue-600">Settings</span>
                            </p>
                            <ul className="hidden group-hover:block">
                                <li>
                                    <button onClick={handleLogout} className="flex items-center p-3 pl-10 w-full rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm">
                                        <AiOutlineLogout
                                            size={28}
                                            className="text-blue-500 mr-3 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 font-medium hover:text-blue-600">Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li className="group">
                            <p className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm">
                                <AiOutlineRobot
                                    size={28}
                                    className="text-blue-500 mr-3 flex-shrink-0"
                                />
                                <span className="text-gray-700 font-medium group-hover:text-blue-600">Administration</span>
                            </p>
                            <ul className="hidden group-hover:block">
                                <li>
                                    <button onClick={handleLogout} className="flex items-center p-3 pl-10 w-full rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm">
                                        <AiOutlineUserAdd
                                            size={28}
                                            className="text-blue-500 mr-3 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 font-medium hover:text-blue-600">Add new users</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center p-3 pl-10 w-full rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm">
                                        <AiOutlineUserDelete
                                            size={28}
                                            className="text-blue-500 mr-3 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 font-medium hover:text-blue-600">Remove users</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center p-3 pl-10 w-full rounded-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-sm">
                                        <AiOutlineUserSwitch
                                            size={28}
                                            className="text-blue-500 mr-3 flex-shrink-0"
                                        />
                                        <span className="text-gray-700 font-medium hover:text-blue-600">Modify users</span>
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <Divider text={"Others"} />
                        <li className="group">
                            <a href="#" className="flex items-center p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-50 group-hover:shadow-sm">
                                <QuestionCircle className="w-6 h-6 text-blue-500 mr-3" />
                                <span className="text-gray-700 font-medium group-hover:text-blue-600">Help</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                    {dashboardToggle && !flowsToggle ? (
                        <div className="w-full h-full">
                            <Dashboard flowsArray={flows} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {
                                loading ? (
                                    <div className='items-center justify-center   h-screen flex'>

                                        <RingLoader color="blue" loading={loading} size={64} />
                                    </div>

                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-4 left-0 relative">
                                        <label className="text-lg font-medium">Node Name</label>
                                        <input
                                            type="text"
                                            onChange={handleNameNodeChange}
                                            placeholder="Input name node"
                                            className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 ring-1 ring-gray-200"
                                        />
                                        <select
                                            onChange={handleInputTypeChange}
                                            className="w-full p-2 pl-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 "
                                        >
                                            {inputTypes.map((item, index) => (
                                                <option key={index} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex justify-between gap-2 ">
                                            <button
                                                onClick={addNewNode}
                                                className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"
                                            >
                                                Add new node
                                            </button>
                                            <button
                                                onClick={resetNodes}
                                                className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 transition-all duration-300  rounded-full"
                                            >
                                                Reset nodes
                                            </button>
                                            <button
                                                onClick={exportToFile}
                                                className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 transition-all duration-300  rounded-full"
                                            >
                                                Export flow
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md right-bottom">
                                <div className="messages overflow-y-auto max-h-96">
                                    {messages.map((item, index) => (
                                        <div key={index} className="py-2 text-left">
                                            {item.sender}: {item.msg}
                                        </div>
                                    ))}
                                    {currentMenu && (
                                        <div>
                                            <div className="text-lg font-medium">AI: Please choose an option:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {currentMenu.options.map((menuItem, index) => (
                                                    <button key={index} onClick={handleMenuClick} value={menuItem.value} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                                        {menuItem.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {fieldFormToggle && (
                                        <div>
                                            <div className="text-lg font-medium">AI: Saisir le {fieldFormToggle.name}:</div>
                                            <div className="flex flex-wrap gap-2 items-center justify-center">
                                                <input type="text" className="w-full p-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={inputTriggerNode} onChange={handleTextChangeNode} />
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg self-center" onClick={handleTextSendNode}>
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {currentMenu || fieldFormToggle != null ? null : (
                                    <>
                                        <input
                                            type="text"
                                            className="w-full p-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={getMessage}
                                            placeholder='Saisir votre message ici...'
                                            onChange={getMessageHandle}
                                        />
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                            onClick={() => sendMessage(getMessage)}
                                        >
                                            Send
                                        </button>
                                    </>
                                )}
                            </div>
                            {
                                loading ? (
                                    <div className='items-center justify-center   h-screen flex'>

                                        <RingLoader color="blue" loading={loading} size={64} />
                                    </div>

                                ) : (

                                    <div className="flex justify-center items-center" style={{ height: 1000, width: '100%' }}>
                                        <CreateFlow isOpen={isCreateFlowOpen} onClose={closeCreateFlow} />
                                        <ReactFlow
                                            nodes={nodes}
                                            onNodesChange={onNodesChange}
                                            edges={edges}
                                            onEdgesChange={onEdgesChange}
                                            onConnect={onConnect}
                                            nodeTypes={NodeTypes}
                                            edgeTypes={EdgesType}

                                            minZoom={0.02}
                                            maxZoom={1.5}


                                            fitView
                                        >
                                            <Background />
                                            <Controls />
                                            <MiniMap />
                                        </ReactFlow>
                                        <ToastContainer />
                                    </div>
                                )
                            }

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default NodeBuilder;
