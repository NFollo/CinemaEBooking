import "./ViewProfile.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function ViewProfile() {

    // do not use this data as a reference please change the names of all the variables as necessary
    var user = {
      first_name: "",
      last_name: "",
      phone: "",
      email: Cookies.get("email"),
      password: "",

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

    // Basic info
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phone_number, setPhone_number] = useState("");

    // Home Address Info
    const [hasAddress, setHasAddress] = useState(false);
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [zipcode, setZipcode] = useState("");

    // Include all requests and set values here
    useEffect(() => {
    const getAllData = async() => {
      try {
        var response = await axios.get('http://localhost:5000/users/' + Cookies.get("email"));
        //console.log(response.data);
        setFirst_name(response.data.first_name);
        setLast_name(response.data.last_name);
        setPhone_number(response.data.phone_number);

        if (response.data.address != null) {
          //console.log(response.data.address.$oid);
          var getaddr = await axios.get('http://localhost:5000/addresses/' + response.data.address.$oid);
          console.log(getaddr.data);
          setCountry(getaddr.data.country);
          setState(getaddr.data.state);
          setZipcode(getaddr.data.zip_code);
          setAddress(getaddr.data.street);
          setCity(getaddr.data.city);
          setHasAddress(true);
        } 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      };
      getAllData(); // I feel like this line should be inside the curly brackets above, but it works for now
    }, []);

    const navigate = useNavigate();
    const navEditProfile = () => {
        navigate("/editprofile");
    };

    const addressField = 
    <div>
      <div>Country: <span>{country}</span></div>
      <div>State: <span>{state}</span></div>
      <div>City: <span>{city}</span></div>
      <div>Address: <span>{address}</span></div>
      <div>ZIP Code: <span>{zipcode}</span></div>
    </div>;
    const noAddressField = 
    <div>
      No Address Saved
    </div>;

    return (
      <div className="ViewProfile">
        <div className="ViewProfileTitle">
            View Profile
        </div>
        <div className="ViewProfileInfo">
            <div className="ViewProfileSubtitle">General Information</div>
            <div>Email: <span>{Cookies.get("email")}</span></div>
            <div>First Name: <span>{first_name}</span></div>
            <div>Last Name: <span>{last_name}</span></div>
            <div>Phone Number: <span>{phone_number}</span></div>            
            <div>Password: <span>********</span></div>

            <div className="ViewProfileSubtitle">Home Address</div>
            {hasAddress ? addressField : noAddressField}

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