import "./NavBar.css";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import createAcc from "../img/create-acc.png";
import login from "../img/login.png";
// import user from "../img/user.png"; 
// import edit from "../img/edit.png";
// import logout from "../img/log-out.png";
// import { SearchBar } from "./SearchBar";

function DropdownItem({ img, text }) {
  return (
    <li className="dropdownItem">
      <img src={img} alt="icon" className="dropdownIcon" />
      <span>{text}</span>
    </li>
  );
}

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [input, setInput] = useState("");

  return (
    <nav className="navbar">
      <div className="leftPart">
        <button className="home">Home</button>
      </div>

      <div className="center">
        <div className="search-bar-containter">
          <div className="input-wrapper">
          <FaSearch id="search-icon"/>
          <input 
            placeholder="Type to search..." 
            value={input} onChange={(e) => setInput(e.target.value)}/>
        </div>
        </div>
      </div>

      <div className="rightPart">
        <div className="menu-container">
          <div
            className="profile"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <CgProfile size={28} className="profileIcon" />
          </div>
          <ul className={`dropdown-menu ${openMenu ? "active" : ""}`}>
            
            <Link to={'/signUp'}>
              <button className="signUp">
                <DropdownItem img={createAcc} text="Sign Up" />
              </button>
            </Link>
            <Link to={'/login'}>
              <button className="login">
                <DropdownItem img={login} text="Login" />
              </button>
            </Link>
            
            {/* <DropdownItem img={user} text="My Profile" />
            <DropdownItem img={edit} text="Edit Profile" />
            <DropdownItem img={logout} text="Logout" /> */}
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;