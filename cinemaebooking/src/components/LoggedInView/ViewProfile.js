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

    var temporaryCard = [];
    const [numberOfCards, setNumberOfCards] = useState(0);

    //const [cardNum, setCardNum] = useState(temporaryCard);
    //const [cardCVC, setCardCVC] = useState(temporaryCard);
    const [card1Type, setCard1Type] = useState("");
    const [card1Name, setCard1Name] = useState("");
    const [card1Month, setCard1Month] = useState("");
    const [card1Year, setCard1Year] = useState("");    
    const [card1Country, setCard1Country] = useState("");
    const [card1State, setCard1State] = useState("");
    const [card1City, setCard1City] = useState("");
    const [card1Address, setCard1Address] = useState("");
    const [card1Zipcode, setCard1Zipcode] = useState("");
    const [card1Last4, setCard1Last4] = useState("");

    const [card2Type, setCard2Type] = useState("");
    const [card2Name, setCard2Name] = useState("");
    const [card2Month, setCard2Month] = useState("");
    const [card2Year, setCard2Year] = useState("");    
    const [card2Country, setCard2Country] = useState("");
    const [card2State, setCard2State] = useState("");
    const [card2City, setCard2City] = useState("");
    const [card2Address, setCard2Address] = useState("");
    const [card2Zipcode, setCard2Zipcode] = useState("");
    const [card2Last4, setCard2Last4] = useState("");

    const [card3Type, setCard3Type] = useState("");
    const [card3Name, setCard3Name] = useState("");
    const [card3Month, setCard3Month] = useState("");
    const [card3Year, setCard3Year] = useState("");    
    const [card3Country, setCard3Country] = useState("");
    const [card3State, setCard3State] = useState("");
    const [card3City, setCard3City] = useState("");
    const [card3Address, setCard3Address] = useState("");
    const [card3Zipcode, setCard3Zipcode] = useState("");
    const [card3Last4, setCard3Last4] = useState("");

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

        var getCards = await axios.get('http://localhost:5000/paymentCards/' + response.data._id.$oid);
        const cards = getCards.data;
        console.log("cards: " + cards); // remove this later
        setNumberOfCards(cards.length);

        if (cards.length >= 1) {
          setCard1Type(getCards.data[0].card_type);
          setCard1Name(getCards.data[0].name_on_card);
          setCard1Month(getCards.data[0].month);
          setCard1Year(getCards.data[0].year);
          setCard1Last4(getCards.data[0].last_four)
          let cardAddr = await axios.get('http://localhost:5000/addresses/' + getCards.data[0].billing_address.$oid);
          setCard1Country(cardAddr.data.country);
          setCard1State(cardAddr.data.state);
          setCard1City(cardAddr.data.city);
          setCard1Address(cardAddr.data.street);
          setCard1Zipcode(cardAddr.data.zip_code);
        }

        if (cards.length >= 2) {
          setCard2Type(getCards.data[1].card_type);
          setCard2Name(getCards.data[1].name_on_card);
          setCard2Month(getCards.data[1].month);
          setCard2Year(getCards.data[1].year);
          setCard2Last4(getCards.data[1].last_four)
          let cardAddr = await axios.get('http://localhost:5000/addresses/' + getCards.data[1].billing_address.$oid);
          setCard2Country(cardAddr.data.country);
          setCard2State(cardAddr.data.state);
          setCard2City(cardAddr.data.city);
          setCard2Address(cardAddr.data.street);
          setCard2Zipcode(cardAddr.data.zip_code);
        }

        if (cards.length >= 3) {
          setCard3Type(getCards.data[2].card_type);
          setCard3Name(getCards.data[2].name_on_card);
          setCard3Month(getCards.data[2].month);
          setCard3Year(getCards.data[2].year);
          setCard3Last4(getCards.data[2].last_four)
          let cardAddr = await axios.get('http://localhost:5000/addresses/' + getCards.data[2].billing_address.$oid);
          setCard3Country(cardAddr.data.country);
          setCard3State(cardAddr.data.state);
          setCard3City(cardAddr.data.city);
          setCard3Address(cardAddr.data.street);
          setCard3Zipcode(cardAddr.data.zip_code);
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
      <div>Address: <span>{address}</span></div>
      <div>City: <span>{city}</span></div>
      <div>State: <span>{state}</span></div>
      <div>Country: <span>{country}</span></div>
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

            {numberOfCards >= 1 ? 
            <div>
              <div className="ViewProfileSubtitle">Card 1 Information</div>
              <div>Card Type: <span>{card1Type}</span></div>
              <div>Name on Card: <span>{card1Name}</span></div>
              <div>Card Number: <span>**** **** **** {card1Last4}</span></div>
              <div>Expiration Date: <span>{card1Month + " " +  card1Year}</span></div>
              <div>CVC: <span>***</span></div>
              <div className="ViewProfileSubtitle">Card 1 Billing Address</div>
              <div>Country: <span>{card1Country}</span></div>
              <div>State: <span>{card1State}</span></div>
              <div>City: <span>{card1City}</span></div>
              <div>Address: <span>{card1Address}</span></div>
              <div>ZIP Code: <span>{card1Zipcode}</span></div>
            </div> : ""}

            {numberOfCards >= 2 ? 
            <div>
              <div className="ViewProfileSubtitle">Card 2 Information</div>
              <div>Card Type: <span>{card2Type}</span></div>
              <div>Name on Card: <span>{card2Name}</span></div>
              <div>Card Number: <span>**** **** **** {card2Last4}</span></div>
              <div>Expiration Date: <span>{card2Month + " " +  card2Year}</span></div>
              <div>CVC: <span>***</span></div>
              <div className="ViewProfileSubtitle">Card 2 Billing Address</div>
              <div>Country: <span>{card2Country}</span></div>
              <div>State: <span>{card2State}</span></div>
              <div>City: <span>{card2City}</span></div>
              <div>Address: <span>{card2Address}</span></div>
              <div>ZIP Code: <span>{card2Zipcode}</span></div>
            </div> : ""}

            {numberOfCards >= 3 ? 
            <div>
              <div className="ViewProfileSubtitle">Card 3 Information</div>
              <div>Card Type: <span>{card3Type}</span></div>
              <div>Name on Card: <span>{card3Name}</span></div>
              <div>Card Number: <span>**** **** **** {card3Last4}</span></div>
              <div>Expiration Date: <span>{card3Month + " " +  card3Year}</span></div>
              <div>CVC: <span>***</span></div>
              <div className="ViewProfileSubtitle">Card 3 Billing Address</div>
              <div>Country: <span>{card3Country}</span></div>
              <div>State: <span>{card3State}</span></div>
              <div>City: <span>{card3City}</span></div>
              <div>Address: <span>{card3Address}</span></div>
              <div>ZIP Code: <span>{card3Zipcode}</span></div>
            </div> : ""}

            <button onClick={navEditProfile} className="ViewProfileEdit">Edit Profile</button>            

        </div>
      </div>
    );
}
  
export default ViewProfile;