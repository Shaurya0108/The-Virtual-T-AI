import React from 'react'
import axios from 'axios'
async function getDataAxios(Text){

  //get response here
  var response = "initialized"

  return "\n the query responce is "+response
}
//   let data = JSON.stringify({
//     "inputs": Text
//   });
  

// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'localhost:443/chatBot/query',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Authorization': 'Bearer tokenToken'
//   },
//   data : data
// };

//   axios.request(config)
//   .then((response) => {
//     return response.data;
//   })
//   .catch((error) => {
//     console.log(error);
//   });

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    //make call to backend here
    var response = await getDataAxios(this.state.value);
    
    alert('A query was submitted: ' + this.state.value +'\n query response is'+ response);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}