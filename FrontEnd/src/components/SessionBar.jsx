import { useState } from "react";


export default function SessionBar() {
  //const [expanded, setExpanded] = useState(false);

  const expand = () => {
    document.getElementById("session-bar").style.width = "100%";
  };

  const compress = () => {
    document.getElementById("session-bar").style.width = "0%";
  }

    return (
      <div className="session-container">
        <button className="openbtn" onClick={expand}></button>
          <div id="session-bar" className="SessionBar">
            <a href="javascript:void(0)" className="closebtn" onClick={compress}></a>
            {/* <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Clients</a>
            <a href="#">Contact</a> */}
            <button className="new-session">New Session</button>
          </div>

      </div>
      
    );
  }