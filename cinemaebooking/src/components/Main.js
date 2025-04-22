import './Main.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import HomeView from './HomeView/HomeView';
import AdminEditProfile from "./AdminViews/AdminEditProfile";
import EditMovie from "./AdminViews/EditMovie";
import EditPromotions from "./AdminViews/EditPromotions";
import ManageMovies from "./AdminViews/ManageMovies";
import ManagePromotions from "./AdminViews/ManagePromotions";
import ManageUsers from "./AdminViews/ManageUsers";

import BuyTicketsPage from "./BookingViews/BuyTicketsPage";
import CheckoutPage from "./BookingViews/CheckoutPage";
import OrderConfirmation from "./BookingViews/OrderConfirmation";
import SeatSelection from "./BookingViews/SeatSelection";

import ComingSoon from "./HomePageViews/ComingSoon";
import CurrentlyRunning from "./HomePageViews/CurrentlyRunning";
import MainFeatured from "./HomePageViews/MainFeatured";
import TitleBody from "./HomePageViews/TitleBody";

import EditProfile from "./LoggedInViews/EditProfile";
import ViewProfile from "./LoggedInViews/ViewProfile";

import LoginForgotPassword from "./LoginViews/LoginForgotPassword";
import LoginPage from "./LoginViews/LoginPage";

import AdminNavBar from "./NavBarViews/AdminNavBar";
import LoggedNavBar from "./NavBarViews/LoggedNavBar";
import NavBar from "./NavBarViews/NavBar";

import SchedulePage from "./ScheduleViews/SchedulePage";
import CreateMovie from './AdminViews/CreateMovie';

import MovieInfoPage from "./SearchViews/MovieInfoPage";
import SearchPage from "./SearchViews/SearchPage";

import ConfirmationPage from "./SignupViews/ConfirmationPage";
import SignupPage from "./SignupViews/SignupPage";

import Cookies from "js-cookie";
//import { useNavigate } from 'react-router-dom';


function Main() {

  const [input, setInput] = useState("");
  const onSearch = (e) => setInput(e.target.value);
  const clearInput = () => setInput("");

  //const navigate = useNavigate();

  // Initialize login cookie as false if not already set
  useEffect(() => {
    if (!Cookies.get("authorization")) {
      Cookies.set("authorization", "false", { expires: 1, path: "/" });
    }
  }, []);
  const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

  const logout = () => {
    Cookies.set("authorization", "false", { expires: 1, path: "/" });
    setAuthorization(Cookies.get("authorization"));
    if (Cookies.get("email")) {
      Cookies.set("email", "0", { expires: 0, path: "/" });
    }
    window.location.reload();
    //navigate("/"); 
  };

  // This is for the testing header.  Clicking the button cycles between unauthorized, customer, and admin
  const [test, setTest] = useState(Cookies.get("authorization"));
  const testButton = (e) => {
    e.preventDefault();
    console.log("test: " + test)
    console.log("cookie value: " + Cookies.get("authorization"));

    if (authorization === "false") {
      Cookies.set("authorization", "customer", { expires: 1, path: "/" });
      setAuthorization(Cookies.get("authorization"));
    } else if (authorization === "customer") {
      Cookies.set("authorization", "admin", { expires: 1, path: "/" });
      setAuthorization(Cookies.get("authorization"));
    } else if (authorization === "admin" || authorization === "error") {
      logout();
    } else {
      Cookies.set("authorization", "error", { expires: 1, path: "/" });
    }

    setTest(Cookies.get("authorization"))
  }

  return (
    <div className="Main">
      <Router>
        <div className="AllRoutes">
          <Routes>
            <Route exact path='/' element={<HomeView onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />
            <Route exact path='/login' element={<LoginPage setAuthorization={setAuthorization}/>} />
            <Route exact path='/forgotpassword' element={<LoginForgotPassword />} />
            <Route exact path='/signup' element={<SignupPage />} />
            <Route exact path='/confirmation' element={<ConfirmationPage />} />
            <Route exact path='/search' element={<SearchPage query={input} onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>} />
            <Route exact path='/schedule' element={<SchedulePage onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />
            <Route exact path='/viewprofile' element={<ViewProfile onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />
            <Route exact path='/editprofile' element={<EditProfile onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />
            <Route exact path='/manageusers' element={<ManageUsers onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/admineditprofile' element={<AdminEditProfile onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/managemovies' element={<ManageMovies query={input} onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/admineditmovie' element={<EditMovie onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/admincreatemovie' element={<CreateMovie onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/managepromotions' element={<ManagePromotions onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} /> 
            <Route exact path='/editpromotions' element={<EditPromotions onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />            
            <Route exact path='/buytickets' element={<BuyTicketsPage />} />
            <Route exact path='/seatselection' element={<SeatSelection />} />
            <Route path="/checkout" element={<CheckoutPage />} />            
            <Route path="/orderconfirmation" element={<OrderConfirmation />} />
            <Route exact path='/movieinfo' element={<MovieInfoPage onSearch={onSearch} logout={logout} input={input} clearInput={clearInput} />} />
            <Route path='/*' element={<div>Error404</div>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Main;
