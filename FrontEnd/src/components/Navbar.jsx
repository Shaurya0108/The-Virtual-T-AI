import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UTDIcon from "../images/UTD Icon.png";
import MenuIcon from "../icons/MenuIcon.svg";
import SettingsIcon from "../icons/SettingsIcon.svg";

export default function Navbar() {
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const [isSettingsIconRotated, setIsSettingsIconRotated] = useState(false);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const [isMenuIconRotated, setIsMenuIconRotated] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenuDropdown = () => {
        setIsMenuDropdownOpen(!isMenuDropdownOpen);
        setIsMenuIconRotated(!isMenuIconRotated);
    }
    const toggleSettingsDropdown = () => {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsSettingsIconRotated(!isSettingsIconRotated);
    }

    const handleSyllabusClick = () => {
        navigate('/syllabus');
    };

    const handleHomeworkClick = () => {
        navigate('/homework');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleDarkModeClick = () => {
        navigate('/darkmode');
    };

    const handleClearHistoryClick = () => {
        navigate('/clearhistory');
    };

    const handleLogoutClick = () => {
        navigate('/logout');
    };

    const handleHelpClick = () => {
        navigate('/help');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuDropdownOpen(false);
                setIsSettingsDropdownOpen(false);
            }
        }

        if (isSettingsDropdownOpen || isMenuDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsDropdownOpen, isMenuDropdownOpen]);

    return (
        <nav className="nav flex items-center justify-between relative">
            <button className="menu-button" onClick={toggleMenuDropdown}>
                <img src={MenuIcon} alt="Menu Icon" className={`menu-icon ${isMenuIconRotated ? 'rotate' : ''}`} />
            </button>
            {isMenuDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-menu absolute left-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleSyllabusClick}>Syllabus</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleHomeworkClick}>Homework</a>
                </div>
            )}

            <div className="center-container">
                <img src={UTDIcon} className="utd-icon" alt="UTD Icon"></img>
                <div className="navbar-caption text-center mx-auto">
                    <h1 className="navbar-cap-1 text-4xl font-bold">The Virtual Teacher Assistant</h1>
                    <h3 className="navbar-cap-2 text-xl">Advanced Algorithms Design and Analysis</h3>
                </div>
            </div>

            <button className="settings-button" onClick={toggleSettingsDropdown}>
                <img src={SettingsIcon} alt="Settings Icon" className={`settings-icon ${isSettingsIconRotated ? 'rotate' : ''}`} />
            </button>
            {isSettingsDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-menu absolute right-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleProfileClick}>Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleDarkModeClick}>DarkMode</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleClearHistoryClick}>ClearHistory</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogoutClick}>Logout</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleHelpClick}>Help</a>
                </div>
            )}
            
        </nav>
    );
}
