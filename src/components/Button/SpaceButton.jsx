// SpaceButton.js
import React from 'react';
import './SpaceButton.css';

const SpaceButton = ({ text = "SPACE", onClick }) => {
  return (
    <button type="button" className="space-btn" onClick={onClick}>
      <strong>{text}</strong>
      <div id="container-stars">
        <div id="stars"></div>
      </div>
      <div id="glow">
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
    </button>
  );
};

export default SpaceButton;
