import React from 'react';
import '../css/Home.css'
export default class Sessions extends React.Component {

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




  constructor(props) {
    super(props);
    this.state = {
      userMessage: '',
      conversation: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    return (

      <div id="session-bar" className="SessionBar">
        <button className="new-session">New Session</button>
      </div>

    );
  }
}