import React from 'react';
import '../css/Home.css';
import { v4 as uuidv4 } from 'uuid'; // You need to install 'uuid' module if not already

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

  createSessionId = async () => {
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
    const newSessionId = await this.createSessionId(); // Generates a unique session ID

    this.setState(prevState => ({
      currentSessionId: newSessionId,
      previousSessions: [...prevState.previousSessions, newSessionId],
      conversation: [], // Reset the conversation or handle as necessary
    }));

    // Here you would also post the new session ID to your backend
    // and initialize anything else required for a new session.
  };

  // A function that allows the user to select and load a previous session
  // This would involve retrieving the previous session data from the backend
  selectPreviousSession = (sessionId) => {
    // Set the current session to the selected one
    this.setState({ currentSessionId: sessionId });
    // Here you would also retrieve the conversation for the selected session from the backend
  };

  async query(Text) {
    var response;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "body": Text
    });

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      credentials: 'include'
    };

    fetch("localhost:443/chatBot/query", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    return response;
  }

  handleChange(event) {
    this.setState({ userMessage: event.target.value });
  }

  async handleSubmit(event) {


    // Send the message to the conversation state
    this.setState(state => {
      const conversation = [...state.conversation, { text: state.userMessage, sender: 'user' }];
      return {
        conversation,
        userMessage: '', // Clear the input box
      };
    });

    // Make call to backend here
    const response = "loading the users sessions"
    event.preventDefault();
    // Add the chatbot's response to the conversation
    this.setState(state => {
      const conversation = [...state.conversation, { text: chatbotResponse, sender: 'chatbot' }];
      return {
        conversation
      };
    });
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