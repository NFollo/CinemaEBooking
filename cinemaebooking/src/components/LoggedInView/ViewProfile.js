import "./ViewProfile.css";
import { useNavigate } from 'react-router-dom';

function ViewProfile() {

    // do not use this data as a reference please change the names of all the variables as necessary
    const user = {
      username: "Spongebob Squarepants",
      phone: "111-222-3333",
      email: "sample@domain.com",
      password: "myPassword454",

      cardtype: "Credit",
      cardnum: 1111222233334567,
      lastfour: 4567,
      cvc: 123,
      expdate: "1/1/30",
      nameoncard: "Eugene Krabs",

      addr: "123 Streetname",
      city: "Athens",
      state: "GA",
      Country: "United States",
      zipcode: 12345
    };

    const navigate = useNavigate();
    const navEditProfile = () => {
        navigate("/editprofile");
    };

    return (
      <div className="ViewProfile">
        <div className="ViewProfileTitle">
            View Profile
        </div>
        <div className="ViewProfileInfo">
            <div className="ViewProfileSubtitle">General Information</div>
            <div>Email: <span>{user.email}</span></div>
            <div>Username: <span>{user.username}</span></div>
            <div>Phone Number: <span>{user.phone}</span></div>            
            <div>Phone Number: <span>********</span></div>

            <div className="ViewProfileSubtitle">Card 1 Information</div>
            <div>Card Type: <span>{user.cardtype}</span></div>
            <div>Name on Card: <span>{user.nameoncard}</span></div>
            <div>Card Number: <span>************{user.lastfour}</span></div>
            <div>Expiration Date: <span>{user.expdate}</span></div>
            <div>CVC: <span>***</span></div>

            <div className="ViewProfileSubtitle">Card 1 Billing Address</div>
            <div>Country: <span>{user.Country}</span></div>
            <div>State: <span>{user.state}</span></div>
            <div>City: <span>************{user.city}</span></div>
            <div>Address: <span>{user.addr}</span></div>
            <div>ZIP Code: <span>{user.zipcode}</span></div>

            <button onClick={navEditProfile} className="ViewProfileEdit">Edit Profile</button>            

        </div>
      </div>
    );
}
  
export default ViewProfile;