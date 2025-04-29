import "./ViewProfile.css";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import {getAddress} from "../../applicationLogic/AddressManager";
import {getUserByEmail} from "../../applicationLogic/UserManager";
import {userInfo, receivePromotions, address, card1, card2, card3, build} from "./ViewProfileBuilder";

import LoggedNavBar from '../NavBarViews/LoggedNavBar';
import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";

function ViewProfile( {onSearch, input, clearInput, logout} ) {

    // authorization
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    // Basic Info
    const [m_userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        receivePromotions: false
    });

    // Home Address Info
    const [m_address, setAddress] = useState({
        type: "home",
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: ""
    });

    // Card Info
    const [m_card1, setCard1] = useState({
        type: "",
        nameOnCard: "",
        expirationMonth: "",
        expirationYear: "",
        lastFour: "",
        address: {
            type: "billing",
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        }
    });
    const [m_card2, setCard2] = useState({
        type: "",
        nameOnCard: "",
        expirationMonth: "",
        expirationYear: "",
        lastFour: "",
        address: {
            type: "billing",
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        }
    });
    const [m_card3, setCard3] = useState({
        type: "",
        nameOnCard: "",
        expirationMonth: "",
        expirationYear: "",
        lastFour: "",
        address: {
            type: "billing",
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
        }
    });

    // Include all requests and set values here
    useEffect(() => {async function getData() {
        try {
            // get user information
            const email = Cookies.get("email");
            const retrievedUser = await getUserByEmail(email);
            const newUserInfo = {
                firstName: retrievedUser.first_name,
                lastName: retrievedUser.last_name,
                email: email,
                phoneNumber: retrievedUser.phone_number,
                receivePromotions: retrievedUser.receive_promotions
            }
            setUserInfo(newUserInfo);
            userInfo(newUserInfo); // builder call
            receivePromotions(newUserInfo.receivePromotions); // builderCall

            // get home address information
            if (retrievedUser.address != null) {
                let getaddr = await getAddress(retrievedUser.address.$oid)
                const newAddress = {
                    type: "home",
                    street: getaddr.street,
                    city: getaddr.city,
                    state: getaddr.state,
                    country: getaddr.country,
                    zipCode: getaddr.zip_code
                };
                setAddress(newAddress);
                address(newAddress); // builder call
            }


            // get card information
            let getCards = await axios.get(`http://localhost:5000/paymentCards/${retrievedUser._id.$oid}`);
            const cards = getCards.data;
            const numberOfCards = cards.length;
            
            if (numberOfCards >= 1) {
                let cardAddr = await getAddress(cards[0].billing_address.$oid);
                const newCard = {
                    type: cards[0].card_type,
                    nameOnCard: cards[0].name_on_card,
                    expirationMonth: cards[0].month,
                    expirationYear: cards[0].year,
                    lastFour: cards[0].last_four,
                    address: {
                        type: "billing",
                        street: cardAddr.street,
                        city: cardAddr.city,
                        state: cardAddr.state,
                        country: cardAddr.country,
                        zipCode: cardAddr.zip_code
                    }
                };
                setCard1(newCard);
                card1(newCard); // builder call
            }

            if (numberOfCards >= 2) {
                let cardAddr = await getAddress(cards[1].billing_address.$oid);
                const newCard = {
                    type: cards[1].card_type,
                    nameOnCard: cards[1].name_on_card,
                    expirationMonth: cards[1].month,
                    expirationYear: cards[1].year,
                    lastFour: cards[1].last_four,
                    address: {
                        type: "billing",
                        street: cardAddr.street,
                        city: cardAddr.city,
                        state: cardAddr.state,
                        country: cardAddr.country,
                        zipCode: cardAddr.zip_code
                    }
                };
                setCard2(newCard);
                card2(newCard); // builder call
            }

            if (numberOfCards >= 3) {
                let cardAddr = await getAddress(cards[2].billing_address.$oid);
                const newCard = {
                    type: cards[2].card_type,
                    nameOnCard: cards[2].name_on_card,
                    expirationMonth: cards[2].month,
                    expirationYear: cards[2].year,
                    lastFour: cards[2].last_four,
                    address: {
                        type: "billing",
                        street: cardAddr.street,
                        city: cardAddr.city,
                        state: cardAddr.state,
                        country: cardAddr.country,
                        zipCode: cardAddr.zip_code
                    }
                };
                setCard3(newCard)
                card3(newCard); // builder call
            }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }};
        getData();
    }, []);

    const navigate = useNavigate();
    const navEditProfile = () => {
        navigate("/editprofile");
    };
    const navViewHistory = () => {
        navigate("/orderhistory");
    }

    return (
    <div>
        <div>
        {(authorization === "admin" || authorization === "customer") ? "" : <Navigate to="/"></Navigate>}  
                  {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
                    : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
                    : "")}
        </div>
        <div className="ViewProfile">
        <div className="ViewProfileTitle">
            View Profile
        </div>
        <div className="ViewProfileInfo">
            {build()} {/* builder.build() */}
            <div><button onClick={navViewHistory} className="ViewProfileEdit">View Order History</button></div>       
            <button onClick={navEditProfile} className="ViewProfileEdit">Edit Profile</button>
        </div>
      </div>
      </div>
    );
}
  
export default ViewProfile;