import { useState, useEffect, useRef } from 'react';
import UTDIcon from "../images/UTD Icon.png";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="nav flex items-center justify-between relative">
            <img src={UTDIcon} className="utd-icon" alt="UTD Icon"></img>
            <div className="navbar-caption text-center mx-auto">
                <h1 className="navbar-cap-1 text-4xl font-bold">The Virtual Teacher Assistant</h1>
                <h3 className="navbar-cap-2 text-xl">Advanced Algorithms Design and Analysis</h3>
            </div>
            <button className="settings-button" onClick={toggleDropdown}></button>
            {isDropdownOpen && (
                <div ref={dropdownRef} className="dropdown-menu absolute right-0 top-20 mt-5 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                </div>
            )}
        </nav>
    );
}
