import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeatSelection.css";
import {getShowById} from "../../applicationLogic/ShowManager";

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const movieTitle = queryParams.get("movie") || "Unknown Movie";
  const showtime = queryParams.get("showtime") || "N/A";
  const showroom = queryParams.get("showroom") || "N/A";
  const selectedDate = queryParams.get("date") || "N/A";
  const numTickets = parseInt(queryParams.get("tickets"), 10) || 1;
  const showID = queryParams.get("showID") || "N/A";
  const child = queryParams.get("child");
  const adult = queryParams.get("adult");
  const senior = queryParams.get("senior");
  //const ticketPrice = 15.99;
  const tickets = location.state?.tickets || { adult: 0, child: 0, senior: 0 };

  const ticketPrices = {
    adult: 15.99,
    child: 12.99,
    senior: 14.49,
  };

  const totalPrice =
    tickets.adult * ticketPrices.adult +
    tickets.child * ticketPrices.child +
    tickets.senior * ticketPrices.senior;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const allSeats = ["A1","A2","A3","A4","A5","A6","A7","A8","B1","B2","B3","B4","B5","B6","B7","B8","C1","C2","C3","C4","C5","C6","C7","C8","D1","D2","D3","D4","D5","D6","D7","D8","E1","E2","E3","E4","E5","E6","E7","E8","F1","F2","F3","F4","F5","F6","F7","F8"]
  const [unavailableSeats, setUnavailableSeats] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const savedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
      setSelectedSeats(savedSeats);
      const show = await getShowById(showID);
      const taken = show.hasOwnProperty('taken_seats') ? show.taken_seats : [];
      setUnavailableSeats(taken);
    };
    getData();
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

  const movieId = location.state?.movieId;
  //console.log("SEAT SELECTION movie id:", movieId);

  const handleConfirm = () => {
    if (selectedSeats.length !== numTickets) {
      alert(`Please select exactly ${numTickets} seats.`);
      return;
    }
    navigate(`/checkout?movie=${movieTitle}`, {
      state: {
        movieTitle,
        movieId,
        selectedDate,
        showroom,
        showtime,
        selectedSeats,
        totalPrice,
        child: tickets.child,
        adult: tickets.adult,
        senior: tickets.senior,
      },
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