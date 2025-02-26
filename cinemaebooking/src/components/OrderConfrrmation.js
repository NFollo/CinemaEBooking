import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";
import { FaShoppingBag } from "react-icons/fa"; 

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmationPage">
      <div className="confirmationContainer">
        <FaShoppingBag className="confirmationIcon" />
        <h1 className="confirmationTitle">Thank you!</h1>
        <p className="confirmationMessage">A confirmation has been sent to your email.</p>
        <button className="homeButton" onClick={() => navigate("/")}>Return Home</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
