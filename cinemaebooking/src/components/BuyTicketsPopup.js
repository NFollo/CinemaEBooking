import { useState } from "react";
import "./BuyTicketsPopup.css";

function BuyTicketsPopup({ onClose }) {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });

  const ticketPrices = {
    adult: 15.99,
    child: 12.99,
    senior: 14.49,
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

  const handleSubmit = () => {
    alert(`Movie: ${selectedMovie}, Showtime: ${selectedShowtime}, Total: $${totalPrice.toFixed(2)}`);
    onClose();
  };

  return (
    <div className="popupOverlay" onClick={onClose}>
      <div className="popupContent" onClick={(e) => e.stopPropagation()}>
        <div className="popupHeader">
          <button className="navButton">Home</button>
          <h2>Buy Tickets</h2>
          <button className="navButton" onClick={onClose}>Exit</button>
        </div>
        
        <div className="popupBody">
          <div className="movieDetails">
            <div className="movieImg">Selected Movie Img</div>
            <div className="movieInfo">
              <div className="movieSelection">
                <h3>Movie:</h3>
                <select 
                  className="movieDropdown"
                  value={selectedMovie} 
                  onChange={(e) => setSelectedMovie(e.target.value)}
                >
                  <option value="">-- Select a Movie --</option>
                  <option value="Dog Man">Dog Man</option>
                  <option value="Inception">Movie 2</option>
                  <option value="Avengers: Endgame">Movie 3</option>
                </select>
              </div>

              <hr />
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
            </div>
          </div>

          <div className="ticketSelection">
            {[
              { type: "adult", label: "Adult", price: ticketPrices.adult },
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
          <button className="continueButton" onClick={handleSubmit}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default BuyTicketsPopup;