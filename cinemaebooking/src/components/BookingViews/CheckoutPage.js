import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

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

  // eventully get from db
  const validPromoCodes = {
    "DISCOUNT10": 10, // 10% discount
    "MOVIE5": 5 // 5% discount
  };

  const applyPromoCode = () => {
    if (validPromoCodes[promoCode]) {
      const discountAmount = (totalPrice * validPromoCodes[promoCode]) / 100;
      setDiscount(discountAmount);
      setError("");
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

  const formatDate = (dateString) => { // formats the date into Month DD, YYYY
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    })
  }

  const { movieTitle, selectedDate, showtime, selectedSeats, totalPrice } =
    location.state || defaultOrder;

  const handlePayment = () => {
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
          
          <label className={`paymentOption ${paymentMethod === "saved" ? "selected" : ""}`}>
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
          </label>

          
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
        <h3>Coupon Code</h3>
          <input 
            type="text" 
            placeholder="Enter your code" 
            className="promoInput" 
            value={promoCode} 
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