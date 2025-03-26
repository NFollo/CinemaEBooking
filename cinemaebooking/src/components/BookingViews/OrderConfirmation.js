import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";
import { FaShoppingBag } from "react-icons/fa";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultOrder = {
    movieTitle: "Unknown Movie",
    selectedDate: "N/A",
    showtime: "N/A",
    selectedSeats: [],
    totalPrice: 0,
    discount: 0,
  };

  const {
    movieTitle,
    selectedDate,
    showtime,
    selectedSeats,
    totalPrice,
    discount,
  } = location.state || defaultOrder;

  return (
    <div className="confirmationPage">
      <div className="confirmationContainer">
        <FaShoppingBag className="confirmationIcon" />
        <h1 className="confirmationTitle">Thank you!</h1>
        <p className="confirmationMessage">A confirmation has been sent to your email.</p>

        <div className="orderDetailsContainer">
          <h3 className="orderDetailsTitle">Order Summary</h3>
          <div className="orderDetails">
            <div className="detailItem"><strong>Movie:</strong> <span>{movieTitle}</span></div>
            <div className="detailItem"><strong>Date:</strong> <span>{selectedDate}</span></div>
            <div className="detailItem"><strong>Showtime:</strong> <span>{showtime}</span></div>
            <div className="detailItem"><strong>Seats:</strong> <span>{selectedSeats.join(", ")}</span></div>
            <div className="detailItem">
              <strong>Total Price:</strong>
              <span>
                {discount > 0 ? (
                  <>
                    <s>${totalPrice.toFixed(2)}</s> → ${(totalPrice - discount).toFixed(2)}
                  </>
                ) : (
                  `$${totalPrice.toFixed(2)}`
                )}
              </span>
            </div>
          </div>
        </div>

        <button className="homeButton" onClick={() => navigate("/")}>Return Home</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
