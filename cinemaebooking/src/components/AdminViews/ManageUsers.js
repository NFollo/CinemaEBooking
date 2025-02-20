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
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample2@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">sample3@domain.com</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>

    </div>
  );
}

export default ManageUsers;