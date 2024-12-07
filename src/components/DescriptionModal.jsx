import { fontSize, fontWeight, margin } from "@mui/system";
import { Heading } from "lucide-react";
import React from "react";

const DescriptionModal = ({ isOpen, onClose, description }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.heading}>Package Description</h2>
        <div style={styles.descriptionContent}>
          <p>{description || 'Unknown'}</p>
        </div>
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  heading : {
    fontSize:"20px",
    marginBottom:"10px",
    marginTop:"2px",
    fontWeight:"bold"
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px', // Adjusted for a medium-sized modal
    maxHeight: '500px',
    overflowY: 'auto',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  descriptionContent: {
    marginBottom: '20px',
    wordBreak: 'break-word',
  },
  closeButton: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    alignSelf: 'center', // Center button horizontally
  },
};

export default DescriptionModal;