import './Main.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import TitleBody from './TitleBody';
import MainFeatured from './MainFeatured';
import ComingSoon from './ComingSoon';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

function Main() {
  return (
    <div className="Main">
      <Router>
        <div className="AllRoutes">
          <Routes>
            <Route exact path='/' 
              element={
                <div>
                  <NavBar />
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
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default Main;
