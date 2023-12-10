import React from 'react';
import '../css/Home.css';
import SessionCard from './SessionCard';
export default class Sessions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentSessionId: null,
      previousSessions: props.sessionIds || []
    };
  }



  getBySessionId = async () => {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          TableName: "table-dev",
          IndexName: "sessionId-index",
          KeyConditionExpression: "#sessionId = :sessionIdVal",
          ExpressionAttributeNames: {
              "#sessionId": "sessionId"
          },
          ExpressionAttributeValues: {
              ":sessionIdVal": { "N": window.sessionStorage.getItem("currentSessionId") }
          }
        }),
        redirect: 'follow',
        credentials: 'include'
      };
      const response = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/chatBot/getBySessionId", requestOptions);
      const data = await response.json();
      return data;
    } catch (error) {
        return "Sorry, there was an issue getting the response.";
    }
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
    const queries = await this.getBySessionId();
    if (queries.length > 0){
      const newSessionId = await this.generateSessionId(); // Generates a unique session ID

      window.sessionStorage.setItem("currentSessionId", newSessionId);

      this.setState(prevState => ({
        currentSessionId: newSessionId,
        previousSessions: [newSessionId, ...prevState.previousSessions],
      }));
      this.props.onSessionChange(newSessionId, true);
    }
  };




  // A function that allows the user to select and load a previous session
  // This would involve retrieving the previous session data from the backend
  selectPreviousSession = async (sessionId) => {
    // Set the current session to the selected one
    window.sessionStorage.setItem("currentSessionId", sessionId);
    this.setState({ currentSessionId: sessionId });
    const queries = await this.getBySessionId();
    this.props.onSessionChange(sessionId, false, queries);
  };



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
              <SessionCard Id={this.state.sessionId}/>
            </button>
          ))}
        </div>
      </div>
    );
  }
}