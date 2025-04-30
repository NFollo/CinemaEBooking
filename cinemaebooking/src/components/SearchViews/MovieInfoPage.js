import "./MovieInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import NavBar from '../NavBarViews/NavBar';
import LoggedNavBar from '../NavBarViews/LoggedNavBar';
import AdminNavBar from '../NavBarViews/AdminNavBar';
import MovieMgr from "../../applicationLogic/AxiosMovieManager";
import MovieInfo from "./MovieInfo";

function MovieInfoPage({movie, onSearch, input, clearInput, logout}) {
    // navigation for BookTickets button
    const navigate = useNavigate();
    const location = useLocation(); 

    const [hasData, setHasData] = useState(false);
    const [failedLoad, setFailedLoad] = useState(false);

    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    /*
     * Proxy is MovieInfo.js
     * Pass state functions to Movie.js so it can tell MovieInfoPage.js if the data has loaded or failed to load
     * Until then, a base message is displayed
     * Once the data is loaded, MovieInfoPage.js will start showing the loaded data
     */
    
    return (
        <div>
        <div>
            {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
                            : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
                            : <NavBar onSearch={onSearch} input={input} clearInput={clearInput}/>)}
        </div>
        {
            failedLoad ? (<div className="MovieInfoPageLoading">Failed to load data</div>) : (hasData ? (
                <MovieInfo setHasData={setHasData} setFailedLoad={setFailedLoad} showProxy={true}/>
            ) : ( <div className="MovieInfoPageLoading">Loading...
                <MovieInfo setHasData={setHasData} setFailedLoad={setFailedLoad} showProxy={false}/>
            </div> ))
        }
        
        </div>
    );
}

// reviews div
/*
<div className='reviewsContainer'>
                <p className='label'>Reviews:</p>
                {reviews.map((review) => (
                    <div className='review'>
                        <div>
                            {review[0] + ": " + review[1] + "/10"}
                        </div> 
                        <div>
                            {review[2]}
                        </div>
                    </div>
                ))}
            </div>
*/

export default MovieInfoPage;
