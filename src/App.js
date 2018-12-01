import React, { Component, Fragment } from "react";
import "./App.css";
import CocktailList from "./Cocktail";
import SavedList from "./List";
import cocktail from "./cocktail.png";
import axios from "axios";
import firebase, { auth, provider } from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, // for Google auth
      searchRequest: "",
      cocktails: [],
      savedCocktails: {},
      showSearchCocktails: false
    };
  }

  getCocktail = e => {
    if (e.target.className === "randomCocktail") {
      return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, {
          params: {
            s: null
          }
        })
        .then(res => {
          this.setState({
            cocktails: res.data.drinks || [] // need to set this for edge case
          });
        });
    } else if (this.state.searchRequest === "") {
      return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/search.php`, {
          params: {
            s: null
          }
        })
        .then(res => {
          this.setState({
            cocktails: res.data.drinks || [] // need to set this for edge case
          });
        });
    } else {
      return axios
        .get(`https://www.thecocktaildb.com/api/json/v1/1/search.php`, {
          params: {
            s: this.state.searchRequest
          }
        })
        .then(res => {
          this.setState({
            cocktails: res.data.drinks || [] // need to set this for edge case
          });
        });
    }
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        const userDBRef = firebase.database().ref(`uid/${this.state.user.uid}`);
        userDBRef.on("value", snapshot => {
          this.setState({
            savedCocktails: snapshot.val()
          });
        });
      }
    });
  }

  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };

  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  };

  handleRequest = e => {
    e.preventDefault();
    // invoke axios request
    this.getCocktail(e);
    // clear input
    this.setState({
      searchRequest: "",
      showSearchCocktails: true
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  saveCocktail = (cocktail, cocktailIngredients) => {
    const cocktailItem = {
      id: cocktail.idDrink,
      user: this.state.user.email,
      name: cocktail.strDrink,
      thumbnail: cocktail.strDrinkThumb,
      ingredients: cocktailIngredients
    };
    const userDBRef = firebase.database().ref(`uid/${this.state.user.uid}`);
    userDBRef.push(cocktailItem);
    alert("Cocktail added to Saved List!");
  };

  removeCocktail = e => {
    const firebaseKey = e.target.id;
    const cocktailDBRef = firebase
      .database()
      .ref(`uid/${this.state.user.uid}/${firebaseKey}`);
    cocktailDBRef.remove();
    alert("Cocktail removed!");
  };

  render() {
    return (
      <Fragment>
        <div className="App">
          <header />
          <h1>Cocktail Lookup</h1>
          <img src={cocktail} alt="Cocktail glass" />
          <form onSubmit={this.handleRequest} action="">
            <label htmlFor="searchRequest">Type in a cocktail drink</label>
            <input
              onChange={this.handleChange}
              value={this.state.searchRequest}
              type="text"
              id="searchRequest"
            />
            <input type="submit" value="Search" />
            <button
              className="randomCocktail"
              type="button"
              onClick={this.handleRequest}
            >
              Give me a random drink!
            </button>
          </form>
          {this.state.showSearchCocktails ? (
            <CocktailList
              saveCocktail={this.saveCocktail}
              cocktails={this.state.cocktails}
              userState={this.state.user}
            />
          ) : null}
        </div>

        <div className="SavedDrinks">
          {this.state.user ? (
            <button onClick={this.logout}>Log Out</button>
          ) : (
            <button onClick={this.login}>Log In</button>
          )}
          {this.state.user ? (
            <div>
              <div className="user-profile">
                <img src={this.state.user.photoURL} />
              </div>
              <SavedList removeCocktail={this.removeCocktail} savedCocktails={this.state.savedCocktails || {}} />
            </div>
          ) : (
            <div className="wrapper">
              <p>You must be logged in to see saved cocktail drinks.</p>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default App;
