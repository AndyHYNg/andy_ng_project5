import React, { Component, Fragment } from "react";

const SavedList = props => {
    Object.entries(props.savedCocktails || {}).map((cocktail) => {
        console.log(cocktail);
        return(
            <div key={cocktail[0]}>
                <h2>{cocktail[1].name}</h2>
                <img src={cocktail[1].thumbnail} alt={cocktail[1].name} />
                <ul>
                    {cocktail[1].ingredients.forEach((ingredient) => {
                        return (<li>ingredient</li>);
                    })}
                </ul>
            </div>
        )
    })
    // Object.entries(this.state.savedCocktails || {}).map((cocktail) => {
    //     console.log(cocktail);
    //     return (
    //         <div key={cocktail[0]}>
    //             <h2>{cocktail[1].title}</h2>
    //         </div>
    //     )
    // })
}

export default SavedList;