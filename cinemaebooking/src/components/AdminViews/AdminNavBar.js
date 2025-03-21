import "../NavBar.css";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import createAcc from "../../img/create-acc.png";
import login from "../../img/login.png";
import editFunc from "../../img/edit.png";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
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

function AdminNavBar({onSearch, input, clearInput}) {
  const [openMenu, setOpenMenu] = useState(false);
  
  const navigate = useNavigate();
  const navHome = () => {
    clearInput();
    navigate("/");
  }
  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/search");
  };

  return (
    <nav className="navbar">
      <div className="leftPart">
        <button className="home" onClick={navHome}>Home</button>
      </div>

      <div className="center">
        <div className="search-bar-containter">
          <div className="input-wrapper">
          <FaSearch id="search-icon"/>
          <form onSubmit={onSearchSubmit}>
            <input className="NavBarInput"
              placeholder="Type to search..." 
              value={input} onChange={onSearch}
            />
          </form>
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
            <Link to={'/manageusers'}>
              <button className="signUp">
                <DropdownItem img={editFunc} text="Manage Users" />
              </button>
            </Link>
            <Link to={'/managemovies'}>
              <button className="signUp">
                <DropdownItem img={editFunc} text="Manage Movies" />
              </button>
            </Link>
            <Link to={'/managepromotions'}>
              <button className="signUp">
                <DropdownItem img={editFunc} text="Manage Promotions" />
              </button>
            </Link>
            <Link to={'/viewprofile'}>
              <button className="signUp">
                <DropdownItem img={createAcc} text="View Profile" />
              </button>
            </Link>
            <Link to={'/editprofile'}>
              <button className="signUp">
                <DropdownItem img={createAcc} text="Edit Profile" />
              </button>
            </Link>
            <Link to={'/'}>
              <button className="login" >
                <DropdownItem img={login} text="Sign Out" />
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

export default AdminNavBar;