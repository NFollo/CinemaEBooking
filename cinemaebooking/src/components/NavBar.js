import "./NavBar.css";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import createAcc from "../img/create-acc.png";
import login from "../img/login.png";
// import user from "../img/user.png"; 
// import edit from "../img/edit.png";
// import logout from "../img/log-out.png";

function DropdownItem({ img, text }) {
  return (
    <li className="dropdownItem">
      <img src={img} alt="icon" className="dropdownIcon" />
      <span>{text}</span>
    </li>
  );
}

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

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
        <button className="searchButton">
          <FaSearch />
        </button>
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
            <DropdownItem img={createAcc} text="Create Account" />
            <DropdownItem img={login} text="Login" />
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