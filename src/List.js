import React, { Component, Fragment } from "react";

// from uuid npm package
const uuidv4 = require("uuid/v4");

const SavedList = props => {
  return (
    <section>
      {Object.entries(props.savedCocktails).map(currCocktail => {
        return <SavedCocktail removeCocktail={props.removeCocktail} key={currCocktail[0]} cocktail={currCocktail} />;
      })}
    </section>
  );
};

const SavedCocktail = props => {
  return (
    <div>
      <h2>{props.cocktail[1].name}</h2>
      <img src={props.cocktail[1].thumbnail} alt={props.cocktail[1].name} />
      <h3>Ingredients</h3>
      <ul>
        {props.cocktail[1].ingredients.map(currIngredient => (
          <SavedIngredient key={uuidv4()} ingredient={currIngredient} />
        ))}
      </ul>
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
