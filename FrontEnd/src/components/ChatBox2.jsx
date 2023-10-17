import React from 'react';

export default class ChatBox extends React.Component {
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
    // Make call to backend here
    //alert('An input message was submitted: ' + this.state.value);
    event.preventDefault();
    
    // Send the message to the conversation state
    this.setState(state => {
      const conversation = [...state.conversation, { text: state.userMessage, sender: 'user' }];
      return {
        conversation,
        userMessage: '', // Clear the input box
      };
    });

    // Make a call to backend and get the response message.
    const chatbotResponse = "Chat Response";

    // Add the chatbot's response to the conversation
    this.setState(state => {
      const conversation = [...state.conversation, { text: chatbotResponse, sender: 'chatbot' }];
      return {
        conversation
      };
    });
  }

  render() {
    // Styles
    const chatContainerStyles = {
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    };

    const conversationStyles = {
      overflowY: 'scroll',
      flexGrow: 1,
    };

    const chatInputStyles = {
      display: 'flex',
      marginTop: '10px',
      flexDirection: 'row-reverse',
      alignItems: 'center',
    };

    const inputFieldStyles = {
      flexGrow: 1,
      marginRight: '1%',
    };

    return (
      <div style={chatContainerStyles}> {/* chatContainerStyles applied here */}
        <div style={conversationStyles}>
          {/* Render the conversation */}
          {this.state.conversation.map((message, index) => (
            <div key={index} style={{ textAlign: message.sender === 'chatbot' ? 'left' : 'right' }}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <form onSubmit={this.handleSubmit} style={chatInputStyles}>
        <input 
            type="text"
            value={this.state.userMessage}
            onChange={this.handleChange}
            placeholder="Ask me anything"
            style={inputFieldStyles} // inline styles for the input
          />
          <input 
            type="submit"
            value="🔍" // Search icon
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              fontSize: '1.5em',
            }}
          />
        </form>
      </div>
    );
  }
}