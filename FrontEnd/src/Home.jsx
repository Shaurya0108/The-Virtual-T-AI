import './css/Home.css';
import { useState } from 'react'
import TextBox2 from './components/TextBox2';
import Sessions from './components/SessionBar';
import Navbar  from './components/Navbar';
export default function Home({ sessionIds }) {

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [conversation, setConversation] = useState([]);

  const addConversation = (userMessage, chatbotMessage) => {
    setConversation(prevConversation => [...prevConversation, userMessage, chatbotMessage]);
  };

  const handleSessionChange = async (sessionId, isNewSession, queries) => {
    setCurrentSessionId(sessionId);
    
    if (isNewSession) {
      // Clear the conversation for a new session
      setConversation([]);
    } else {
      // Load the conversation for the selected session
      const loadedConversation = await loadConversationForSession(sessionId, queries);
      console.log(loadedConversation);
      setConversation(loadedConversation);
    }
  };

  // Function to load conversation based on session ID
  // Implement the logic to fetch conversation data from your backend or storage
  const loadConversationForSession = async (sessionId, queries) => {
    let conversation = [];
    for(const obj of queries){
      const userMessage = { sender: 'user', text: obj.Query.question };
      const chatbotMessage = { sender: 'chatbot', text: obj.Query.answer };
      conversation.push(userMessage);
      conversation.push(chatbotMessage);
    }
    return conversation;
  };
  
  function toggleSessions(){
    var sessionContainer = document.querySelector('.session-container');
    var chatContainer = document.querySelector('.chat-container');
    var bar = document.getElementById('session-bar');
    //open the container
    if (sessionContainer.style.flexGrow === '1' || sessionContainer.style.flexGrow === '') {
        sessionContainer.style.flexGrow = '9';
        chatContainer.style.flexGrow = '31';
    } else {
        sessionContainer.style.flexGrow = '1';
        chatContainer.style.flexGrow = '40';
    }

    //open the component
    if (bar.style.width === '0px' || bar.style.width === '') {
      bar.style.width = '250px';
    } else {
      bar.style.width = '0';
    }
  }

  return (
    <>
      <Navbar/>
      <home link rel="stylesheet" type="text/css" href="./css/Home.css" >
        <div className="session-container">
          <button type="button" className="openbtn" onClick={toggleSessions}></button>
          <Sessions sessionIds={sessionIds} 
            onSessionChange={handleSessionChange} />
        </div>
        <div className="chat-container">
          <TextBox2 currentSessionId={currentSessionId}
            conversation={conversation}
            addConversation={addConversation}/>
        </div>
      </home>
  </>
  )
}