import "./AdminEdit.css";
import { useNavigate } from 'react-router-dom';

function EditMovie() {

  const navigate = useNavigate();
  const navProfiles = () => {
    navigate("/manageusers");
  };

  return (
    <div className="AdminEdit">
      <div className="AdminEditTitle">Edit Movie</div>
      <form>
            <div>Title:</div>
            <input type="text"></input>
            <div>Description:</div>
            <textarea></textarea>
            <div>Poster Image:</div>
            <input type="text"></input>
            <div>Genre:</div>
            <input type="text"></input>

            <div>Rating:</div>
            <select name="rating">
              <option value="none"></option>
              <option value="E">E</option>
              <option value="PG">PG</option>
              <option value="PG13">PG13</option>
              <option value="T">T</option>
              <option value="R">R</option>
            </select> 

            <div className="AdminFormSection">
                View Date 1:
            <input type="date"></input>
            </div>           
            
            <div className="AdminFormSection">
                Other:
                <input type="text"></input>
            </div>              
            
        </form>

    </div>
  );
}

export default EditMovie;