import React from "react";

const InfoCard = ({ address, score, level, isMint, onClick, thumbnails }) => {
  console.log("evsdd", level);
  const hasThumbnails = thumbnails && thumbnails.length > 0;
  return (
    <div className="info-card">
      <div className="card-content">
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Score:</strong> {score}
        </p>
        <p>
          <strong>Level:</strong> {level}
        </p>
        <button
          className={`action-button ${isMint ? "" : "disabled"}`}
          disabled={!isMint}
          onClick={onClick}
        >
          Click Me
        </button>
        { hasThumbnails ? (<div className="thumbnail-list">
          {thumbnails.map((thumbnail, index) => (
            <div key={index} className="thumbnail-item">
              <img src={thumbnail} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>)
        : (
          <p>No thumbnails available</p> // 或者使用占位图像或其他提示
        )}
      </div>
    </div>
  );
};

export default InfoCard;
