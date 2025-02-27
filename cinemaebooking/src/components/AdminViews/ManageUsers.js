import "./Manage.css";
import { Link } from 'react-router-dom';

function ManageUsers() {
  return (
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
  );
}

export default ManageUsers;