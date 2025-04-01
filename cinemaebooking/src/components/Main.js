import './Main.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

import MovieInfoPage from "./SearchViews/MovieInfoPage";
import SearchPage from "./SearchViews/SearchPage";

import ConfirmationPage from "./SignupViews/ConfirmationPage";
import SignupPage from "./SignupViews/SignupPage";

import Cookies from "js-cookie";


function Main() {

  const [input, setInput] = useState("");
  const onSearch = (e) => setInput(e.target.value);
  const clearInput = () => setInput("");

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
            <Route exact path='/' 
              element={
                <div>
                  {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
                    : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
                    : <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>)}
                  <TitleBody />
                  <MainFeatured />
                  <CurrentlyRunning />
                  <ComingSoon />
                </div>
              } 
            />
            <Route exact path='/login' 
              element={
                <div>
                  <LoginPage setAuthorization={setAuthorization}/>
                </div>
              } 
            />
            <Route exact path='/forgotpassword' 
              element={
                <div>
                  <LoginForgotPassword />
                </div>
              } 
            />
            <Route exact path='/signup' 
              element={
                <div>
                  <SignupPage />
                </div>
              } 
            />
            <Route exact path='/confirmation' 
              element={
                <div>
                  <ConfirmationPage />
                </div>
              } 
            />
            <Route exact path='/search' 
              element={
                <div>
                  <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <SearchPage query={input}/>
                </div>
              } 
            />
            <Route exact path='/viewprofile' 
              element={
                <div>
                  {(authorization === "admin" || authorization === "customer") ? "" : <Navigate to="/"></Navigate>}  
                  <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <ViewProfile />
                </div>
              } 
            />
            <Route exact path='/editprofile' 
              element={
                <div>
                  {(authorization === "admin" || authorization === "customer") ? "" : <Navigate to="/"></Navigate>}  
                  <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <EditProfile />
                </div>
              } 
            />
            <Route exact path='/manageusers' 
              element={
                <div>
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <ManageUsers />
                </div>
              } 
            /> 
            <Route exact path='/admineditprofile' 
              element={
                <div>
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <AdminEditProfile />
                </div>
              } 
            /> 
            <Route exact path='/managemovies' 
              element={
                <div>
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <ManageMovies query={input}/>
                </div>
              } 
            /> 
            <Route exact path='/admineditmovie' 
              element={
                <div>
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <EditMovie />
                </div>
              } 
            /> 
            <Route exact path='/managepromotions' 
              element={
                <div>
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <ManagePromotions />
                </div>
              } 
            /> 
            <Route exact path='/editpromotions' 
              element={
                <div> 
                  {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}                 
                  <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
                  <EditPromotions />
                </div>
              } 
            />            
            <Route exact path='/buytickets' element={<BuyTicketsPage />} />
            <Route exact path='/seatselection' element={<SeatSelection />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            
            <Route path="/orderconfirmation" element={<OrderConfirmation />} />
            <Route exact path='/movieinfo' 
              element={ <div>
                          <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                          <MovieInfoPage />
                        </div>} 
            />
            <Route path='/*' element={<div>Error404</div>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Main;
