import React from 'react';


const InfoCard = ({ address, score }) => {
    return (
      <div className="info-card">
        <div className="card-content">
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Score:</strong> {score}</p>
        </div>
      </div>
    );
  };

export default InfoCard;