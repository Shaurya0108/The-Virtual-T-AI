import {useState, useRef, useLayoutEffect} from "react";
import './App.css';

function App() {
  const textareaRef = useRef(null);
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  
  useLayoutEffect(() => {
    // Reset height
    textareaRef.current.style.height = 'auto';
    // Set height
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [value]);
  
  return (
    <div className="App">
      <header className="App-header">
          Ask the Virtual TA any question about CS4349!
      </header>
      <label className = "App-label" 
        htmlFor="textBox">
          Query: 
      </label>
      <textarea
        id="textBox"
        className="App-textarea"
        onChange={onChange}
        ref={textareaRef}
        value={value}
      />
    </div>
  );
}

export default App;
