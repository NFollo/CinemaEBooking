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
                  <ComingSoon />
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
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Main;
