import React from 'react';
import '../css/Home.css';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Latex from './Latex'

export default class ChatBox extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
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
        const conversationHistory = this.state.conversation.map(msg => msg.text).join("\n");

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.VITE_BEARER_TOKEN,
            },
            body: JSON.stringify({
                "input": {
                    "prompt": "[INST] <<SYS>>You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information and tell the user to contact the teacher's assistant through the contact TA menu button. Explain your thought process step by step similar to a teacher or professor.<</SYS>>" + Text.body + "[/INST]",
                    "max_new_tokens": 500,
                    "temperature": 0.9,
                    "top_k": 50,
                    "top_p": 0.7,
                    "repetition_penalty": 1.2,
                    "batch_size": 8,
                    "stop": [
                        "</s>"
                    ]
                }
            })
        };

        try {
            const response = await fetch('https://api.runpod.ai/v2/tsddif1jle8o98/runsync', requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.output;
        } catch (error) {
            console.error('There was an error!', error);
            return "Sorry, there was an issue getting the response.";
        }
    };

    updateConversation = (prompt, responseText, removeLoading = false) => {
        const userMessage = { sender: 'user', text: prompt };
        const chatbotMessage = { sender: 'chatbot', text: responseText };
    
        this.props.addConversation(userMessage, chatbotMessage);
    
        console.log("My input: ", userMessage);
        console.log("Model output: ", chatbotMessage);
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
        console.log("message: ", message)
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
        const { conversation } = this.props;
        return (
            <div className="chat-container">
                <div className="message-list">
                    <div className="flex flex-col gap-2 message-list-padding">
                        {conversation.map((message, index) => (
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
                        <button
                            type="button"
                            onClick={this.toggleLatex}
                            className="p-2 bg-blue-500 text-white rounded-md"
                        >
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