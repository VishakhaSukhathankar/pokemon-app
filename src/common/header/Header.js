import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import logo from "../../assets/logo.png";
import pokeball from "../../assets/Pokeball.png";
import Search from "../searchbar/Searchbar";

const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" className="bg-red-500">
          <Toolbar className="grid grid-flow-col">
            <div>
              <img src={logo} alt="Pokemon Logo" width="156" height="56"></img>
            </div>
            <div>
              <Search />
            </div>
            <div className="grid justify-items-end">
              <img src={pokeball} alt="Pokeball" width="40.02" height="40"></img>
            </div>
          </Toolbar>
        </AppBar>
        </Box>
  );
};

export default Header;
