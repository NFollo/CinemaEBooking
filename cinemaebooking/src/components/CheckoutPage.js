import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { movieTitle, selectedDate, showtime, selectedSeats, totalPrice } =
    location.state || {
      movieTitle: "Unknown Movie",
      selectedDate: "N/A",
      showtime: "N/A",
      selectedSeats: [],
      totalPrice: 0,
    };

  return (
    <div className="checkoutPage">
      <div className="header">
        <button className="navButton" onClick={() => navigate(-1)}>Back</button>
        <h2>Checkout</h2>
        <button className="navButton" onClick={() => navigate("/")}>Exit</button>
      </div>

      <div className="checkoutContainer">
        <h3 className="orderTitle">Order Details</h3>
        <div className="orderDetails">
          <div className="detailItem"><strong>Movie:</strong> <span>{movieTitle}</span></div>
          <div className="detailItem"><strong>Date:</strong> <span>{selectedDate}</span></div>
          <div className="detailItem"><strong>Showtime:</strong> <span>{showtime}</span></div>
          <div className="detailItem"><strong>Seats:</strong> <span>{selectedSeats.join(", ")}</span></div>
          <div className="detailItem"><strong>Total Price:</strong> <span>${totalPrice.toFixed(2)}</span></div>
        </div>
      </div>

      <button className="confirmButton" onClick={() => navigate("/orderconfirmation")}>
         Confirm Purchase
    </button>

    </div>
  );
};

export default CheckoutPage;
