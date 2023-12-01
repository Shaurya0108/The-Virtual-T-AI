import React from 'react';

const Modal = ({ isVisible, onClose, title, children }) => {
    if (!isVisible) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
};


export default Modal;
