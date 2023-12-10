import React from 'react';

class ModelSelect extends React.Component {
  handleClick = (value) => {
    // Set the variable in sessionStorage
    sessionStorage.setItem('modelSelect', value);

  };

  render() {
    return (
      <div>
        <button onClick={() => this.handleClick(1)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Ruben V4</button>
        <button onClick={() => this.handleClick(2)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Shuarya V3</button>
        <button onClick={() => this.handleClick(3)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to TextBook Model</button>
      </div>
    );
  }
}

export default ModelSelect;