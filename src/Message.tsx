import React from 'react';
import './App.css';

const Message = (props) => {
  return (
    <div className={`message ${props.sender}`}>
      <p>{props.msg}</p>
    </div>
  );
};

export default Message;
