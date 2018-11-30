import React, { Component, Fragment } from "react";

const CocktailList = props => {
  return (
    <div>
      <h2>List of cocktails:</h2>
      <ul>
        {props.cocktails.map(currCocktail =>
          SingleCocktail(currCocktail, props)
        )}
      </ul>
    </div>
  );
};

const SingleCocktail = (cocktail, props) => {
  let cocktailIngredients = [];
  for (let property in cocktail) {
    if (
      /strIngredient/.test(property) &&
      cocktail[property] !== null &&
      cocktail[property] !== ""
    ) {
      cocktailIngredients.push(cocktail[property]);
    }
  }
  //   console.log(cocktail, "single cocktail", cocktailIngredients);
  return (
    <li>
      <h3>{cocktail.strDrink}</h3>
      <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
      {SingleIngredient(cocktailIngredients)}
      <button
        className="saveCocktail"
        type="button"
        onClick={() => props.saveCocktail(cocktail, cocktailIngredients)}
      >
        Save this drink
      </button>
    </li>
  );
};

const SingleIngredient = ingredientsList => {
  return (
    <ul>
      {ingredientsList.map(currIngredients => Ingredients(currIngredients))}
    </ul>
  );
};

const Ingredients = cocktailIngredients => {
  return <li>{cocktailIngredients}</li>;
};

export default CocktailList;
