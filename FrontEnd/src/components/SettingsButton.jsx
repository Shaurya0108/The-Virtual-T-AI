import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from "../icons/SettingsIcon.svg";
import Modal from './Modal';

export default function SettingsButton() {
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [isSettingsIconRotated, setIsSettingsIconRotated] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleSettingsDropdown = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsSettingsIconRotated(!isSettingsIconRotated);
    };

    const handleOptionClick = (option) => {
        setModalContent(option);
        setIsModalVisible(true);
        setIsSettingsDropdownOpen(false);
    };

    /*const handleProfileClick = () => {
        navigate('/profile');
    };*/

    const handleLogoutClick = () => {
        navigate('/');
    };

    /*const handleHelpClick = () => {
        navigate('/help');
    };*/

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSettingsDropdownOpen(false);
            }
        }

        if (isSettingsDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsDropdownOpen]);

    return (
        <>
            <button className="settings-button" onClick={toggleSettingsDropdown}>
                <img src={SettingsIcon} alt="Settings Icon" className={`settings-icon ${isSettingsIconRotated ? 'rotate' : ''}`} />
            </button>
            {isSettingsDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-settingsbutton absolute right-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleOptionClick("Profile")}>Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogoutClick}>Logout</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleOptionClick("Help")}>Help</a>
                </div>
            )}
            <Modal 
                isVisible={isModalVisible} 
                onClose={() => setIsModalVisible(false)}
                title={modalContent}
            >
                <p>Content for {modalContent}</p>
                
            </Modal>
        </>
    );
}
