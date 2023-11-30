import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from "../icons/MenuIcon.svg";
import Modal from './Modal';

export default function MenuButton() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const [isMenuIconRotated, setIsMenuIconRotated] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    /* For Modal Title */
    const [modalTitle, setModalTitle] = useState("");

    const toggleMenuDropdown = () => {
        setIsMenuDropdownOpen(!isMenuDropdownOpen);
        setIsMenuIconRotated(!isMenuIconRotated);
    };

    const handleSyllabusClick = () => {
        //Edit src
        setModalContent(<iframe src="https://github.com/jesusjimenez32/PDF/blob/c8aeddbcff0dc05596c846d76ea8683c9050ce5a/CS%204485%20-%20FA2023%20-%20Syllabus.pdf" style={{ width: '100%', height: '100%' }} />);
        setModalTitle("Syllabus");
        setIsModalVisible(true);
    };

    const handleHomeworkClick = () => {
        //Edit src
        setModalContent(<iframe src="https://github.com/jesusjimenez32/PDF/blob/c8aeddbcff0dc05596c846d76ea8683c9050ce5a/CS%204485%20-%20FA2023%20-%20Syllabus.pdf" style={{ width: '100%', height: '100%' }} />);
        setModalTitle("Homework");
        setIsModalVisible(true);
    };

    const handleContactTAClick = () => {
        setModalContent(
            <div className="modal-content-container">
                <textarea placeholder="Type your message here" className="modal-textarea"></textarea>
                <button className="modal-send-button">Send</button>
            </div>
        );
        setModalTitle("Contact TA");
        setIsModalVisible(true);
    };

    // Clear modal content when closing
    const closeModal = () => {
        setIsModalVisible(false);
        setModalContent(null);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuDropdownOpen(false);
            }
        }

        if (isMenuDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuDropdownOpen]);

    return (
        <>
            <button className="menu-button" onClick={toggleMenuDropdown}>
                <img src={MenuIcon} alt="Menu Icon" className={`menu-icon ${isMenuIconRotated ? 'rotate' : ''}`} />
            </button>
            {isMenuDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-menubutton absolute left-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleSyllabusClick}>Syllabus</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleHomeworkClick}>Homework</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleContactTAClick}>Contact TA</a>
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