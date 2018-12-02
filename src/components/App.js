/* COMPONENTS */
import React, { Component, Fragment } from "react";
import CocktailList from "./Cocktail";
import Favourites from "./List";
import Header from "./Header";

/* METHODS */
import axios from "axios";
import firebase, { auth, provider } from "../firebase";
import swal from "sweetalert";

/* STYLES AND IMAGES */
import "../App.scss";

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

  togglePage = e => {
    e.preventDefault();
    if (this.state[e.target.id] === false) {
      this.setState ({
        [e.target.id]: true
      })
      if (e.target.id === "showMainPage") {
        this.setState({
          showFavourites: false
        })
      }
      else {
        this.setState({
          showMainPage: false
        })
      }
    }
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

  scrollToMyRef = e => {
    window.scrollTo({
      top: this.myRef.current.offsetTop,
      behavior: "smooth"
    });
  };

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
    swal({
      title: "Cocktail added!",
      text: `'${cocktail.strDrink}' added to your Favourites!`,
      icon: "success",
      button: "Sweeeeet!"
    });
  };

  removeCocktail = e => {
    const firebaseKey = e.target.id;
    const cocktailName = e.target.cocktailName;
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
        <Header togglePage={this.togglePage} />
        <main>
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
            <h1>Bar Wizard</h1>
            <h2>A cocktail lookup app</h2>
            <form onSubmit={this.handleRequest} action="">
              <label htmlFor="searchRequest">Type in a cocktail drink</label>
              <input
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
                Give me a random drink!
              </button>
            </form>
          </section>

          {this.state.showSearchCocktails ? (
            <section className="results-section">
              <CocktailList
                saveCocktail={this.saveCocktail}
                cocktails={this.state.cocktails}
                userState={this.state.user}
              />
            </section>
          ) : null}

          <Favourites
            savedCocktails={this.state.savedCocktails}
            removeCocktail={this.removeCocktail}
            userState={this.state.user}
            login={this.login}
            logout={this.logout}
          />
        </main>
      </Fragment>
    );
  }
}

export default App;
