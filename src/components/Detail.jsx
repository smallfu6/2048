import React, { useState } from "react";
import { MdHelp } from "react-icons/md";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoCard from "./InfoCard";
import LeaderboardModal from "./LeaderboardModal";
import Season from "./Season";

const DetailView = ({ address, score, level, isMint, onClick, thumbnails }) => {
  //   const [showModal, setShowModal] = useState(false);
  //   const hasThumbnails = thumbnails && thumbnails.length > 0;

  //   const openRuleModal = () => {
  //     setShowModal(true);
  //   };

  //   const closeRuleModal = () => {
  //     setShowModal(false);
  //   };

  //   const handleButtonClick = () => {
  //     if (isMint) {
  //       onClick();
  //     } else {
  //       toast.info("Minting is not available.");
  //     }
  //   };

  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const [isLoadingLeaber, setIsLoadingLeaber] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const openLeaderboard = {};
  const closeLeaderboard = {};
  const mintNft = {};
  const badgeList = {};

  return (
    <div className="info-container">
      <div className="game-button" onClick={openLeaderboard}>
        Leaderboard
      </div>
      {showLeaderboard && (
        <LeaderboardModal onClose={closeLeaderboard}>
          <h2>Leaderboard</h2>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingLeaber ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : (
                leaderboardData &&
                leaderboardData.map((entry, index) => (
                  <tr key={index}>
                    <td>{formatAddress(entry[0])}</td>
                    <td>{entry[1].toString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </LeaderboardModal>
      )}
      <InfoCard
        address={formatAddress(address)}
        score={score !== null ? score : "Loading..."}
        level={level !== null ? level : "Loading..."}
        isMint={isMint}
        onClick={mintNft}
        thumbnails={badgeList}
      />
      <Season />
    </div>
  );
};

export default DetailView;
