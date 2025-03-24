import "./EditProfile.css";
import { useNavigate } from 'react-router-dom';

/*
 * This form is admittedly messy.  In the future this will be changed when functionality is added
 */

function EditProfile() {

    const navigate = useNavigate();
    const navViewProfile = () => {
        navigate("/viewprofile");
    };

    return (
      <div className="EditProfile">
        <div className="EditProfileTitle">
            Edit Profile
        </div>
        <form className="EditProfileForm">
            <div className="EditProfileSubtitle">General Information</div>
            <div>Email: <span>sample@domain.com</span></div>
            <div>Name:</div>
            <input type="text"></input>
            <div>Phone Number:</div>
            <input type="text"></input>

            <div className="EditProfileSubtitle">Home Address</div>
            <div className="SignupFormSection">
                Country:
            <input type="text"></input>
            </div>
            <div className="SignupFormSection">
                State:
            <input type="text"></input>
            </div>
            <div className="SignupFormSection">
                City:
            <input type="text"></input>
            </div>
            <div className="SignupFormSection">
                Address:
            <input type="text"></input>
            </div>
            <div className="SignupFormSection">
                Zip Code:
            <input type="number"></input>
            </div>

            <div className="cardContainer">
                <div className="cardInformationContainer">
                    <div className="EditProfileSubtitle">Card 1 Information</div>
                    <div>Card Type:</div>
                    <select name="cardtype">
                    <option value="none"></option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                    </select>
                    
                    <div className="SignupFormSection">
                    
                    </div>
                    <div className="SignupFormSection">
                        Name (as appears on card):
                        <input type="text"></input>
                    </div>  
                    <div className="SignupFormSection">
                        Card Number:
                    <input type="number"></input>
                    </div>
                    <div className="SignupFormSection">
                        Expiration Date:
                    <input type="date"></input>
                    </div>
                    <div className="SignupFormSection">
                        CVC:
                    <input type="number"></input>
                    </div>
                </div>
                <div className="cardAddressContainer">
                    <div className="EditProfileSubtitle">Card 1 Billing Address Information</div>

                    <div className="SignupFormSection">
                        Country:
                    <input type="text"></input>
                    </div>
                    <div className="SignupFormSection">
                        State:
                    <input type="text"></input>
                    </div>
                    <div className="SignupFormSection">
                        City:
                    <input type="text"></input>
                    </div>
                    <div className="SignupFormSection">
                        Address:
                    <input type="text"></input>
                    </div>
                    <div className="SignupFormSection">
                        Zip Code:
                    <input type="number"></input>
                    </div>
                </div>

                <button className="deleteCardButton">Delete Card 1</button>
            </div>
            <div></div>
            <div><button className="addNewCardButton">Add New Card</button></div>

            <div className="addressInformationContainer">

            </div>

        

          <input type="submit" value="Save Changes" onClick={navViewProfile} className="EditProfileSave"></input>
            
        </form>
      </div>
    );
}
  
export default EditProfile;