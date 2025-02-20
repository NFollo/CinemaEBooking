import "./Manage.css";
import { Link } from 'react-router-dom';

function ManageMovies() {

  return (
    <div className="Manage">
      <div className="ManageTitle">Manage Movies</div>
      
      <div className="ManageUnit">
        <div className="ManageUnitName">Sonic</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditmovie'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">Sonic 2</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditmovie'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <div className="ManageUnitName">Detective Pikachu</div>
        <div className="ManageUnitOptions">
            <Link to={'/admineditmovie'} className="ManageEditButton">
                Edit
            </Link>
            <div className="ManageEditButton">Delete</div>
        </div>
      </div>
      <div className="ManageUnit">
        <Link to={'/admineditmovie'} className="ManageEditButtonAdd">
            Add Movie
        </Link>
      </div>

    </div>
  );
}

export default ManageMovies;