import UTDIcon from "../images/UTD Icon.png";
export default function Navbar() {
    return (
        <nav className="nav">
            <img src={UTDIcon} className="utd-icon" alt=""></img>
            <div className="navbar-caption">
                <h2 className="navbar-cap-1">Virtual TA</h2>
                <h2 className="navbar-cap-2">CS4349 Advanced Algorithms Design and Analysis</h2>
            </div>
            
        </nav>
    );
}