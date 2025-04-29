import "./SchedulePage.css"
import {useState, useEffect} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {updateTimeButtonStatus, updateShowroomButtonStatus, getShowsByDate, getShowroomByShow, 
    handleFormSubmit} from '../../applicationLogic/ScheduleMovieHandlers';
// import NavBar from '../NavBarViews/NavBar';
// import LoggedNavBar from '../NavBarViews/LoggedNavBar';
import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const NUM_SHOWROOMS = 3;

function SchedulePage( {onSearch, input, clearInput, logout} ) {
    const location = useLocation(); 
    const navigate = useNavigate();

    // movieInfo is movie or default data if website fails to locate state 
    const movieInfo = location.state || {
        title: "Unknown Movie",
        description: "No description available",
        trailer_picture_url: "https://via.placeholder.com/150",
        trailer_video_url: ""
    };

    // authorizatoin
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    // state booleans for displaying form selection buttons
    const [displayTime, setDisplayTime] = useState(false);
    const [displayShowroom, setDisplayShowroom] = useState(false);
    const [displaySubmitButton, setDisplaySubmitButton] = useState(false);

    // state variables for storing selected inputs
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(-1);
    const [selectedShowroom, setSelectedShowroom] = useState(-1);

    // state variables to count number of movies at time for selected date
    const [numMoviesAt12, setNumMoviesAt12] = useState(0);
    const [numMoviesAt3, setNumMoviesAt3] = useState(0);
    const [numMoviesAt6, setNumMoviesAt6] = useState(0);
    const [numMoviesAt9, setNumMoviesAt9] = useState(0);

    // state variables to track shows on selected date/time
    const [showsOnDate, setShowsOnDate] = useState([]);
    const [showsAtTime, setShowsAtTime] = useState([]);
    const [occupiedShowrooms, setOccupiedShowrooms] = useState([]);


    // retrieves all shows that are showing on targetDate upon date selection
    const dateSelectionHandler = async (event) => {
        const targetDate = event.target.value;
        setSelectedDate(targetDate);

        // hide showroom options and submit button upon date change
        setDisplayShowroom(false);
        setSelectedShowroom(-1);
        setDisplaySubmitButton(false);

        // do not show time buttons upon date clear
        if (targetDate === "") {
            setDisplayTime(false);
            setSelectedTime(-1);
            return;
        }

        // do not allow scheduling before today's date
        const selectedYear = parseInt(targetDate.substring(0,4));
        const selectedMonthIndex = parseInt(targetDate.substring(5,7)) - 1;
        const selectedDay = parseInt(targetDate.substring(8,10));
        const selectedDate = new Date(selectedYear, selectedMonthIndex, selectedDay)
        const today = new Date();
        if (selectedDate.getTime() <= today.getTime()) {
            setDisplayTime(false);
            setSelectedTime(-1);
            alert("Invalid date. Movies may only be scheduled for dates in the future.");
            return;
        } 

        getShowsByDate(targetDate)
        .then( (shows) => {
            // reset prior time counts
            setNumMoviesAt12(0);
            setNumMoviesAt3(0);
            setNumMoviesAt6(0);
            setNumMoviesAt9(0);

            // condense show data
            shows = shows.map((show) => ({
                date: show.date,
                time: show.time,
                showroom: show.showroom,
            }))

            // update new time counts
            shows.forEach( (show) => {
                if (show.time === 12)
                    setNumMoviesAt12((prev) => prev + 1);
                else if (show.time === 3)
                    setNumMoviesAt3((prev) => prev + 1);
                else if (show.time === 6)
                    setNumMoviesAt6((prev) => prev + 1);
                else if (show.time === 9)
                    setNumMoviesAt9((prev) => prev + 1);
            });

            // update data and display time buttons
            setShowsOnDate(shows);
            setDisplayTime(true);
        });   
    } // dateSelectionHandler


    // updates button statuses upon completion of state update following date selection 
    useEffect( () => {
        const fullyBooked = (numMoviesAt12 === NUM_SHOWROOMS && numMoviesAt3 === NUM_SHOWROOMS 
            && numMoviesAt6 === NUM_SHOWROOMS && numMoviesAt9 === NUM_SHOWROOMS)
        
        if (fullyBooked) {
            alert("There are no times available for this date")
            setDisplayTime(false);
            return;
        }

        // enable if time slot is available, disable if not
        updateTimeButtonStatus("12", numMoviesAt12, NUM_SHOWROOMS);
        updateTimeButtonStatus("3", numMoviesAt3, NUM_SHOWROOMS);
        updateTimeButtonStatus("6", numMoviesAt6, NUM_SHOWROOMS);
        updateTimeButtonStatus("9", numMoviesAt9, NUM_SHOWROOMS);
    }, [numMoviesAt12, numMoviesAt3, numMoviesAt6, numMoviesAt9])


    // updates selectedTime and filters down tracked shows upon time selection
    const timeSelectionHandler = (event) => {
        const time = event.target.id; // string form of time number
        setSelectedTime(time);
        setDisplaySubmitButton(false);
        setShowsAtTime(showsOnDate.filter((show) => show.time == time));
    } // timeSelectionHandler


    // updates occupiedShowrooms upon completion of state update following time selection
    useEffect( () => {
        setOccupiedShowrooms([]);
        showsAtTime.forEach( (show) => 
            getShowroomByShow(show)
            .then( (showroom) => {
                setOccupiedShowrooms( oldArray => [...oldArray, showroom.showroom_number]);
            })
        );

        // only display showroom selection option if time selection available
        if (displayTime)
            setDisplayShowroom(true);
    }, [showsAtTime])


    // disables buttons which correspond to occupied rooms upon state update
    useEffect( () => {
        updateShowroomButtonStatus("showroom1", occupiedShowrooms, 1);
        updateShowroomButtonStatus("showroom2", occupiedShowrooms, 2);
        updateShowroomButtonStatus("showroom3", occupiedShowrooms, 3);
    }, [occupiedShowrooms])


    // updates selectedShowroom and displays submit button upon showroom selection
    const showroomSelectionHandler = async (event) => {
        let number;
        switch (event.target.id) {
            case "showroom1":
                number = 1;
                break;
            case "showroom2":
                number = 2;
                break;
            case "showroom3":
                number = 3;
                break;
            default:
                break;
        }
        setSelectedShowroom(number);
        setDisplaySubmitButton(true);
    } // showroomSelectionHandler


    // posts new showing to database and navigates back to manage movies page upon form submit
    const submitFormHandler = async () => {
        await handleFormSubmit(movieInfo.title, selectedShowroom, selectedDate, selectedTime)
        .then(() => navigate("/managemovies"));
    } // submitFormHandler

    return (
    <div>
    <div>
        {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}
        <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />
    </div>
    <div className="PageContainer">        
        <div className="Title">{movieInfo.title}</div>
        <img className="Image" src={movieInfo.trailer_picture_url} alt={movieInfo.title}></img>

        <div className="FormContainer">
            <div className="DateSelection">
                <div>Select a Movie Date: </div>
                <div id="spacer"></div>
                <input type="date" onChange={dateSelectionHandler}></input>
            </div>

            <div className="TimeSelection">
                <div>Select a Movie Time: </div>
                {displayTime ? <div className="ButtonsContainer">
                    
                    <button id="12" className="ScheduleButton"
                            onClick={timeSelectionHandler}>12:00 pm</button>
                    <button id="3" className="ScheduleButton"
                            onClick={timeSelectionHandler}>3:00 pm</button>
                    <button id="6" className="ScheduleButton"
                            onClick={timeSelectionHandler}>6:00 pm</button>
                    <button id="9" className="ScheduleButton"
                            onClick={timeSelectionHandler}>9:00 pm</button>
                    
                </div> : <></>}
                {displayShowroom ? <div>Selected {selectedTime}:00</div> : <></>}
            </div>

            <div className="ShowroomSelection">
                
                <div>Select a Showroom: </div>
                {displayShowroom ? <div className="ButtonsContainer">
                    <button id="showroom1" className="ScheduleButton"
                            onClick={showroomSelectionHandler}>Showroom 1</button>
                    <button id="showroom2" className="ScheduleButton"
                            onClick={showroomSelectionHandler}>Showroom 2</button>
                    <button id="showroom3" className="ScheduleButton"
                            onClick={showroomSelectionHandler}>Showroom 3</button>
                    </div> : <></>  
                }
                {displaySubmitButton ? <div>Selected Showroom {selectedShowroom}</div> : <></>}
            </div>

            {displaySubmitButton ? 
                <button className="ScheduleButton" onClick={submitFormHandler}>Schedule Movie</button> 
                : <></>
            }
        </div>
    </div>
    </div>
    );
} // SchedulePage

export default SchedulePage;