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
        </li>
    )
}

export default CocktailList;