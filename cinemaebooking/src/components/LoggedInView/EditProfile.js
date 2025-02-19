import "./EditProfile.css";
//import { Link, useNavigate } from 'react-router-dom';

function EditProfile() {

    return (
      <div className="EditProfile">
        <div className="EditProfileTitle">
            Edit Profile
        </div>
        <form className="EditProfileForm">
            <div className="EditProfileSubtitle">General Information</div>
            <div>Name:</div>
            <input type="text"></input>
            <div>Phone Number:</div>
            <input type="text"></input>
        </form>
      </div>
    );
}
  
export default EditProfile;