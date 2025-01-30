from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import hashlib

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB URI setup
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/"  # Replace with your MongoDB URI
client = MongoClient(app.config["MONGO_URI"])  # Initialize MongoClient
db = client["chatbot"]  # Select the chatbot database

# Node Collection
nodes_collection = db["nodes"]
# Edge Collection
edges_collection = db["edges"]

users_collection = db["users"]

flows_collection = db["flows"]

# Add or update a single Node
@app.route('/nodes', methods=['POST'])
def add_or_update_node():
    try:
        node_data = request.get_json()
        node_id = node_data.get('id')
        if not node_id:
            return jsonify({"error": "Node ID is required"}), 400
        
        # Update if exists, insert if not
        nodes_collection.update_one({'id': node_id}, {'$set': node_data}, upsert=True)
        return jsonify({"message": "Node added/updated successfully", "node_id": node_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/fetch_user",methods=["POST"])
def fetch_user():
    try:
        user_data = request.get_json()
        if "username" not in user_data:
            return jsonify({"error": "Username is required"}), 400
        elif "password" not in user_data:
            return jsonify({"error": "Password is required"}), 400
        else:
            user_get = user_data.get("username")
            password_get = user_data.get("password")
            
            # Find user in the database
            user = users_collection.find_one({"username": user_get, "password": password_get})
            
            if user is None:
                return jsonify({"error": "not_found"}), 200
            else:
                # Create a token from the username and password
                data = user_get + ":" + password_get
                tokenized_data = hashlib.sha256(data.encode()).hexdigest()  # Hash the data using SHA-256
                print(tokenized_data)
                return jsonify({"success": "found", "token": tokenized_data}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "server_error"}), 500
@app.route("/get_flow",methods=["POST"])
def get_flow():
    try:
        get_username = request.get_json()
        if "username" not in get_username:
            return jsonify({"error": "Username is required"}), 400
        else:
            username = get_username.get("username")
             
            
            # Find user in the database
            flows = flows_collection.find_one({"username": username})
            
            if flows is None:
                return jsonify({"error": "not_found"}), 200
            else:
                flows["_id"] = str(flows["_id"])
                return jsonify(flows), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "server_error"}), 500 
    
@app.route("/add_flow",methods=["POST"])
def add_flow():
    try:
        get_flow = request.get_json()
        if "name" not in get_flow:
            return jsonify({"error": "Name is required"}), 400
        elif "username" not in get_flow:
            return jsonify({"error": "Username is required"}), 400
        else:
            
            username = get_flow.get("username")
            name = get_flow.get("name")
            new_flow = {
                "name" : name,
            }
            flows_find = flows_collection.find_one({"username" : username, "flows.name" : name})
            
            try:
                if flows_find is None:
                    flow_add = flows_collection.update_one(
                            {"username": username},
                            {"$push": {"flows": new_flow}}
                        )
                    if flow_add.modified_count > 0:
                        return jsonify({"success":"updated"}), 200
                    else:
                        return jsonify({"error":"not_updated"}), 400
                else:
                    flows_find["_id"] = str(flows_find["_id"])
                    
                    return jsonify({"error": "exists"}), 200
            except Exception as e:
                print(e)
                
                return jsonify({"error": "server_error"}), 500
            
            
            
    except Exception as e:
        print(e)
        return jsonify({"error": "server_error"}), 500
# Add or update a single Edge
@app.route('/edges', methods=['POST'])
def add_or_update_edge():
    try:
        edge_data = request.get_json()
        edge_id = edge_data.get('id')
        if not edge_id:
            return jsonify({"error": "Edge ID is required"}), 400

        # Update if exists, insert if not
        edges_collection.update_one({'id': edge_id}, {'$set': edge_data}, upsert=True)
        return jsonify({"message": "Edge added/updated successfully", "edge_id": edge_id}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Add PUT method for updating a Node
@app.route('/nodes/<string:node_id>', methods=['PUT'])
def update_node(node_id):
    try:
        node_data = request.get_json()
        if not node_data:
            return jsonify({"error": "No data provided"}), 400

        result = nodes_collection.update_one({'id': node_id}, {'$set': {'data': node_data["data"]}})
        if result.matched_count == 0:
            return jsonify({"message": "Node not found"}), 404
        return jsonify({"message": f"Node with id {node_id} updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
@app.route('/nodesPos/<string:node_id>', methods=['PUT'])
def update_node_position(node_id):
    try:
        node_data = request.get_json()
        position = node_data.get('position')
        if not position:
            return jsonify({"error": "Position data is required"}), 400

        result = nodes_collection.update_one(
            {'id': node_id},
            {'$set': {'position': position}}
        )
        
        if result.matched_count == 0:
            return jsonify({"message": "Node not found"}), 404
        
        return jsonify({"message": f"Node {node_id} position updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
# Add PUT method for updating an Edge
@app.route('/edges/<string:edge_id>', methods=['PUT'])
def update_edge(edge_id):
    try:
        edge_data = request.get_json()
        if not edge_data:
            return jsonify({"error": "No data provided"}), 400

        result = edges_collection.update_one({'id': edge_id}, {'$set': edge_data})
        if result.matched_count == 0:
            return jsonify({"message": "Edge not found"}), 404
        return jsonify({"message": f"Edge with id {edge_id} updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get all Nodes
@app.route('/nodes', methods=['GET'])
def get_nodes():
    try:
        # Get the flow_name query parameter if it exists
        flow_name = request.args.get('flow_name')
        
        # If flow_name is provided, filter by flow_name
        if flow_name:
            nodes = nodes_collection.find({'flow': flow_name})
        else:
            nodes = nodes_collection.find()  # Fetch all nodes if no flow_name is provided
        
        result = []
        for node in nodes:
            node["_id"] = str(node["_id"])  # Convert ObjectId to string
            result.append(node)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Update all Nodes
@app.route('/nodes/update_all', methods=['POST'])
def update_all_nodes():
    try:
        nodes_data = request.get_json()  # Get list of nodes
        if not isinstance(nodes_data, list):
            return jsonify({"error": "Invalid data format. A list of nodes is required."}), 400
        
        for node_data in nodes_data:
            node_id = node_data.get('id')
            if node_id:
                nodes_collection.update_one({'id': node_id}, {'$set': node_data}, upsert=True)
        
        return jsonify({"message": "All nodes updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Update all Edges
@app.route('/edges/update_all', methods=['POST'])
def update_all_edges():
    try:
        edges_data = request.get_json()  # Get list of edges
        if not isinstance(edges_data, list):
            return jsonify({"error": "Invalid data format. A list of edges is required."}), 400
        
        for edge_data in edges_data:
            edge_id = edge_data.get('id')
            if edge_id:
                edges_collection.update_one({'id': edge_id}, {'$set': edge_data}, upsert=True)
        
        return jsonify({"message": "All edges updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete a Node by ID
@app.route('/nodes/<string:node_id>', methods=['DELETE'])
def delete_node(node_id):
    try:
        result = nodes_collection.delete_one({'id': node_id})
        if result.deleted_count == 0:
            return jsonify({"message": "Node not found"}), 404
        return jsonify({"message": f"Node with id {node_id} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Delete an Edge by ID
@app.route('/edges/<string:edge_id>', methods=['DELETE'])
def delete_edge(edge_id):
    try:
        result = edges_collection.delete_one({'id': edge_id})
        if result.deleted_count == 0:
            return jsonify({"message": "Edge not found"}), 404
        return jsonify({"message": f"Edge with id {edge_id} deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Get all Edges
@app.route('/edges', methods=['GET'])
def get_edges():
    try:
        # Get the flow_name query parameter if it exists
        flow_name = request.args.get('flow_name')
        
        # If flow_name is provided, filter by flow_name
        if flow_name:
            edges = edges_collection.find({'flow': flow_name})
        else:
            edges = edges_collection.find()  # Fetch all edges if no flow_name is provided
        
        result = []
        for edge in edges:
            edge["_id"] = str(edge["_id"])  # Convert ObjectId to string
            result.append(edge)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Default route
@app.route('/', methods=['GET'])
def home():
    return "Graph Database Server is running!"

if __name__ == "__main__":
    app.run(debug=True, port=5000,host="0.0.0.0")
