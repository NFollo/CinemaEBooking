import React from 'react';
import './SendPromotionModal.css';

function SendPromotionModal({ promotion, userCount, onClose, onSend }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Send Promotion</h2>
        <p>Are you sure you want to send the promotion "{promotion.promo_code}"?</p>
        <p><strong>Warning:</strong> This promotion will be sent to {userCount} users.</p>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSend(promotion)}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default SendPromotionModal;
