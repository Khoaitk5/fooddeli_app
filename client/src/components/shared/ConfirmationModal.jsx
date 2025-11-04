// File: src/components/shared/ConfirmationModal.jsx
// (Đây là file mới)

import React from "react";
import { useOrder } from "../../contexts/OrderContext";

// --- STYLES ---
const s = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '1.2rem',
    padding: '2.5rem',
    width: '80vw',
    maxWidth: '300px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  message: {
    fontSize: '1.4rem',
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
    lineHeight: '1.5',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  button: {
    flex: 1,
    padding: '1.2rem',
    fontSize: '1.3rem',
    fontWeight: '600',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#F2F2F2',
    color: 'black',
  },
  confirmButton: {
    backgroundColor: '#2BCDD2',
    color: 'white',
  },
};
// --- END STYLES ---

const ConfirmationModal = () => {
  const { confirmation, hideConfirmation } = useOrder();

  if (!confirmation.isOpen) {
    return null;
  }

  const handleConfirm = () => {
    confirmation.onConfirm(); // Chạy hàm "Có"
    hideConfirmation();       // Đóng modal
  };

  const handleCancel = () => {
    hideConfirmation();       // Đóng modal
  };

  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.message}>{confirmation.message}</div>
        <div style={s.buttonContainer}>
          <button
            style={{ ...s.button, ...s.cancelButton }}
            onClick={handleCancel}
          >
            Không
          </button>
          <button
            style={{ ...s.button, ...s.confirmButton }}
            onClick={handleConfirm}
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;