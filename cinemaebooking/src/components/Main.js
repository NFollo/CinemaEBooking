import './Main.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './NavBar';
import TitleBody from './TitleBody';
import MainFeatured from './MainFeatured';
import ComingSoon from './ComingSoon';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ConfirmationPage from './ConfirmationPage';
import SearchPage from './SearchPage/SearchPage';
import EditProfile from './LoggedInView/EditProfile';
import LoggedNavBar from './LoggedInView/LoggedNavBar';
import ViewProfile from './LoggedInView/ViewProfile';
import BuyTicketsPage from './BuyTicketsPage';
import SeatSelection from './SeatSelection';
import AdminNavBar from './AdminViews/AdminNavBar';
import ManageUsers from './AdminViews/ManageUsers';
import ManageMovies from './AdminViews/ManageMovies';
import ManagePromotions from './AdminViews/ManagePromotions';
import AdminEditProfile from './AdminViews/AdminEditProfile';
import EditMovie from './AdminViews/EditMovie';
import MovieInfoPage from './MovieInfoPage';
import CheckoutPage from './CheckoutPage';
import OrderConfirmation from './OrderConfrrmation'
import EditPromotions from './AdminViews/EditPromotions';
import CurrentlyRunning from './CurrentlyRunning';
import LoginForgotPassword from './LoginForgotPassword';


function Main() {

  const [input, setInput] = useState("");
  const onSearch = (e) => setInput(e.target.value);
  const clearInput = () => setInput("");

  return (
    <div className="Main">
      <Router>
        <div className="AllRoutes">
          <Routes>
            <Route exact path='/' 
              element={
                <div>
                  <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
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
                  <LoginPage />
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
            <Route exact path='/loggedin' 
              element={
                <div>
                  <LoggedNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <TitleBody />
                  <MainFeatured />
                  <CurrentlyRunning />
                  <ComingSoon />
                </div>
              } 
            />
            <Route exact path='/viewprofile' 
              element={
                <div>
                  <LoggedNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <ViewProfile />
                </div>
              } 
            />
            <Route exact path='/editprofile' 
              element={
                <div>
                  <LoggedNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <EditProfile />
                </div>
              } 
            />
            <Route exact path='/adminhome' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <TitleBody />
                  <MainFeatured />
                  <CurrentlyRunning />
                  <ComingSoon />
                </div>
              } 
            />
            <Route exact path='/manageusers' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <ManageUsers />
                </div>
              } 
            /> 
            <Route exact path='/admineditprofile' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <AdminEditProfile />
                </div>
              } 
            /> 
            <Route exact path='/managemovies' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <ManageMovies />
                </div>
              } 
            /> 
            <Route exact path='/admineditmovie' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <EditMovie />
                </div>
              } 
            /> 
            <Route exact path='/managepromotions' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
                  <ManagePromotions />
                </div>
              } 
            /> 
            <Route exact path='/editpromotions' 
              element={
                <div>
                  <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput}/>
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
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Main;
