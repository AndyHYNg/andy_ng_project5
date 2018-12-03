import React, { Fragment } from "react";
import Emoji from "./Emoji";

// Navbar Component

const Navbar = props => {
  return (
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
                Search
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

export default Navbar;
