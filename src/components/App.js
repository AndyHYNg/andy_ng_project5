/* COMPONENTS */
import React, { Component, Fragment } from "react";
import CocktailList from "./Cocktail";
import Favourites from "./Favourites";
import Navbar from "./Navbar";
import Emoji from "./Emoji";

/* METHODS */
import axios from "axios";
import firebase, { auth, provider } from "../firebase";
import swal from "sweetalert";

/* CSS STYLES */
import "../App.scss";

// main app component

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null, // for Google auth
      searchRequest: "",
      cocktails: [],
      savedCocktails: {},
      showSearchCocktails: false,
      showMainPage: true,
      showFavourites: false
    };
  }

  // toggle between main page and favourites page render
  togglePage = e => {
    e.preventDefault();
    if (this.state[e.target.id] === false) {
      this.setState({
        [e.target.id]: true
      });
      if (e.target.id === "showMainPage") {
        this.setState({
          showFavourites: false
        });
      } else {
        this.setState({
          showMainPage: false
        });
      }
    }
  };

  // axios API get
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
            cocktails: res.data.drinks || []
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
            cocktails: res.data.drinks || []
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
            cocktails: res.data.drinks || []
          });
        });
    }
  };

  // on component mount, check if user state is logged in, if so get snapshot of the db relative to user's uid
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

  // firebase user logout only, note it does not log off of user's Google account
  logout = () => {
    auth.signOut().then(() => {
      this.setState({
        user: null
      });
    });
  };

  // firebase user login, also logs the user's Google account
  login = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({
        user
      });
    });
  };

  // handle form submission
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

  // save user's text input to
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  // method to save selected cocktail to user's favourite list
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
    swal({
      title: "Cocktail added!",
      text: `'${cocktail.strDrink}' added to your Favourites! 🍸`,
      icon: "success",
      button: "Sweeeeet!"
    });
  };

  // method to remove selected cocktail from user's favourite list
  removeCocktail = e => {
    const firebaseKey = e.target.id;
    const cocktailDBRef = firebase
      .database()
      .ref(`uid/${this.state.user.uid}/${firebaseKey}`);
    cocktailDBRef.remove();
    swal({
      title: "Cocktail removed!",
      text: "Selected cocktail has been removed from your Favourites.",
      icon: "success",
      button: "OK"
    });
  };

  render() {
    return (
      <Fragment>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar togglePage={this.togglePage} />
        <main id="main-content">
          {this.state.showMainPage ? (
            <section className="search-section">
              {this.state.user ? (
                <div className="login-container">
                  <p>{this.state.user.displayName}</p>
                  <button className="login-button" onClick={this.logout}>
                    <i className="fas fa-sign-in-alt">
                      <span className="visuallyhidden">Log Out</span>
                    </i>
                  </button>
                </div>
              ) : (
                <div className="login-container">
                  <p>Log In</p>
                  <button className="login-button" onClick={this.login}>
                    <i className="fas fa-sign-in-alt">
                      <span className="visuallyhidden">Log In</span>
                    </i>
                  </button>
                </div>
              )}
              <div className="center-search-container">
                <div className="emoji-logo">
                  <Emoji symbol="🍸" label="cocktail" />
                  <Emoji symbol="🧙‍" label="man mage" />
                </div>
                <h1>Bar Wizard</h1>
                <h2>A cocktail lookup app</h2>
                <form onSubmit={this.handleRequest} action="">
                  <label className="visuallyhidden" htmlFor="searchRequest">
                    Search text
                  </label>
                  <input
                    aria-label="search text box"
                    aria-required="true"
                    placeholder="Ex. Margarita"
                    onChange={this.handleChange}
                    value={this.state.searchRequest}
                    type="text"
                    required={true}
                    id="searchRequest"
                  />
                  <input type="submit" value="Search" />
                  <button
                    className="randomCocktail"
                    type="button"
                    onClick={this.handleRequest}
                  >
                    Surprise me!
                  </button>
                </form>
              </div>
            </section>
          ) : null}

          {this.state.showSearchCocktails && this.state.showMainPage ? (
            <CocktailList
              saveCocktail={this.saveCocktail}
              cocktails={this.state.cocktails}
              userState={this.state.user}
            />
          ) : null}

          {this.state.showFavourites ? (
            <Favourites
              savedCocktails={this.state.savedCocktails}
              removeCocktail={this.removeCocktail}
              userState={this.state.user}
              login={this.login}
              logout={this.logout}
            />
          ) : null}
        </main>
      </Fragment>
    );
  }
}

export default App;
