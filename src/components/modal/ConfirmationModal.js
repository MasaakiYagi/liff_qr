import React, { useState, useEffect } from "react";
import "./ConfirmationModal.css";

function ConfirmationModal({ stationaryId, handleMessageSend }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleOk = () => {
    handleMessageSend();
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <div className="modal-container">
          <div className="modal-content">
            <p className="modal-message">{`商品番号 ${stationaryId} を確認しました。`}</p>
            <button className="modal-ok-button" onClick={handleOk}>
              送信
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmationModal;
