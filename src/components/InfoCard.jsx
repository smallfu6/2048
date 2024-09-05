import React, { useState } from "react";
import { MdHelp } from "react-icons/md";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RuleModal from "./RuleModal";

const InfoCard = ({ address, score, level, isMint, onClick, thumbnails }) => {
  const [showModal, setShowModal] = useState(false);
  const hasThumbnails = thumbnails && thumbnails.length > 0;

  const openRuleModal = () => {
    setShowModal(true);
  };

  const closeRuleModal = () => {
    setShowModal(false);
  };

  const handleButtonClick = () => {
    if (isMint) {
      onClick();
    } else {
      toast.info("Minting is not available.");
    }
  };

  return (
    <div className="info-card">
      <div className="card-content">
        <div className="view-rule" onClick={openRuleModal}>
          <MdHelp size={26} />
        </div>
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>Score:</strong> {score}
        </p>
        <div className="level-and-button">
          <p>
            <strong>Level:</strong> {level}
          </p>

          <div
            className={`action-button ${isMint ? "" : "disabled"}`}
            onClick={handleButtonClick} // 仅在 isMint 为 true 时可点击
            // style={{ pointerEvents: isMint ? "auto" : "none" }}
          >
            Mint Badge
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />
        {hasThumbnails && (
          <div className="thumbnail-list">
            {thumbnails.map((thumbnail, index) => (
              <div key={index} className="thumbnail-item">
                <img src={thumbnail} alt={`Badge ${index + 1}`} />
              </div>
            ))}
          </div>
        )}


        {showModal && (
          <div className="modal-content">
            <h2>Info Card</h2>
            <RuleModal onClose={closeRuleModal} isOpen={showModal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
