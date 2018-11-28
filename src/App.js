import React, { Component, Fragment } from "react";
// import logo from "./logo.svg";
import "./App.css";
import cocktail from "./cocktail.png";
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchRequest: "",
      cocktails: []
    };
  }

  getCocktail = () => {
    axios
      .get("https://www.thecocktaildb.com/api/json/v1/1/search.php", {
        params: {
          s: this.state.searchRequest
        }
      })
      .then(res => {
        this.setState({ 
          cocktails: res.data.drinks
        });
      });
  };

  handleRequest = (e) => {
    e.preventDefault();
    // invoke axios request
    this.getCocktail();
    // clear input
    this.setState({
      searchRequest: ""
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  render() {
    return (
      <Fragment>
        <div className="App">
          <header></header>
          <h1>Cocktail Lookup</h1>
          <img src={cocktail} alt="Cocktail glass" />
          <form onSubmit={this.handleRequest} action="">
            <label htmlFor="searchRequest">Type in a cocktail drink</label>
            <input onChange={this.handleChange} value={this.state.searchRequest} type="text" id="searchRequest" />
          </form>
        </div>
      </Fragment>
    );
  }
}

export default App;
