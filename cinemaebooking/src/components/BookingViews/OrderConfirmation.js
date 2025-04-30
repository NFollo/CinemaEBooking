import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";
import { FaShoppingBag } from "react-icons/fa";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

const OrderConfirmation = () => {

  const email = Cookies.get("email");
  //const [userID, setUserID] = useState(null);
  //var userID = null;

  // useEffect(() => {
  //   const getUserID = async () => {
  //     try {
  //       // get user ID
  //       const res = await axios.get("http://localhost:5000/users/email/"+email);
  //       console.log("fetched user data: ", res.data)
  //       console.log("userId = " + res.data._id?.$oid);
  //       //setUserID(res.data._id?.$oid);
  //       //userID = res.data._id?.$oid;

  //       // post data to DB
  //       const booking = {
  //         "customer_id": res.data._id?.$oid,
  //         "show_id": showID,
  //         "promotion_id": promoID,
  //         "tickets": [
  //           {"ticket_type": "adult",
  //             "quantity": parseInt(adult),
  //             "price": 15.99,
  //           },
  //           {"ticket_type": "child",
  //             "quantity": parseInt(child),
  //             "price": 12.99,
  //           },
  //           {"ticket_type": "senior",
  //             "quantity": parseInt(senior),
  //             "price": 14.49,
  //           }
  //         ],
  //         "seats": selectedSeats,
  //         "price": parseInt((totalPrice - discount).toFixed(2))
  //       };
  //       axios.post("http://localhost:5000/bookings", { booking })
  //       .then((res) => {
  //         console.log("posted booking to DB", res.data);          
  //       })
  //       .catch((err) => {
  //         console.error("Error posting the booking:", err);
  //       });

  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   getUserID();
  // }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const defaultOrder = {
    movieTitle: "Unknown Movie",
    selectedDate: "N/A",
    showroom: "N/A",
    showtime: "N/A",
    selectedSeats: [],
    totalPrice: 0,
    discount: 0,
  };

  const {
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
    showID,
    promoID
  } = location.state || defaultOrder;

  console.log("final promoID: " + promoID);
  console.log("final showID: " + showID);

  return (
    <div className="confirmationPage">
      <div className="confirmationContainer">
        <FaShoppingBag className="confirmationIcon" />
        <h1 className="confirmationTitle">Thank you!</h1>
        <p className="confirmationMessage">A confirmation has been sent to your email.</p>

        <div className="orderDetailsContainer">
          <h3 className="orderDetailsTitle">Order Summary</h3>
          <div className="orderDetails">
            <div className="detailItem"><strong>TEST:</strong> <span>{showtime}</span></div>

            <div className="detailItem"><strong>Movie:</strong> <span>{movieTitle}</span></div>
            <div className="detailItem"><strong>Date:</strong> <span>{selectedDate}</span></div>
            <div className="detailItem"><strong>Showroom:</strong> <span>{showroom}</span></div>
            <div className="detailItem"><strong>Showtime:</strong> <span>{showtime}</span></div>
            <div className="detailItem"><strong>Seats:</strong> <span>{selectedSeats.join(", ")}</span></div>
            {child > 0 ? <div className="detailItem"><strong>Child Tickets:</strong> <span>{child}</span></div> : ""}
            {adult > 0 ? <div className="detailItem"><strong>Adult Tickets:</strong> <span>{adult}</span></div> : ""}
            {senior > 0 ? <div className="detailItem"><strong>Senior Tickets:</strong> <span>{senior}</span></div> : ""}
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
