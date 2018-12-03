import React, { Component, Fragment } from "react";
import Emoji from "./Emoji";

const Header = props => {
  return (
    // mobile-first approach
    // we want a fixed (bottom) header that stays in place as your scroll with a nav to get around the single page (ids are required)
    <Fragment>
      <div className="fixed-nav-container">
        <div className="nav-emoji-logo">
          <Emoji symbol="🍸" label="cocktail" />
          <Emoji symbol="🧙‍" label="man mage" />
          <h5>Bar Wizard</h5>
        </div>
        <nav className="fixed-nav">
          <ul>
            <li className="fixed-nav-item">
              <button id="showMainPage" onClick={props.togglePage}>
                <i className="fas fa-home" />
                Home
              </button>
            </li>
            <li className="fixed-nav-item">
              <button id="showFavourites" onClick={props.togglePage}>
                <i className="fas fa-star" />
                Favourites
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default Header;
