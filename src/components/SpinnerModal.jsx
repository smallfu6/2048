import React from "react";

const SpinnerModal = ({ isProcessing, isSuccess, isFailed }) => {
  console.log(isProcessing, isSuccess);
  return (
    <div className={`spinner-modal ${!isProcessing ? "hidden" : ""}`}>
      {isProcessing && !isSuccess && !isFailed && ( // 交易进行中
        <>
          <div className="spinner"></div>
          <p>Processing, please wait...</p>
        </>
      )}
      {isProcessing && isSuccess && !isFailed && ( // 交易成功 
        <div className="success-message">
          <div className="checkmark">&#10003;</div>
          <p>Transaction successful!</p>
        </div>
      )}
      {isProcessing && !isSuccess && isFailed && ( // 交易失败
        <div className="error-message">
          <div className="error-icon">&#10007;</div> 
          <p>Transaction failed!</p>
        </div>
    )}
    </div>
  );
};

export default SpinnerModal;


 
