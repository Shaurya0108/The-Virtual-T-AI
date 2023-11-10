import UTDIcon from "../images/UTD Icon.png";

export default function Navbar() {
    return (
        <nav className="nav flex items-center justify-between">
            <img src={UTDIcon} className="utd-icon" alt="UTD Icon"></img>
            <div className="navbar-caption text-center mx-auto">
                <h1 className="navbar-cap-1 text-4xl font-bold">The Virtual Teacher Assistant</h1>
                <h3 className="navbar-cap-2 text-xl">Advanced Algorithms Design and Analysis</h3>
            </div>
            <button className="settings-button"></button>
        </nav>
    );
}
