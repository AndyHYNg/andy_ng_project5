import React, { Component, Fragment } from "react";

const Header = props => {
  return (
    // mobile-first approach
    // we want a fixed (bottom) header that stays in place as your scroll with a nav to get around the single page (ids are required)
    <Fragment>
      <header className="header">
        <nav className="header-nav">
          {/* <h2>Bar Wizard</h2> */}
          <ul>
            <li className="header-nav-item">
              <button id="showMainPage" onClick={props.togglePage}>
                <i className="fas fa-home" />
                Home
              </button>
            </li>
            <li className="header-nav-item">
              <button id="showFavourites" onClick={props.togglePage}>
                <i className="fas fa-star" />
                Favourites
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </Fragment>
  );
};

export default Header;
