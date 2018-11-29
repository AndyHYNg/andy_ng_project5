import React, { Component, Fragment } from "react";
import "./App.css";
import CocktailList from "./Cocktail";
import cocktail from "./cocktail.png";
import axios from 'axios';
import firebase from './firebase';

const dbRef = firebase.database().ref();

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchRequest: "",
      cocktails: [],
      showSavedCocktails: false,
      showSearchCocktails: false
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
    else if (this.state.searchRequest === "") {
      return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/search.php`, {
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
    else {
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
      }
  };

  handleRequest = (e) => {
    e.preventDefault();
    // invoke axios request
    this.getCocktail(e);
    // clear input
    this.setState({
      searchRequest: "",
      showSearchCocktails: true
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  saveCocktail = (cocktail, cocktailIngredients) => {
    console.log('REEEEEEEEEEEE', cocktail.strDrink);
    const cocktailItem = {
      name: cocktail.strDrink,
      thumbnail: cocktail.strDrinkThumb,
      ingredients: cocktailIngredients
    }
    dbRef.push(cocktailItem);
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
          {this.state.showSearchCocktails 
            ? <CocktailList saveCocktail={this.saveCocktail} cocktails={this.state.cocktails} /> 
            : null}
        </div>

        <div className="SavedDrinks">
            <h2>Saved Drinks</h2>
        </div>
      </Fragment>
    );
  }
}

export default App;
