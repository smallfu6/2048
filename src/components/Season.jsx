import React from "react";

const Season = () => {
  const thumbnails = [
    "https://i.postimg.cc/Dw7WRn3w/222473476.jpg",
    "https://i.postimg.cc/VvyvgcF1/1121023062.jpg",
    "https://i.postimg.cc/zDWVBVJf/412488340.jpg",
    "https://i.postimg.cc/13WzTFKv/571047829.jpg",
    "https://i.postimg.cc/26dNpRDC/685207603.jpg",
    "https://i.postimg.cc/nr08z4r5/1639793194.jpg",
  ];
  const imageList = thumbnails.concat(thumbnails);

  return (
    <div className="season-info">
      {/* <div className="season-title animated-title">Season 1</div> */}
      <div className="season-croakpool animated-croakpool">
        CROAK POOL: 100$CROAK
        <img
          src="https://lineascan.build/token/images/croak_32.png"
          alt="CROAK icon"
          className="croak-icon"
        />
      </div>
      <div className="season-desc animated-desc">
        Players on the leaderboard can split the prize pool equally after the
        end of the season, and there is also a chance to receive an eFrog NFT.
      </div>
      <div className="season-thumbnail-wrapper">
        <div className="season-thumbnail-list">
          {imageList.map((thumbnail, index) => (
            <div key={index} className="season-thumbnail-item">
              <img src={thumbnail} alt={`Frog ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Season;
