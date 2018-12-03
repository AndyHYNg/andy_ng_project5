import React, { Fragment } from "react";

// from uuid npm package
const uuidv4 = require("uuid/v4");

// favourites list component

const Favourites = props => {
  return (
    <section className="favourites">
      {props.userState ? (
        <div className="login-container">
          <p>{props.userState.displayName}</p>
          <button className="login-button" onClick={props.logout}>
            <i className="fas fa-sign-in-alt">
              <span className="visuallyhidden">Log Out</span>
            </i>
          </button>
        </div>
      ) : (
          <div className="login-container">
            <p>Log In</p>
            <button className="login-button" onClick={props.login}>
              <i className="fas fa-sign-in-alt">
                <span className="visuallyhidden">Log In</span>
              </i>
            </button>
          </div>
        )}
      {props.userState ? (
        <div>
          <div className="user-profile">
            <h3>{props.userState.displayName}</h3>
            <img src={props.userState.photoURL} alt={props.userState.displayName} />
          </div>
          <h2>Favourites</h2>
          <SavedList
            removeCocktail={props.removeCocktail}
            savedCocktails={props.savedCocktails}
          />
        </div>
      ) : (
          <Fragment>
            <h2>Favourites</h2>
            <p>You must be logged in to see saved cocktail drinks.</p>
          </Fragment>
        )}
    </section>
  )
}

const SavedList = props => {
  return (
    <div className="saved-list-container">
      {props.savedCocktails ? (
        Object.entries(props.savedCocktails).map(currCocktail => {
          return (
            <SavedCocktail
              removeCocktail={props.removeCocktail}
              key={currCocktail[0]}
              cocktail={currCocktail}
            />
          );
        })
      ) : (
        <p>You do not have any saved cocktails.</p>
      )}
    </div>
  );
};

const SavedCocktail = props => {
  return (
    <div className="saved-list-drink">
      <img src={props.cocktail[1].thumbnail} alt={props.cocktail[1].name} />
      <h4>{props.cocktail[1].name}</h4>
      <div className="ingredients-container">
        <h5>Ingredients</h5>
        <ul>
          {props.cocktail[1].ingredients.map(currIngredient => (
            <SavedIngredient key={uuidv4()} ingredient={currIngredient} />
          ))}
        </ul>
      </div>
      <button
        className="removeCocktail"
        type="button"
        onClick={props.removeCocktail}
        id={props.cocktail[0]}
      >
        Remove this drink
      </button>
    </div>
  );
};

const SavedIngredient = props => {
  return <li>{props.ingredient}</li>;
};

// export default SavedList;
export default Favourites;
