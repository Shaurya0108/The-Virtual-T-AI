import React from 'react';
import '../css/Home.css'



export default class ChatBox extends React.Component {

    async query(Text) {
        
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAyIiwiaWF0IjoxNjk3OTQ3NjQ2LCJleHAiOjE2OTc5NDk0NDZ9.3IKjpaImfWCN_wc66Nnc8f_UN6k7HBv2GSPsoje1xUw");
        alert("sending the floowing to backed: "+Text)
        var raw = JSON.stringify({
            "body": Text
        });

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("localhost:443/chatBot/query", requestOptions).then(alert(response))
        .then(response => response.text())
        .then( result => result)
        .catch(error => console.log('error', error))
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
        const chatbotResponse = await this.query(this.state.userMessage);
        alert(chatbotResponse)
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
            <div> {/* chatContainerStyles applied here */}
                <div className="chat-converstaion">
                    {/* Render the conversation */}
                    {this.state.conversation.map((message, index) => (
                        <div key={index} style={{ textAlign: message.sender === 'chatbot' ? 'left' : 'right' }}>
                            <p>{message.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={this.handleSubmit} className="chat-input">
                    <input
                        type="text"
                        value={this.state.userMessage}
                        onChange={this.handleChange}
                        placeholder="Ask me anything"
                        className="chat-inputField" 
                    />
                    <input
                        type="submit"
                        value="🔍" // Search icon
                        className="chat-submit"
                    />
                </form>
            </div>
        );
    }
}