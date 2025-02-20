import "./AdminEdit.css";
import { useNavigate } from 'react-router-dom';

function AdminEditProfile() {

  const navigate = useNavigate();
  const navProfiles = () => {
    navigate("/manageusers");
  };

  return (
    <div className="AdminEdit">
      <div className="AdminEditTitle">Edit User Profile</div>
      <form>
            <div className="AdminEditSubtitle">General Information</div>
            <div>Email:</div>
            <input type="text"></input>
            <div>Name:</div>
            <input type="text"></input>
            <div>Phone Number:</div>
            <input type="text"></input>
            <div>Password:</div>
            <input type="text"></input>

            <div className="AdminEditSubtitle">Card 1 Information</div>
            <div>Card Type:</div>
            <select name="cardtype">
              <option value="none"></option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>            
            
            <div className="AdminFormSection">
                Name (as appears on card):
                <input type="text"></input>
            </div>  
            <div className="AdminFormSection">
                Card Number:
            <input type="number"></input>
            </div>
            <div className="AdminFormSection">
                Expiration Date:
            <input type="date"></input>
            </div>
            <div className="AdminFormSection">
                CVC:
            <input type="number"></input>
            </div>

            <div className="AdminEditSubtitle">Card 1 Billing Address Information</div>

            <div className="AdminFormSection">
                Country:
            <input type="text"></input>
            </div>
            <div className="AdminFormSection">
                State:
            <input type="text"></input>
            </div>
            <div className="AdminFormSection">
                City:
            <input type="text"></input>
            </div>
            <div className="AdminFormSection">
                Address:
            <input type="text"></input>
            </div>
            <div className="AdminFormSection">
                Zip Code:
            <input type="number"></input>
            </div>
            <input type="submit" value="Save Changes" onClick={navProfiles} className="AdminEditSave"></input>
            
        </form>

    </div>
  );
}

export default AdminEditProfile;