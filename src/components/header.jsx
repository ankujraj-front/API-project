import React from "react";
import { Link } from "react-router-dom";

const Header = () =>{
 return(
    <div>
          <header className="header">
      <h1 className="logo">MyStore</h1>

      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">Products</Link>
          </li>
        </ul>
      </nav>
    </header>
    </div>
 )



}

export default Header;
