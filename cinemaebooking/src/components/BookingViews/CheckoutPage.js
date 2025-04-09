import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("saved");
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
  
    if (matchedPromo) {
      const today = new Date();
      const expirationDate = new Date(matchedPromo.expiration_date);
  
      if (today <= expirationDate) {
        const discountAmount = (totalPrice * matchedPromo.discount) / 100;
        setDiscount(discountAmount);
        setError("");
      } else {
        setError("Promo code has expired");
        setDiscount(0);
      }
    } else {
      setError("Invalid promo code");
      setDiscount(0);
    }
  };
  

  const defaultOrder = {
    movieTitle: "Unknown Movie",
    selectedDate: "N/A",
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

  // useEffect(() => {
  //   console.log("Order state:", location.state);
  // }, [location.state]);
  

  useEffect(() => {
    const getCards = async () => {
      try {
        const email = Cookies.get("email");
        if (!email) return;
  
        // Get user by email to retrieve their ObjectId
        const userRes = await axios.get(`http://localhost:5000/users/${email}`);
        const userId = userRes.data._id.$oid;
  
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
          const addr = await axios.get(`http://localhost:5000/addresses/${cards[0].billing_address.$oid}`);
          setCard1Country(addr.data.country);
          setCard1State(addr.data.state);
          setCard1City(addr.data.city);
          setCard1Address(addr.data.street);
          setCard1Zipcode(addr.data.zip_code);
        }
  
        if (cards.length >= 2) {
          setCard2Type(cards[1].card_type);
          setCard2Name(cards[1].name_on_card);
          setCard2Month(cards[1].month);
          setCard2Year(cards[1].year);
          setCard2Last4(cards[1].last_four);
          const addr = await axios.get(`http://localhost:5000/addresses/${cards[1].billing_address.$oid}`);
          setCard2Country(addr.data.country);
          setCard2State(addr.data.state);
          setCard2City(addr.data.city);
          setCard2Address(addr.data.street);
          setCard2Zipcode(addr.data.zip_code);
        }
  
        if (cards.length >= 3) {
          setCard3Type(cards[2].card_type);
          setCard3Name(cards[2].name_on_card);
          setCard3Month(cards[2].month);
          setCard3Year(cards[2].year);
          setCard3Last4(cards[2].last_four);
          const addr = await axios.get(`http://localhost:5000/addresses/${cards[2].billing_address.$oid}`);
          setCard3Country(addr.data.country);
          setCard3State(addr.data.state);
          setCard3City(addr.data.city);
          setCard3Address(addr.data.street);
          setCard3Zipcode(addr.data.zip_code);
        }
  
      } catch (error) {
        console.error("Error fetching payment cards:", error);
      }
    };
  
    getCards();
  }, []);
  

  const { movieTitle, selectedDate, showtime, selectedSeats, totalPrice } =
    location.state || defaultOrder;

  const handlePayment = () => {
    if (!paymentMethod) { // if the user does not select a payment method
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
        showtime,
        selectedSeats,
        totalPrice,
        discount,
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
          <div className="detailItem"><strong>Showtime:</strong> <span>{showtime}</span></div>
          <div className="detailItem"><strong>Seats:</strong> <span>{selectedSeats.join(", ")}</span></div>
          <div className="detailItem"><strong>Total Price:</strong> <span>${totalPrice.toFixed(2)}</span></div>
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