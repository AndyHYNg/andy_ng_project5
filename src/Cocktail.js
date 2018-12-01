import React, { Fragment } from "react";

// from uuid npm package
const uuidv4 = require("uuid/v4");

const CocktailList = props => {
  return (
    <div>
      <h2>List of cocktails:</h2>
      <ul>
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
      </ul>
    </div>
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
    <li key={props.cocktail.idDrink}>
      <h3>{props.cocktail.strDrink}</h3>
      <img src={props.cocktail.strDrinkThumb} alt={props.cocktail.strDrink} />
      <h3>Ingredients</h3>
      <ul>
        {cocktailIngredients.map(currIngredient => (
          <SingleIngredient key={uuidv4()} ingredient={currIngredient} />
        ))}
      </ul>
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
    </li>
  );
};

const SingleIngredient = props => {
  return <li>{props.ingredient}</li>;
};

export default CocktailList;
