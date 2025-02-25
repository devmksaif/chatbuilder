# Topnet Chat Builder

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Components](#components)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction
Topnet Chat Builder is a React-based chatbot builder that allows users to create and manage chatbots for various platforms. It provides a user-friendly interface for designing and testing chatbot flows, making it easy to create conversational interfaces for your business.

## Features
- **Visual Flow Editor:** Design and test chatbot flows using a visual interface.
- **Node-Based Architecture:** Create and manage nodes for different chatbot scenarios.
- **Edge-Based Connections:** Connect nodes to create complex chatbot flows.
- **Customizable Nodes:** Create custom nodes for specific chatbot scenarios.
- **API Integration:** Integrate with external APIs for data retrieval and processing.
- **User Management:** Manage user roles and permissions for chatbot access.

## Getting Started
### Clone the repository
```bash
git clone https://github.com/topnet-chat-builder/topnet-chat-builder.git
```

### Install dependencies
```bash
npm install
```

### Start the application
```bash
npm start
```

Model LINK : https://drive.google.com/file/d/1fMHxDZOduL4fgmmU-KUr5OrqlapJ_kVT/view

## Usage
1. Create a new chatbot flow:
   - Click the "+" button to create a new chatbot flow.
2. Design the flow by adding nodes and edges.
3. Test the flow by clicking the "Test" button.
4. Deploy the chatbot to your desired platform.

## Components
### NodeBuilder
The main component for building and managing chatbot flows.

### Node
A single node in the chatbot flow.

### Edge
A connection between two nodes in the chatbot flow.

### Menu
A dropdown menu for selecting node types.

### TriggerText
A text input for triggering chatbot responses.

## API Documentation
### `GET /nodes`
Retrieve a list of all nodes in the chatbot flow.

### `POST /nodes`
Create a new node in the chatbot flow.

### `PUT /nodes/:id`
Update a node in the chatbot flow.

### `DELETE /nodes/:id`
Delete a node in the chatbot flow.

## Contributing
Contributions are welcome! Please submit a pull request with your changes.

## License
This project is licensed under the MIT License.
