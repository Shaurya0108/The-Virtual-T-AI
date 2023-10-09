import UTDIcon from "./Images/UTD Icon.png";
export default function Navbar() {
    return (
        <nav className="nav">
            <img src={UTDIcon} className="utd-icon" alt=""></img>
            <div className="navbar-caption">
                <h1 className="navbar-cap-1">Virtual TA</h1>
                <h1 className="navbar-cap-2">CS4349 Advanced Algorithms Design and Analysis</h1>
            </div>
            
        </nav>
    );
     
}