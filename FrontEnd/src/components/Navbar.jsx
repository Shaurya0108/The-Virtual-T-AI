import UTDIcon from "../images/UTD Icon.png";
import profileIcon from "../icons/tabs/Profile Icon.svg";
export default function Navbar() {
    return (
        <nav className="nav">
            <img src={UTDIcon} className="utd-icon" alt=""></img>
            <div className="navbar-caption">
                <h2 className="navbar-cap-1">The Virtual Teacher Assistant </h2>
                <h2 className="navbar-cap-2">CS4349 Advanced Algorithms Design and Analysis</h2>
            </div>
            <img src {...profileIcon} className="utd-con"></img>
        </nav>
    );
}