import "./AdminEdit.css";
import { useNavigate } from 'react-router-dom';
//import { useState } from "react";

function EditMovie() {

  //const [selectedShowtime, setSelectedShowtime] = useState("");

  const navigate = useNavigate();
  const navMovies = () => {
    navigate("/managemovies");
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

            <div>Times:</div>
            <div className="AdminShowtimeButtons">
              {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"].map((time) => (
                <label>
                <input 
                  type="checkbox"
                  key={time}
                  className={"twelve"}
                  onClick={(e) => {
                    
                  }}
                >
                </input>
                <span>{time}</span>
                </label>
              ))}

            </div>     
            
             

            <input type="submit" value="Save Changes" onClick={navMovies} className="AdminEditSave"></input>            
            
        </form>

    </div>
  );
}

export default EditMovie;