import "./AdminEdit.css";
import { useNavigate } from 'react-router-dom';
//import { useState } from "react";

function EditPromotions() {

  //const [selectedShowtime, setSelectedShowtime] = useState("");

  const navigate = useNavigate();
  const navPromotions = () => {
    navigate("/managepromotions");
  };

  return (
    <div className="AdminEdit">
      <div className="AdminEditTitle">Edit Promotion</div>
      <form>
            <div>Name:</div>
            <input type="text"></input>
            <div>Code:</div>
            <input type="text"></input>

            <div className="AdminFormSection">
                Expiration Date:
            <input type="date"></input>
            </div>            
             
            <input type="submit" value="Save Changes" onClick={navPromotions} className="AdminEditSave"></input>            
            
        </form>

    </div>
  );
}

export default EditPromotions;