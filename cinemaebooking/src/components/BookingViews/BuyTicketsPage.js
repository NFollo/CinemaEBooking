import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./BuyTicketsPage.css";

function BuyTicketsPage() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedShow, setSelectedShow] = useState(null);
  const [availableDates, setAvailableDates] = useState([]); 
  const [availableShowtimes, setAvailableShowtimes] = useState({}); 
  const [tickets, setTickets] = useState({ adult: 0, child: 0, senior: 0 });
  const today = new Date().toISOString().split("T")[0];

  const showroomMapping = { // hardcoded showroom id to showroom number
    '67d47d3e2016246101cf8c05': 1,
    '67d47f66f3d339983b1b1185': 2,
    '67ec946be0d4d125670ad5bc': 3,
  };
  
  const getShowroomNumber = (showroomId) => showroomMapping[showroomId] || "Unknown";
  
  // no movie 
  console.log("location.state:", location.state);
  const movie = location.state || {
    title: "Unknown Movie",
    description: "No description available",
    trailer_picture_url: "https://via.placeholder.com/150",
    
  };

  //console.log("movie ID:", movie._id);
  
  // THIS IS HOW YOU GET THE MOVIE ID
  //console.log("BUY TICKET PAGE MOVIE ID: " + movie._id?.$oid) 


  const ticketPrices = {  
    adult: 15.99,
    child: 12.99,
    senior: 14.49,
  };

  const handleDateChange = (e) => {
    const chosenDate = e.target.value;
    if (chosenDate >= today) {
      setSelectedDate(chosenDate);
    } else {
      setSelectedDate("");
    }
  };

  const formatShowtime = (hour) => {
    const intHour = parseInt(hour);
    const displayHour = intHour % 12 === 0 ? 12 : intHour % 12;
    return `${displayHour}:00 PM`;
  };
  
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchMovieShows = async () => {
      const movieId = movie._id?.$oid || movie._id;
      if (!movieId) return;
  
      try {
        const res = await fetch(`http://localhost:5000/shows/movie/${movieId}`);
        const data = await res.json();
        console.log("Fetched show data:", data);
        setAllData(data);
        console.log(allData);
  
        const result = {};
        const dateSet = new Set();
  
        data.forEach(show => {
          const date = show.date;
          const time = show.time.toString();
  
          if (!result[date]) result[date] = {};
          if (!result[date][time]) result[date][time] = [];
  
          result[date][time].push(show);
          dateSet.add(date);
        });
  
        setAvailableDates(Array.from(dateSet).sort());
        setAvailableShowtimes(result);
      } catch (err) {
        console.error("Failed to fetch shows by movie ID", err);
      }
    };
  
    fetchMovieShows();
  }, [movie]);
  

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
    if (!selectedDate || !selectedTime || totalTickets === 0) {
      alert("Please select a date, showtime, and at least one ticket before continuing.");
      return;
    }

    //console.log("TEST");
    //console.log(allData);
    var showID = "";
    allData.forEach((show) => {
      if (show.date.toString() === selectedDate && show.time.toString() === selectedTime && show.showroom === selectedShow.showroom) {
        showID = show._id;
        //console.log(show);
        //console.log(show._id);
      }
    });

    navigate(
      `/seatselection?movie=${encodeURIComponent(movie.title)}&date=${selectedDate}&showtime=${selectedTime}&tickets=${totalTickets}&showroom=${getShowroomNumber(selectedShow.showroom)}&showID=${showID}&child=${tickets.child}&adult=${tickets.adult}&senior=${tickets.senior}`,
      {
        state: {
          movie,
          movieId: movie._id,
          selectedDate,
          showtime: selectedTime,
          selectedShow,
          tickets
        }
      }
    );
    
    
    
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
          <img className="movieImg" src={movie.trailer_picture_url} alt={movie.title} /> 
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

        {/* <div className="dateSelection">
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
              {["12:00 AM", "3:00 PM", "6:00 PM", "9:00 PM"].map((time) => (
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
        )} */}

        <div className="dateSelection">
          <h3>Select Date:</h3>
          <div className="dateButtons">

          {availableDates
            .filter((date) => {
              const [year, month, day] = date.split("-");
              const showDate = new Date(year, month - 1, day);
              const todayDate = new Date();
              todayDate.setHours(0, 0, 0, 0); 

              return showDate >= todayDate; 
            })
            .map((date) => {
              const [year, month, day] = date.split("-");
              const localDate = new Date(year, month - 1, day);

              return (
                <button
                  key={date}
                  className={`dateButton ${selectedDate === date ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedShowtime("");
                  }}
                >
                  {localDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </button>
              );
            })}


          </div>
        </div>

        {selectedDate && (
          <>
            <h3>Select Showtime:</h3>
            <div className="showtimeButtons">
            {Object.keys(availableShowtimes[selectedDate] || {})
              .sort((a, b) => {
                const toSortValue = (time) => (parseInt(time) === 12 ? 0 : parseInt(time));
                return toSortValue(a) - toSortValue(b);
              })
              .map((time) => (
                <button
                  key={time}
                  className={`showtimeButton ${selectedTime === time ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedTime(time);
                    setSelectedShow(null);
                  }}
                >
                  {formatShowtime(time)}
                </button>
            ))}

            </div>
          </>
        )}


        {selectedTime && (
          <>
            <h3>Select Showroom:</h3>
            <div className="showroomButtons">
              {(availableShowtimes[selectedDate][selectedTime] || []).map((show) => (
                <button
                  key={show._id}
                  className={`showtimeButton ${selectedShow?._id === show._id ? "selected" : ""}`}
                  onClick={() => setSelectedShow(show)}
              >
                  Showroom {getShowroomNumber(show.showroom)}
              </button>
              
              ))}
            </div>
          </>
        )}

        {selectedShow && (
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