import React from 'react';
import axios from 'axios';


async function getDataAxios(text) {
  const data = JSON.stringify({ inputs: text });

  const config = {
    method: 'get',
    url: 'http://localhost:443/chatBot/query',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tokenToken',
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error!', error);
    return "Error occurred";
  }
}

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    console.log("User input:", event.target.value);
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log('A query was submitted: ' + this.state.value);
    const response = await getDataAxios(this.state.value);
    alert('A query was submitted: ' + this.state.value + '\n query response is ' + response);
  }

  render() {
    const styles = {
      form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '22px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      label: {
        marginBottom: '10px',
        fontWeight: 'bold',
      },
      input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        marginBottom: '20px',
        fontSize: '30px',
      },
      submitButton: {
        padding: '7px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#f22222',
        color: 'white',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }
    };

    return (
      <form onSubmit={this.handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input 
            type="text" 
            value={this.state.value} 
            onChange={this.handleChange} 
            style={styles.input} 
          />
        </label>
        <input 
          type="submit" 
          value="Submit" 
          style={styles.submitButton} 
        />
      </form>
    );
  }
}
