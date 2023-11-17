import React from 'react';

const Modal = ({ isVisible, onClose, title, children }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>{title}</h2>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};


export default Modal;
