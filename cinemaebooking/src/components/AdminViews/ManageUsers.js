import "./Manage.css";
import { Link } from 'react-router-dom';

import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState } from "react";

function ManageUsers( {onSearch, input, clearInput, logout} ) {

  // authorization
  const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

  return (
    <div>
    <div>
      {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
      <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
    </div>
    <div className="Manage">
      <div className="ManageTitle">Manage Users</div>

      <div className="ManageUnit">
        <div className="ManageUnitName">sample1@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
            <select name="cardtype">
                    <option value="none">Update User Class</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>
            </select>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample2@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
            <select name="cardtype">
                    <option value="none">Update User Class</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>
            </select>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample3@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
            <select name="cardtype">
                    <option value="none">Update User Class</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>
            </select>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample4@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
            <select name="cardtype">
                    <option value="none">Update User Class</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>
            </select>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample5@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
            <select name="cardtype">
                    <option value="none">Update User Class</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="suspended">Suspended</option>
            </select>
        </div>
        
      </div>
      <button className="ManageEditButton">Save Changes</button>
    </div>
    </div>
  );
}

export default ManageUsers;