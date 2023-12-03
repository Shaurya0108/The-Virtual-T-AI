import React, { useState, useRef, useEffect } from 'react';
import MenuIcon from "../icons/MenuIcon.svg";
import Modal from './Modal';
import emailjs from 'emailjs-com';

const userID = import.meta.env.VITE_EMAILJS;
emailjs.init(userID);

// Component for TA form
const ContactTAContent = ({ emailMessage, setEmailMessage, sendEmail }) => (
    <div className="modal-content-container">
        <textarea 
            placeholder="Type your message here, the message will be sent to your TA via outlook" 
            className="modal-textarea" 
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
        ></textarea>
        <button className="modal-send-button" onClick={sendEmail}>Send</button>
    </div>
);

export default function MenuButton() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const [isMenuIconRotated, setIsMenuIconRotated] = useState(false);
    const dropdownRef = useRef(null);
    const [modalTitle, setModalTitle] = useState("");

    const [emailMessage, setEmailMessage] = useState('');

    const toggleMenuDropdown = () => {
        setIsMenuDropdownOpen(!isMenuDropdownOpen);
        setIsMenuIconRotated(!isMenuIconRotated);
    };

    const handleSyllabusClick = () => {
        setModalContent(<iframe src="https://github.com/jesusjimenez32/PDF/blob/c8aeddbcff0dc05596c846d76ea8683c9050ce5a/CS%204485%20-%20FA2023%20-%20Syllabus.pdf" style={{ width: '100%', height: '100%' }} />);
        setModalTitle("Syllabus");
        setIsModalVisible(true);
    };

    const handleHomeworkClick = () => {
        setModalContent(<iframe src="https://github.com/jesusjimenez32/PDF/blob/c8aeddbcff0dc05596c846d76ea8683c9050ce5a/CS%204485%20-%20FA2023%20-%20Syllabus.pdf" style={{ width: '100%', height: '100%' }} />);
        setModalTitle("Homework");
        setIsModalVisible(true);
    };

    // Stuff for sending an email to TA
    // Uses handling and can take in props from the component above menuButton
    const handleContactTAClick = () => {
        setModalTitle("Contact TA");
        setIsModalVisible(true);
    };
    
    const sendEmail = () => {
        const templateParams = {
            to_email: 'sxd200087@utdallas.edu',
            message: emailMessage,
        };
    
        emailjs.send('service_ee7lqht', 'template_w7d6mgh', templateParams)
            .then(response => {
                console.log('SUCCESS!', response.status, response.text);
                closeModal();
                setEmailMessage('');
            }, error => {
                console.log('FAILED...', error);
            });
    };


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
                {modalTitle === "Contact TA" && 
                    <ContactTAContent 
                        emailMessage={emailMessage} 
                        setEmailMessage={setEmailMessage} 
                        sendEmail={sendEmail}
                    />
                }
                {modalContent}
            </Modal>
        </>
    );
}