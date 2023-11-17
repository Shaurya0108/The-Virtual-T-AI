import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuIcon from "../icons/MenuIcon.svg";

export default function MenuButton() {
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const [isMenuIconRotated, setIsMenuIconRotated] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenuDropdown = () => {
        setIsMenuDropdownOpen(!isMenuDropdownOpen);
        setIsMenuIconRotated(!isMenuIconRotated);
    };

    const handleSyllabusClick = () => {
        navigate('/syllabus');
    };

    const handleHomeworkClick = () => {
        navigate('/homework');
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
                </div>
            )}
        </>
    );
}