import React, { Fragment } from "react";

// from uuid npm package
const uuidv4 = require("uuid/v4");

// search results cocktail component

const CocktailList = props => {
  return (
    <section className="results-section">
      <h2>Search Results</h2>
      <div className="results-section-cocktails">
        {props.cocktails.map(currCocktail => {
          return (
            <SingleCocktail
              key={currCocktail.idDrink}
              cocktail={currCocktail}
              userState={props.userState}
              saveCocktail={props.saveCocktail}
            />
          );
        })}
      </div>
    </section>
  );
};

const SingleCocktail = props => {
  let cocktailIngredients = [];
  for (let property in props.cocktail) {
    if (
      /strIngredient/.test(property) &&
      props.cocktail[property] !== null &&
      props.cocktail[property] !== ""
    ) {
      cocktailIngredients.push(props.cocktail[property]);
    }
  }
  return (
    <div key={props.cocktail.idDrink}>
      <img src={props.cocktail.strDrinkThumb} alt={props.cocktail.strDrink} />
      <h3>{props.cocktail.strDrink}</h3>
      <div className="ingredients-container">
        <h4>Ingredients</h4>
        <ul>
          {cocktailIngredients.map(currIngredient => (
            <SingleIngredient key={uuidv4()} ingredient={currIngredient} />
          ))}
        </ul>
      </div>
      {props.userState ? (
        <button
          className="saveCocktail"
          type="button"
          onClick={() =>
            props.saveCocktail(props.cocktail, cocktailIngredients)
          }
        >
          Save this drink
        </button>
      ) : null}
    </div>
  );
};

const SingleIngredient = props => {
  return <li>{props.ingredient}</li>;
};

export default CocktailList;
