import "./OrderHistoryPage.css"
import {useState, useEffect} from "react";
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from "js-cookie";
import {getUserBookings} from "../../applicationLogic/UserManager";
import AdminNavBar from "../NavBarViews/AdminNavBar";
import LoggedNavBar from "../NavBarViews/LoggedNavBar";


function OrderHistoryPage( {onSearch, input, clearInput, logout} ) {
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));
    const email = Cookies.get("email");
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        async function getData() {
            const newBookings = await getUserBookings(email);
            setBookings(newBookings);
            console.log("bookings:")
            console.log(newBookings);
        }
        getData();
    }, []);

    return <div>
        {(authorization === "admin" || authorization === "customer") ? "" : <Navigate to="/"></Navigate>}  
                  {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
                    : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
                    : "")}
        <div className="BookingsContainer">
        {bookings.map((booking) => <div key={booking.id.$oid} className="Booking">
            <div>Booking Ref: {booking.id.$oid}</div>
            <div>{booking.movie_name} on {booking.date} at {booking.time}:00</div>
            <div>{booking.seats.length} Ticket{booking.seats.length !== 1 ? "s" : ""}: {booking.seats.map((seat) => seat)}</div>
            <div>${booking.price}</div>
            </div>)}
        </div>
    </div>
}

export default OrderHistoryPage;