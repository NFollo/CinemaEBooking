import "./SchedulePage.css"
import {useState, useEffect} from "react";
import {useLocation} from 'react-router-dom';

const NUM_SHOWROOMS = 3;

function SchedulePage() {
    const location = useLocation(); 
    const [displayTime, setDisplayTime] = useState(false);
    const [displayShowroom, setDisplayShowroom] = useState(false);

    const [showsOnDate, setShowsOnDate] = useState([]);
    const [showsAtTime, setShowsAtTime] = useState([]);
    const [occupiedShowrooms, setOccupiedShowrooms] = useState([]);

    const [num12, setNum12] = useState(0);
    const [num3, setNum3] = useState(0);
    const [num6, setNum6] = useState(0);
    const [num9, setNum9] = useState(0);

    // what to display if no movie 
    const movieInfo = location.state || {
        title: "Unknown Movie",
        description: "No description available",
        trailer_picture_url: "https://via.placeholder.com/150",
        trailer_video_url: ""
    };

    const onDateChangeHandler = async (event) => {
        // retrieve all shows that are showing on targetDate
        const targetDate= event.target.value;
        if (targetDate === "") {
            setDisplayTime(false);
            setDisplayShowroom(false);
            return;
        }

        await fetch(`http://localhost:5000/shows/${targetDate}`,
            {method: "GET", 
             headers: {"Content-Type": "application/json"}})
        .then( (res) => res.json() )
        .then( (data) => {
            // reset prior time counts
            setNum12(0);
            setNum3(0);
            setNum6(0);
            setNum9(0);
            setShowsAtTime([]);
            setOccupiedShowrooms([]);

            // condense data and update new time counts
            data = data.map((show) => ({
                date: show.date,
                time: show.time,
                showroom: show.showroom,
            }))
            data.forEach( (show) => {
                if (show.time === 12)
                    setNum12((prev) => prev + 1);
                else if (show.time === 3)
                    setNum3((prev) => prev + 1);
                else if (show.time === 6)
                    setNum6((prev) => prev + 1);
                else if (show.time === 9)
                    setNum9((prev) => prev + 1);
            });

            // update data and display times
            setShowsOnDate(data);
            setDisplayTime(true);
            console.log(data);
        })
        .catch((error) => console.error("Error fetching dates:", error));
    } // onDateChangeHandler

    useEffect( () => {
        // every showroom booked at all times
        if (num12 === NUM_SHOWROOMS && num3 === NUM_SHOWROOMS 
            && num6 === NUM_SHOWROOMS && num9 === NUM_SHOWROOMS) {
                alert("There are no times available for this date")
                return;
        }

        // disable any buttons which correspond to full times
        let button;
        if (num12 === NUM_SHOWROOMS)
            document.getElementById("button12").className = "Disabled";
        else if ((button = document.getElementById("button12")) != null)
            button.className = "ScheduleButton";
        
        if (num3 === NUM_SHOWROOMS)
            document.getElementById("button3").className = "Disabled";
        else if ((button = document.getElementById("button3")) != null)
            button.className = "ScheduleButton";

        if (num6 === NUM_SHOWROOMS)
            document.getElementById("button6").className = "Disabled";
        else if ((button = document.getElementById("button6")) != null)
            button.className = "ScheduleButton";

        if (num9 === NUM_SHOWROOMS)
            document.getElementById("button9").className = "Disabled";
        else if ((button = document.getElementById("button9")) != null)
            button.className = "ScheduleButton";

    }, [showsOnDate, num12, num3, num6, num9])

    const onTimeChangeHandler = (event) => {
        let time;
        switch (event.target.id) {
            case "button12":
                time=12;
                break;
            case "button3":
                time=3;
                break;
            case "button6":
                time=6;
                break;
            case "button9":
                time=9;
                break;
        }

        setShowsAtTime(showsOnDate.filter((show) => show.time === time));
    } // onTimeChangeHandler

    useEffect( () => {
        showsAtTime.forEach( async (show) => {
            await fetch(`http://localhost:5000/showrooms/${show.showroom.$oid}`,
                {method: "GET",
                 headers: {"Content-Type": "application/json"}}
            )
            .then( (res) => res.json())
            .then( (data) => {
                setOccupiedShowrooms( oldArray => [...oldArray, data.showroom_number]);
                setDisplayShowroom(true);
            })
            .catch((error) => console.error("Error fetching showrooms:", error));
        })
    }, [showsAtTime])

    useEffect( () => {
        // disable any buttons which correspond to full times
        let button;
        if (occupiedShowrooms.includes(1))
            document.getElementById("showroom1").className = "Disabled";
        else if ((button = document.getElementById("showroom1")) != null)
            button.className = "ScheduleButton";
        
        if (occupiedShowrooms.includes(2))
            document.getElementById("showroom2").className = "Disabled";
        else if ((button = document.getElementById("showroom2")) != null)
            button.className = "ScheduleButton";

        if (occupiedShowrooms.includes(3))
            document.getElementById("showroom3").className = "Disabled";
        else if ((button = document.getElementById("showroom3")) != null)
            button.className = "ScheduleButton";
    }, [occupiedShowrooms])

    return (
    <div className="PageContainer">
        <div className="Title">{movieInfo.title}</div>
        <img className="Image" src={movieInfo.trailer_picture_url}></img>

        <div className="FormContainer">
            <div className="DateSelection">
                <div>Select a Movie Date: </div>
                <div id="spacer"></div>
                <input type="date" onChange={onDateChangeHandler}></input>
            </div>

            <div className="TimeSelection">
                <div>Select a Movie Time: </div>
                {displayTime ? <div className="ButtonsContainer">
                    
                    <button id="button12" className="ScheduleButton"
                            onClick={onTimeChangeHandler}>12:00 pm</button>
                    <button id="button3" className="ScheduleButton"
                            onClick={onTimeChangeHandler}>3:00 pm</button>
                    <button id="button6" className="ScheduleButton"
                            onClick={onTimeChangeHandler}>6:00 pm</button>
                    <button id="button9" className="ScheduleButton"
                            onClick={onTimeChangeHandler}>9:00 pm</button>
                    
                </div> : <></>}
            </div>

            <div className="ShowroomSelection">
                <div>Select a Showroom: </div>
                {displayShowroom ? <div className="ButtonsContainer">
                    <button id="showroom1" className="ScheduleButton">Showroom 1</button>
                    <button id="showroom2" className="ScheduleButton">Showroom 2</button>
                    <button id="showroom3" className="ScheduleButton">Showroom 3</button>
                    </div> : <></>
                }
            </div>
        </div>
    </div>
    );
} // SchedulePage

export default SchedulePage;