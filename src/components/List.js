import React, { Component, Fragment } from "react";

// from uuid npm package
const uuidv4 = require("uuid/v4");

const SavedList = props => {
  return (
    <Fragment>
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
    </Fragment>
  );
};

const SavedCocktail = props => {
  return (
    <div className="saved-list-container">
      <h4>{props.cocktail[1].name}</h4>
      <img src={props.cocktail[1].thumbnail} alt={props.cocktail[1].name} />
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

export default SavedList;
