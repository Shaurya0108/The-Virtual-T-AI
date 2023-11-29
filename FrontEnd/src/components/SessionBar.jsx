import React from 'react';
import '../css/Home.css';

export default class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSessionId: null,
      previousSessions: [],
      userMessage: '',
      conversation: [],
    };
  }

  generateSessionId = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
          credentials: 'include'
      };
      const response = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/chatBot/newSessionId", requestOptions)
      const data = await response.json();
      return data.res;
  } catch (error) {
      return "Sorry, there was an issue getting the response.";
  }
  }

  // Generates a new session ID and updates the state
  createNewSession = async () => {
    if (!this.state.conversation.length === 0){
      const newSessionId = await this.generateSessionId(); // Generates a unique session ID

      window.sessionStorage.setItem("currentSessionId", newSessionId);

      this.setState(prevState => ({
        currentSessionId: newSessionId,
        previousSessions: [...prevState.previousSessions, newSessionId],
        conversation: [], // Reset the conversation or handle as necessary
      }));
    }

  };

  // A function that allows the user to select and load a previous session
  // This would involve retrieving the previous session data from the backend
  selectPreviousSession = (sessionId) => {
    // Set the current session to the selected one
    this.setState({ currentSessionId: sessionId });
    // Here you would also retrieve the conversation for the selected session from the backend
  };

  handleChange(event) {
    this.setState({ userMessage: event.target.value });
  }

  render() {
    const { previousSessions, currentSessionId } = this.state;

    return (
      <div id="session-bar" className="SessionBar">
        <button onClick={this.createNewSession} className="new-session">
          New Session
        </button>
        <div className="previous-sessions">
          {previousSessions.map(sessionId => (
            <button
              key={sessionId}
              onClick={() => this.selectPreviousSession(sessionId)}
              className={`session ${sessionId === currentSessionId ? 'current-session' : ''}`}
            >
              {`Session ${sessionId}`}
            </button>
          ))}
        </div>
      </div>
    );
  }
}