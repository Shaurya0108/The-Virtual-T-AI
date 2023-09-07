import {useState, useRef, useLayoutEffect} from "react";
import './App.css';

const MIN_HEIGHT = 16;

function App() {
  const textareaRef = useRef(null);
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  
  useLayoutEffect(() => {
    // Reset height
    textareaRef.current.style.height = "inherit";
    // Set height
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      MIN_HEIGHT
    )}px`;
  }, [value]);
  
  return (
    <div className="App">
      <header className="App-header">
          Ask the Virtual TA any question about CS4349!
      </header>
      <label htmlFor="review-text">Query:</label>
      <textarea
        className="App-textarea"
        onChange={onChange}
        ref={textareaRef}
        value={value}
      />
    </div>
  );
}

export default App;
