import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./BuyTicketsPage.css";

function BuyTicketsPage() {
  const location = useLocation(); 
  const navigate = useNavigate();
  
  // no movie 
  const movie = location.state || {
    title: "Unknown Movie",
    description: "No description available",
    image: "https://via.placeholder.com/150",
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });

  const ticketPrices = {
    adult: 15.99,
    child: 12.99,
    senior: 14.49,
  };

  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (e) => {
    const chosenDate = e.target.value;
    if (chosenDate >= today) {
      setSelectedDate(chosenDate);
    } else {
      setSelectedDate("");
    }
  };

  const totalPrice = (tickets.adult * ticketPrices.adult) + 
                     (tickets.child * ticketPrices.child) + 
                     (tickets.senior * ticketPrices.senior);

  const handleIncrement = (type) => {
    setTickets({ ...tickets, [type]: tickets[type] + 1 });
  };

  const handleDecrement = (type) => {
    if (tickets[type] > 0) {
      setTickets({ ...tickets, [type]: tickets[type] - 1 });
    }
  };

  const totalTickets = tickets.adult + tickets.child + tickets.senior;

  const handleContinue = () => {
    if (!selectedDate || !selectedShowtime || totalTickets === 0) {
      alert("Please select a date, showtime, and at least one ticket before continuing.");
      return;
    }

    navigate(`/seatselection?movie=${movie.title}&date=${selectedDate}&showtime=${selectedShowtime}&tickets=${totalTickets}`);
  };

  return (
    <div className="buyTicketsPage">
      <div className="pageHeader">
        <button className="navButton" onClick={() => navigate(-1)}>Back</button>
        <h2>Buy Tickets</h2>
        <button className="navButton" onClick={() => navigate(-1)}>Exit</button>
      </div>
      
      <div className="pageBody">
        <div className="movieDetails">
          <img className="movieImg" src={movie.image} alt={movie.title} /> 
          <div className="movieInfo">
            <div className="movieTitle">
              <h3>Movie:</h3>
              <p>{movie.title}</p> 
            </div>
            <div className="movieDesc">
              <p>{movie.description}</p> 
            </div>
          </div>
        </div>

        <div className="dateSelection">
          <h3>Date:</h3>
          <input 
            type="date" 
            className="dateInput" 
            value={selectedDate} 
            min={today} 
            onChange={handleDateChange} 
            required
          />
        </div>

        {selectedDate && (
          <>
            <h3>Select Showtime:</h3>
            <div className="showtimeButtons">
              {["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"].map((time) => (
                <button 
                  key={time}
                  className={`showtimeButton ${selectedShowtime === time ? "selected" : ""}`}
                  onClick={() => setSelectedShowtime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedShowtime && (
          <>
            <div className="ticketSelection">
              {[
                { type: "adult", label: "Adult", price: ticketPrices.adult, note: "Age 13-59" },
                { type: "child", label: "Child", price: ticketPrices.child, note: "Age 2-12" },
                { type: "senior", label: "Senior", price: ticketPrices.senior, note: "Age 60+" }
              ].map(({ type, label, price, note }) => (
                <div className="ticketRow" key={type}>
                  <div className="ticketInfo">
                    <h3>{label} <span className="ticketNote">{note}</span></h3>
                  </div>
                  <div className="ticketPrice">${price.toFixed(2)}</div>
                  <div className="ticketCounter">
                    <button onClick={() => handleDecrement(type)}>-</button>
                    <span>{tickets[type]}</span>
                    <button onClick={() => handleIncrement(type)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="totalPrice">Total: ${totalPrice.toFixed(2)}</div>
            <button className="continueButton" onClick={handleContinue}>Continue</button>
          </>
        )}
      </div>
    </div>
  );
}

export default BuyTicketsPage;