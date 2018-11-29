import React, { Component, Fragment } from "react";
import "./App.css";
import CocktailList from "./Cocktail";
import cocktail from "./cocktail.png";
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchRequest: "",
      cocktails: [],
      randomCocktail: false,
      showSavedCocktails: false,
      showSearchCocktails: true
    };
  }

  getCocktail = (e) => {
    if (e.target.className === "randomCocktail") {
      return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, {
          params: {
            s: null
          }
        })
        .then(res => {
          this.setState({
            cocktails: res.data.drinks || []  // need to set this for edge case 
          });
        });
    }
    return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/search.php`, {
          params: {
            s: this.state.searchRequest
          }
        })
        .then(res => {
          this.setState({ 
            cocktails: res.data.drinks || []  // need to set this for edge case 
          });
        });
  };

  handleRequest = (e) => {
    e.preventDefault();
    // invoke axios request
    this.getCocktail(e);
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
            <input type="submit" value="Search"></input>
            <button className="randomCocktail" type="button" onClick={this.handleRequest}>Give me a random drink!</button>
          </form>
          <CocktailList cocktails={this.state.cocktails} />
        </div>
      </Fragment>
    );
  }
}

export default App;
