import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from "../icons/SettingsIcon.svg";
import Modal from './Modal';

export default function SettingsButton() {
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isSettingsIconRotated, setIsSettingsIconRotated] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const [modalTitle, setModalTitle] = useState("");

    const userInfo = {
        name: "John",
        lastName: "Doe",
        email: "john.doe@example.com"
    };

    const toggleSettingsDropdown = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsSettingsIconRotated(!isSettingsIconRotated);
    };

    const handleProfileClick = () => {
        setModalTitle("Profile");
        setModalContent(
            <div className="modal-content">
                <p>Name: {userInfo.name}</p>
                <p>Last Name: {userInfo.lastName}</p>
                <p>UTD Email: {userInfo.email}</p>
            </div>
        );
        setIsModalVisible(true);
    };

    const handleLogoutClick = () => {
        navigate('/');
    };

    const handleHelpClick = () => {
        setModalTitle("Help");
        setModalContent(
            <div className="modal-content">
                <h3 style={{ fontSize: 'larger', textAlign: 'center', fontWeight: 'bold' }}>Welcome to The Virtual Teacher Assistant webpage!</h3>
                <br />
                <p style={{ fontWeight: 'bold' }}>Are you looking for something?</p>
                    <li>    The <span style={{ textDecoration: 'underline' }}>Menu button</span> is located on the top left corner of the page. It is the icon displaying two horizontal lines. There, you will be able to check your <span style={{ textDecoration: 'underline' }}>Syllabus</span>, your current <span style={{ textDecoration: 'underline' }}>Homework</span>, or send an <span style={{ textDecoration: 'underline' }}>email to your TA</span>.</li>
                    <li>    The <span style={{ textDecoration: 'underline' }}>Session button</span> is also located on the top left corner of the page, right below the Menu button. Here, you will be able to see your <span style={{ textDecoration: 'underline' }}>previous sessions</span> or open a <span style={{ textDecoration: 'underline' }}>new session</span>, which will allow you to start asking me questions from a blank page and save your previous questions and answers in a session.</li>
                    <li>    I think you already know where the <span style={{ textDecoration: 'underline' }}>Settings button</span> is. You are in it! It's the button with a gear icon on the top right corner of the page. Here you can see your <span style={{ textDecoration: 'underline' }}>Profile</span> which contains your basic information. There is also a button to <span style={{ textDecoration: 'underline' }}>logout</span> to go back to the login page, and, of course, the <span style={{ textDecoration: 'underline' }}>Help button</span> which you are using right now!</li>
                    <li>    Down down we go on the homepage to find the <span style={{ textDecoration: 'underline' }}>Input Bar</span>. You can click on it and start typing any question you have for me. Once you are done typing, you can click on the blue <span style={{ textDecoration: 'underline' }}>Query button</span> to send me your question, and I will try my best to solve it for you. If you have a formula for me, you can click on the blue Switch to <span style={{ textDecoration: 'underline' }}>LaTeX button</span>, and then you can type the formula to me in LaTeX form.</li>
                    <li>    The rectangle that occupies most of the page is used to display all your questions and the answers I have for you.</li>
                <br />
                <h3 style={{ fontWeight: 'bold' }}>How to close a pop-up window?</h3>
                <li>    You can close the pop-up window, also called Modal, if you click on the "x" which appears on the top right corner of the pop-up window.</li>
                <br />
                <h3 style={{ fontWeight: 'bold' }}>How to close the Menu and Settings button?</h3>
                <li>    If you want to close the drop-down menu of the Menu and/or Settings button, you can click anywhere outside of this menu, or click the button again.</li>
                <br />
            </div>
        );
        setIsModalVisible(true);
    };

    // Clear modal content when closing
    const closeModal = () => {
        setIsModalVisible(false);
        setModalContent(null);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsButtonRef.current && settingsButtonRef.current.contains(event.target)) {
                return;
            } else if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
            <button ref={settingsButtonRef} className="settings-button" onClick={toggleSettingsDropdown}>
                <img src={SettingsIcon} alt="Settings Icon" className={`settings-icon ${isSettingsIconRotated ? 'rotate' : ''}`} />
            </button>
            {isSettingsDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-settingsbutton absolute right-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleProfileClick}>Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogoutClick}>Logout</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleHelpClick}>Help</a>
                </div>
            )}
            <Modal 
                isVisible={isModalVisible} 
                onClose={closeModal}
                title={modalTitle}
            >
                {modalContent}
            </Modal>
        </>
    );
}
