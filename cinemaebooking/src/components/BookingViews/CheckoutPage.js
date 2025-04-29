import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import axios from "axios";

import {getAddress} from "../../applicationLogic/AddressManager";
import {getUserByEmail} from "../../applicationLogic/UserManager";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const [numberOfCards, setNumberOfCards] = useState(0);

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

  const [validPromoCodes, setValidPromoCodes] = useState([]);
  const movieId = location.state?.movieId;
  //console.log("checkoutpage movie id:", movieId);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/promotions");
        setValidPromoCodes(res.data);
        console.log("fetched promos: ", res.data)
      } catch (error) {
        console.error("Failed to fetch promotions:", error);
      }
    };

    fetchPromotions();
  }, []);


  const applyPromoCode = () => {
    const matchedPromo = validPromoCodes.find(promo => promo.promo_code === promoCode);
  
    if (!matchedPromo) {
      setError("Invalid promo code");
      setDiscount(0);
      return;
    }

    if (!matchedPromo.email_send) { // checks if email was sent
      setError("This promo code is not currently active.");
      setDiscount(0);
      return;
    }
  
    const today = new Date();
    const expirationDate = new Date(matchedPromo.expiration_date);
  
    // checks if promo is for this movie
    const currentMovieId =
      location.state?.movieId ||
      location.state?.selectedShow?.movie ||
      location.state?.movie?._id?.$oid;
      //console.log("Current movie ID:", currentMovieId);
      //console.log("Promo movie ID:", matchedPromo.movie_id);

    if (matchedPromo.movie_id !== currentMovieId) {
      setError("Promo code does not apply to this movie.");
      setDiscount(0);
      return;
    }
  
    if (today > expirationDate) {
      setError("Promo code has expired");
      setDiscount(0);
      return;
    }
  
    const discountAmount = Number(originalTotal) * matchedPromo.discount;
    setDiscount(discountAmount);
    setError("");
  };
  
  const defaultOrder = {
    movieTitle: "Unknown Movie",
    selectedDate: "N/A",
    showroom: "N/A",
    showtime: "N/A",
    selectedSeats: [],
    totalPrice: 0,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    })
  }

  const formatShowtime = (hour) => {
    const intHour = parseInt(hour);
    const displayHour = intHour % 12 === 0 ? 12 : intHour % 12;
    return `${displayHour}:00 PM`;
  };

  // useEffect(() => {
  //   console.log("Order state:", location.state);
  // }, [location.state]);
  

  useEffect(() => {
    const getCards = async () => {
      try {
        const email = Cookies.get("email");
        if (!email) return;
  
        // Get user by email to retrieve their ObjectId
        const user = await getUserByEmail(email);
        const userId = user._id.$oid;
  
        // Fetch all payment cards for that user
        const cardRes = await axios.get(`http://localhost:5000/paymentCards/${userId}`);
        const cards = cardRes.data;
        console.log("Fetched cards:", cards);
  
        setNumberOfCards(cards.length);
  
        if (cards.length >= 1) {
          setCard1Type(cards[0].card_type);
          setCard1Name(cards[0].name_on_card);
          setCard1Month(cards[0].month);
          setCard1Year(cards[0].year);
          setCard1Last4(cards[0].last_four);
          const addr = await getAddress(cards[0].billing_address.$oid);
          setCard1Address(addr.street);
          setCard1City(addr.city);
          setCard1State(addr.state);
          setCard1Country(addr.country);
          setCard1Zipcode(addr.zip_code);
        }
  
        if (cards.length >= 2) {
          setCard2Type(cards[1].card_type);
          setCard2Name(cards[1].name_on_card);
          setCard2Month(cards[1].month);
          setCard2Year(cards[1].year);
          setCard2Last4(cards[1].last_four);
          const addr = await getAddress(cards[1].billing_address.$oid);
          setCard2Address(addr.street);
          setCard2City(addr.city);
          setCard2State(addr.state);
          setCard2Country(addr.country);
          setCard2Zipcode(addr.zip_code);
        }
  
        if (cards.length >= 3) {
          setCard3Type(cards[2].card_type);
          setCard3Name(cards[2].name_on_card);
          setCard3Month(cards[2].month);
          setCard3Year(cards[2].year);
          setCard3Last4(cards[2].last_four);
          const addr = await getAddress(cards[2].billing_address.$oid);
          setCard3Address(addr.data.street);
          setCard3City(addr.data.city);
          setCard3State(addr.data.state);
          setCard3Country(addr.data.country);
          setCard3Zipcode(addr.data.zip_code);
        }
  
      } catch (error) {
        console.error("Error fetching payment cards:", error);
      }
    };
  
    getCards();
  }, []);
  

  const { movieTitle, selectedDate, showroom, showtime, selectedSeats, totalPrice, child, adult, senior } =
    location.state || defaultOrder;

  const originalTotal = totalPrice; // save original price
  const finalTotal = originalTotal - discount; // total after discount

  const handlePayment = () => {
    const validMethods = ["saved1", "saved2", "saved3", "new"];
    if (!validMethods.includes(paymentMethod)) {
      alert("Please select or add a payment method.");
      return;
    }
  
    if (paymentMethod === "new") {
      if (!cardNumber || !expiryMonth || !expiryYear || !cvc || !zip) {
        alert("Please fill in all card details.");
        return;
      }
    }
  
    navigate("/orderconfirmation", {
      state: {
        movieTitle,
        selectedDate,
        showroom,
        showtime,
        selectedSeats,
        totalPrice,
        discount,
        child,
        adult,
        senior,
      },
    });
  };  
  
  return (
    <div className="checkoutPage">
      <div className="header">
        <button className="navButton" onClick={() => navigate(-1)}>Back</button>
        <h2>Checkout</h2>
        <button className="navButton" onClick={() => navigate("/")}>Exit</button>
      </div>
      {/* order details */}
      <div className="checkoutContainer">
        <h3 className="orderTitle">Order Details</h3>
        <div className="orderDetails">
          <div className="detailItem"><strong>Movie:</strong> <span>{movieTitle}</span></div>
          <div className="detailItem"><strong>Date:</strong> <span>{formatDate(selectedDate)}</span></div>
          <div className="detailItem"><strong>Showroom:</strong> <span>{showroom}</span></div>
          <div className="detailItem"><strong>Showtime:</strong> <span>{formatShowtime(showtime)}</span></div>
          <div className="detailItem"><strong>Seats:</strong> <span>{selectedSeats.join(", ")}</span></div>
          {/* <div className="detailItem"><strong>Total Price:</strong> <span>${originalTotal.toFixed(2)}</span></div> */}
          <div className="detailItem">
            <strong>Total:</strong> 
            
            {/* <span>${originalTotal.toFixed(2)}</span> */}
            <span>
                {discount > 0 ? (
                  <>
                    <s>${originalTotal.toFixed(2)}</s> → ${finalTotal.toFixed(2)}
                  </>
                ) : (
                  `$${totalPrice.toFixed(2)}`
                )}
              </span>
          </div>

          {/* {discount > 0 && (
            <div className="detailItem">
              <strong>Discount Applied:</strong> <span>- ${discount.toFixed(2)}</span>
            </div>
          )}

          {discount > 0 && (
            <div className="detailItem">
              <strong>Final Total:</strong> <span>${finalTotal.toFixed(2)}</span>
            </div>
          )} */}

          
        </div>
      </div>

      {/* payment options */}
      <div className="checkoutContainer">
        <h3>Payment</h3>
        <div className="paymentOptions">
            
          {/* <label className={`paymentOption ${paymentMethod === "saved" ? "selected" : ""}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="saved"
              checked={paymentMethod === "saved"}
              onChange={() => setPaymentMethod("saved")}
            />
            <div className="paymentCard">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
                className="cardLogo"
              />
              <span>Ending in •••• 4242</span>
            </div>
          </label> */}

          {numberOfCards >= 1 && (
            <label className={`paymentOption ${paymentMethod === "saved1" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="saved1"
                checked={paymentMethod === "saved1"}
                onChange={() => setPaymentMethod("saved1")}
              />
              <div className="paymentCard">
                <span> {/*{card1Type} card ending in */} **** **** **** {card1Last4}</span>
              </div>
            </label>
          )}

          {numberOfCards >= 2 && (
            <label className={`paymentOption ${paymentMethod === "saved2" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="saved2"
                checked={paymentMethod === "saved2"}
                onChange={() => setPaymentMethod("saved2")}
              />
              <div className="paymentCard">
                <span> {/*{card1Type} card ending in */} **** **** **** {card2Last4}</span>
              </div>
            </label>
          )}

          {numberOfCards >= 3 && (
            <label className={`paymentOption ${paymentMethod === "saved3" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="saved3"
                checked={paymentMethod === "saved3"}
                onChange={() => setPaymentMethod("saved3")}
              />
              <div className="paymentCard">
                <span> {/*{card1Type} card ending in */} **** **** **** {card3Last4}</span>
              </div>
            </label>
          )}
          
          {numberOfCards < 3 && (
            <label className={`paymentOption ${paymentMethod === "new" ? "selected" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                value="new"
                checked={paymentMethod === "new"}
                onChange={() => setPaymentMethod("new")}
              />
              <div className="addNewCard"> + Use new payment method</div>
            </label>
          )}
        </div>
   
        {paymentMethod === "new" && (
          <div className="cardDetails">
            <input
              type="text"
              placeholder="Card Number"
              className="cardInput"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
             <div className="cardRow">
              <input type="text" placeholder="MM" className="cardInput small" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)} />
              <input type="text" placeholder="YY" className="cardInput small" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)} />
              <input type="text" placeholder="CVC" className="cardInput small" value={cvc} onChange={(e) => setCvc(e.target.value)} />
            </div>
            <input type="text" placeholder="ZIP Code" className="cardInput" value={zip} onChange={(e) => setZip(e.target.value)} />
           </div>
         )}
       </div>

       
       <div className="promoContainer">
        <div className="promoBox">
          <h3>Promo Code</h3>
          <input 
            type="text" 
            placeholder="Enter your code" 
            className="promoInput" 
            value={promoCode || ""}
            onChange={(e) => setPromoCode(e.target.value)} 
          />

            <button className="applyButton" onClick={applyPromoCode}>Apply</button>
            {/* <button className="applyButton">Apply</button> */}

          </div>
          {error && <p className="errorText">{error}</p>}
          {discount > 0 && <p className="successText">Discount Applied: -${discount.toFixed(2)}</p>}
        </div>

        
        <button className="payButton" onClick={handlePayment}>
          Pay ${(totalPrice - discount).toFixed(2)}
        </button>

        
    </div>
  );
};

export default CheckoutPage;