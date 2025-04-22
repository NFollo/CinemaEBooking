import { useState} from "react";
import Cookies from "js-cookie";
import NavBar from '../NavBarViews/NavBar';
import LoggedNavBar from '../NavBarViews/LoggedNavBar';
import AdminNavBar from '../NavBarViews/AdminNavBar';
import TitleBody from "../HomePageViews/TitleBody";
import MainFeatured from "../HomePageViews/MainFeatured";
import CurrentlyRunning from "../HomePageViews/CurrentlyRunning";
import ComingSoon from "../HomePageViews/ComingSoon";

function HomeView({onSearch, input, clearInput, logout}) {

    // authorization
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    return (
        <div>
            {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
            : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
            : <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>)}
            <TitleBody />
            <MainFeatured />
            <CurrentlyRunning />
            <ComingSoon />
        </div>
    );
}

export default HomeView;