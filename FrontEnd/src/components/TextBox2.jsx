import React from 'react';
import '../css/Home.css'



export default class ChatBox extends React.Component {

    async query(Text) {
        
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "body": Text
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
                credentials: 'include' //Make sure to have this line for every Request. Or else the cookie won't be included in the requests
            };
            const response = await fetch("http://18.189.195.246:443/chatBot/query", requestOptions)
            .then(response => response.json())

            const result = response.res.generated_text

            return result;
        } catch (err) {
            alert(err.message)
        }
        
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
