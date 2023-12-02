import React from 'react';
import '../css/Home.css';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Latex from './Latex'

export default class ChatBox extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            conversation: [],
            userMessage: '',
            latexEnabled: false,
            isLoading: false,
        };
    }

    handleChange = (event) => {
        this.setState({ userMessage: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const prompt = this.state.userMessage.trim();
        if (!prompt) {
            return;
        }
        this.updateInputBox(prompt);
        this.addLoadingMessage();
        const response = await this.postChatMessage(prompt);
        this.updateConversation(prompt, response, true);
    };

    addLoadingMessage = () => {
        const loadingMessage = { sender: 'chatbot', text: "..." };
        this.setState(prevState => ({
            conversation: [...prevState.conversation, loadingMessage],
            isLoading: true
        }));
    }

    postChatMessage = async (prompt) => {

        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            console.log("prompt: ", prompt)

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    body: prompt,
                    sessionId: window.sessionStorage.getItem("currentSessionId")
                }),
                redirect: 'follow',
                credentials: 'include'
            };
            const response = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/chatBot/query", requestOptions)
            const data = await response.json();
            if(data.res == undefined){
                return "error occured"
            }
            else{
                return data.res;
            }
            
        } catch (error) {
            console.error('There was an error!', error);
            return "Sorry, there was an issue getting the response.";
        }
    };

    updateConversation = (prompt, responseText, removeLoading = false) => {
        const userMessage = { sender: 'user', text: prompt };
        const chatbotMessage = { sender: 'chatbot', text: responseText };
    
        this.setState(prevState => {
            let updatedConversation = [...prevState.conversation, userMessage];
            if (removeLoading) {
                updatedConversation = updatedConversation.filter(message => message.text !== "...");
            }
            return {
                conversation: [...updatedConversation, chatbotMessage],
                userMessage: '',
                isLoading: false
            };
        });
    };
    
    

    updateInputBox = (prompt) => {
        const userMessage = { sender: 'user', text: prompt };
    
        this.setState(prevState => ({
            userMessage: ''
        }));
    
        console.log("My input: ", userMessage);
    };

    isLatex = (text) => {
        const latexDelimiters = ['$$', '\\[', '\\(', '\\begin'];
        return latexDelimiters.some(delimiter => text.includes(delimiter));
    };


    // renders the message according to the LaTeX or code response
    renderMessage = (message) => {
        const codeBlockRegex = /```([\s\S]*?)```/g;
        let resultElements = [];
        let lastIndex = 0;
        let match;
        while ((match = codeBlockRegex.exec(message.text)) !== null) {
            if (match.index > lastIndex) {
                resultElements.push(<span key={lastIndex}>{message.text.substring(lastIndex, match.index)}</span>);
            }
            resultElements.push(
                <pre key={match.index}>
                    <code>{match[1]}</code>
                </pre>
            );
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < message.text.length) {
            resultElements.push(<span key={lastIndex}>{message.text.substring(lastIndex)}</span>);
        }
        return <div>{resultElements}</div>;
    };
    
    

    toggleLatex = () => {
        this.setState(prevState => ({
            latexEnabled: !prevState.latexEnabled
        }));
    };
    
    renderInputField = () => {
        if (this.state.latexEnabled) {
            return <Latex value={this.state.userMessage} onChange={this.handleChange} />;
        } else {
            return (
                <input
                    type="text"
                    value={this.state.userMessage}
                    onChange={this.handleChange}
                    placeholder="Hi! I am your Virtual TA, please feel free to ask me anything you would ask a normal TA..."
                    className="flex-grow p-2 border rounded-md"
                />
            );
        }
    };

    render() {
        return (
            <div className="chat-container">
                <div className="message-list">
                    <div className="flex flex-col gap-2 message-list-padding">
                        {this.state.conversation.map((message, index) => (
                            <div key={index} className={`max-w-3/4 ${
                                message.sender === 'chatbot' ? 'self-start bg-blue-100 rounded-l-none' : 'self-end bg-gray-300 rounded-r-none'
                            } rounded-md p-2`}>
                                {this.renderMessage(message)}
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="chat-form-container p-4">
                    <div className="flex gap-2">
                        {this.renderInputField()}
                        <button onClick={this.toggleLatex} className="p-2 bg-blue-500 text-white rounded-md ">
                            {this.state.latexEnabled ? "Switch to Text" : "Switch to LaTeX"}
                        </button>
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 text-white rounded-md"
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading ? "Loading..." : "Query"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}