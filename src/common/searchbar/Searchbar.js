import React from "react";
import Ball from "../../assets/Ball.png";
import "./styles.scss";

const SearchBar = () => {
  return (
    <div className="grid grid-flow-col auto-cols-max">
      <input
        type="text"
        className="searchbox"
        placeholder="Use the Advanced Search to explore Pokémon"
      />
      <div className="ballContainer">
        <button>
          <img src={Ball} alt="Pokemon Ball" width="40.02" height="40"></img>
        </button>
      </div>
    </div>
  );
};
export default SearchBar;
