import "./Manage.css";
import { Link } from 'react-router-dom';

function ManagePromotions() {

  return (
    <div className="Manage">
      <div className="ManageTitle">Manage Promotions</div>
      
      <div className="ManageUnit">
        <div className="ManageUnitName">10% off all movies</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditcode'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
        <div className="ManagePromocode">Code: MOVIES</div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">10% off Dog Man</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditcode'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
        <div className="ManagePromocode">Code: none</div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">15% off Sonic 3</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditcode'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
        <div className="ManagePromocode">Code: HEDGEHOG</div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">20% off all movies</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditcode'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
        <div className="ManagePromocode">Code: EBOOKING</div>
      </div>
      <div className="ManageUnit">
        <Link to={'/admineditcode'} className="ManageEditButtonAdd">
            Add Promotion
        </Link>
      </div>

    </div>
  );
}

export default ManagePromotions;