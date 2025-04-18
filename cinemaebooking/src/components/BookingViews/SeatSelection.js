import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeatSelection.css";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get("movie") || "Unknown Movie";
  const showtime = queryParams.get("showtime") || "N/A";
  const selectedDate = queryParams.get("date") || "N/A";
  const numTickets = parseInt(queryParams.get("tickets"), 10) || 1;
  const ticketPrice = 15.99;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const unavailableSeats = ["A1", "D6", "F5"]; // unavaliable seats delete this later

  useEffect(() => {
    const savedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
    setSelectedSeats(savedSeats);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const toggleSeatSelection = (seatNumber) => {

    if (unavailableSeats.includes(seatNumber)) return; // prevents user from selecting an unavaliable seat

    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatNumber)) {
        return prevSelected.filter((seat) => seat !== seatNumber); //deselect seat
      } else if (prevSelected.length < numTickets) {
        return [...prevSelected, seatNumber]; //adds seat 
      }
      return prevSelected; // prevents from selecting more than allowed
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length !== numTickets) {
      alert(`Please select exactly ${numTickets} seats.`);
      return;
    }
    navigate(`/checkout?movie=${movieTitle}`, {
      state: { 
        movieTitle, 
        selectedDate, 
        showtime, 
        selectedSeats, 
        totalPrice: selectedSeats.length * ticketPrice 
      }
    });
  };

  return (
    <div className="seatSelectionPage">
      <div className="header">
        <button className="navButton" onClick={() => navigate(-1)}>Back</button>
        <h2>Select Your Seats</h2>
        <button className="navButton" onClick={() => navigate("/")}>Exit</button>
      </div>

      {selectedSeats.length < numTickets && (
        <p className="selectSeatsMessage">
          Select {numTickets - selectedSeats.length} seat{numTickets - selectedSeats.length > 1 ? "s" : ""}
        </p>
      )}

      <div className="seatKey">
        <div className="keyItem">
          <div className="seat unavailable"></div>
          <small>Unoccupied</small>
        </div>
        <div className="keyItem">
          <div className="seat selected"></div>
          <small>Selected</small>
        </div>
        <div className="keyItem">
          <div className="seat sold"></div>
          <small>Occupied</small>
        </div>
      </div>

      <div className="container">
        <div className="screenContainer">
            <div className="screen"></div>
        </div>

        <div className="seatsContainer">
          {[...Array(8)].map((_, rowIndex) => ( 
            <div key={rowIndex} className="row">
              {[...Array(6)].map((_, seatIndex) => { 
                const seatLetter = String.fromCharCode(65 + seatIndex); 
                const seatNumber = `${seatLetter}${rowIndex + 1}`; 
                const isSelected = selectedSeats.includes(seatNumber);
                const isUnavailable = unavailableSeats.includes(seatNumber);

                return (
                  <div
                    key={seatNumber}
                    //className={`seat ${isSelected ? "selected" : ""}`}
                    className={`seat ${isUnavailable ? "sold" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleSeatSelection(seatNumber)}
                  >
                    <span className="seatNumber">{seatNumber}</span> 
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <p className="selectedSeatsMessage">
          Selected seats: {selectedSeats.join(", ")}
        </p>
      )}

      <button className="confirmButton" onClick={handleConfirm}>Confirm Seats</button>
    </div>
  );
};

export default SeatSelection;