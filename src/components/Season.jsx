import React from "react";

const Season = () => {
    const thumbnails = ["https://i.postimg.cc/Qtb367sm/1139793689.jpg", "https://i.postimg.cc/prLt3dLH/1736171604.jpg"]
  return (
    <div className="season-info">
      <div className="season-title">Season 1</div>
      <div className="season-croakpool">CROAK POOL: 100$CROAK</div>
      <div className="season-desc">
        Players on the leaderboard can split the prize pool equally after the
        end of the season.
      </div>
      <div className="season-thumbnail-list">
        {thumbnails.map((thumbnail, index) => (
          <div key={index} className="season-thumbnail-item">
            <img src={thumbnail} alt={`Frog ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Season;
