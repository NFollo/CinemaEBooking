import "./Manage.css";
import { Link } from 'react-router-dom';

function ManagePromotions() {

  return (
    <div className="Manage">
      <div className="ManageTitle">Manage Promotions</div>
      
      <div className="ManageUnit">
        <div className="ManageUnitName">10% off all movies</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">10% off Dog Man</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditprofile'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">20% off all movies</div>
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

export default ManagePromotions;