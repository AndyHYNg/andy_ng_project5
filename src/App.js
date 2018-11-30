import React, { Component, Fragment } from "react";
import "./App.css";
import CocktailList from "./Cocktail";
import cocktail from "./cocktail.png";
import axios from "axios";
import firebase, { auth, provider } from "./firebase";

// const dbRef = firebase.database().ref(`users`);

class App extends Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      user: null, // for Google auth
      searchRequest: "",
      cocktails: [],
      savedCocktails: {},
      showSavedCocktails: false,
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
        console.log(this.state.user.uid);
        const userDBRef = firebase
          .database()
          .ref(`uid/${this.state.user.uid}`);
          userDBRef.on('value', (snapshot) => {
            this.setState({
              // Firebase does all the heavylifting and clones the updated objects in it in realtime, no need to use Array.from() / Object cloning to do the cloning procedure
              // if there is no value in the database...we need to check if the database is empty/null (check below on handling this error)
              savedCocktails: snapshot.val()
            });
            console.log(this.state.savedCocktails);
        });
      }
    });
  }

  logout() {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  }

  login() {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  }

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
    console.log(this.state.user);
    const cocktailItem = {
      user: this.state.user.email,
      name: cocktail.strDrink,
      thumbnail: cocktail.strDrinkThumb,
      ingredients: cocktailIngredients
    };
    const userDBRef = firebase.database().ref(`uid/${this.state.user.uid}`);
    userDBRef.push(cocktailItem);
    // return notice to say it has been updated to db HERE
  };

  // listCocktails = () => {
  //   console.log(this.state.user);
  //   const userDBRef = firebase.database().ref(`uid/${this.state.user.uid}`);

  // }

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
            />
          ) : null}
        </div>

        <div className="SavedDrinks">
          {this.state.user ? (
            <button onClick={this.logout}>Log Out</button>
          ) : (
            <button onClick={this.login}>Log In</button>
          )}
          <h2>Saved Drinks</h2>
          {this.state.user ? (
            <div>
              <div className="user-profile">
                <img src={this.state.user.photoURL} />
              </div>
              {/* <SavedList userDB={this. /> */}
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
