import "./NavBar.css";
import { useState } from "react";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <nav className="navbar">
      <div className="leftPart">
        <button className="home">Home</button>
      </div>

      <div className="center">
        <input
          type="text"
          placeholder="Search..."
          className="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="searchButton" onClick={() => alert(`Searching for: ${searchTerm}`)}>🔍</button>
      </div>

      <div className="rightPart">
        <button className="signUp">Sign Up</button>
        <button className="login">Login</button>
      </div>
    </nav>
  );
}

export default NavBar;