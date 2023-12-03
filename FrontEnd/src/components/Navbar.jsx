import UTDIcon from "../images/UTD Icon.png";
import MenuButton from './MenuButton'
import SettingsButton from './SettingsButton'

export default function Navbar() {

    return (
        <nav className="nav flex items-center justify-between relative">
            
            <MenuButton />

            <div className="center-container">
                <img src={UTDIcon} className="utd-icon" alt="UTD Icon"></img>
                <div className="navbar-caption text-center mx-auto">
                    <h1 className="navbar-cap-1 text-4xl font-bold">The Virtual Teacher Assistant</h1>
                    <h3 className="navbar-cap-2 text-xl">Advanced Algorithms Design and Analysis</h3>
                </div>
            </div>

            <SettingsButton />
            
        </nav>
    );
}
