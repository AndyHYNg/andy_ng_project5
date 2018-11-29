import React, { Component, Fragment } from "react";
import axios from "axios";

const CocktailList = props => {
    return (
        <div>
            <h2>List of cocktails:</h2>
            <ul>
                {props.cocktails.map(currCocktail => SingleCocktail(currCocktail))}
            </ul>
        </div>
    )
}

const SingleCocktail = cocktail => {
    return (
        <li>
            <h3>{cocktail.strDrink}</h3>
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            {CocktailIngredients(cocktail)}
        </li>
    )
}

const CocktailIngredients = cocktail => {
    let cocktailIngredients = [];
    for (let property in cocktail) {
      if (/strIngredient/.test(property) && cocktail[property] !== null && cocktail[property] !== "") {
        cocktailIngredients.push(cocktail[property]);
      }
    }
    return (
        <ul>
            {cocktailIngredients.map(currIngredients => Ingredients(currIngredients))}
        </ul>
    )
}

const Ingredients = cocktailIngredients => {
    return (
        <li>
            {cocktailIngredients}
        </li>
    )
}

export default CocktailList;