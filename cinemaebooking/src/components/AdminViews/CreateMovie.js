import "./CreateMovie.css";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";

import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import MovieMgr from "../../applicationLogic/AxiosMovieManager";


function CreateMovie( {onSearch, input, clearInput, logout} ) {

    // authorization
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [rating, setRating] = useState("");
    const [poster, setPoster] = useState("");
    const [trailer, setTrailer] = useState("");
    const [categories, setCategories] = useState("");
    const [producers, setProducers] = useState("");
    const [directors, setDirectors] = useState("");
    const [cast, setCast] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    async function addMovie (movie) {
        const createdMovie = await MovieMgr.CreateMovie(movie);
        if (createdMovie) {
            alert("Movie added successfully");
            navigate("/managemovies");
        } else {
            alert("Failed to add movie");
        }
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (isRunning === "" || title === "" || synopsis === "" || rating === "" || poster === "" || trailer === "" || categories === "" || producers === "" || directors === "" || cast === "") {
            alert("Please fill out all of the data before submitting");
        } else {
            // create arrays from the string inputs
            const myCast = cast.split(",");
            const myDirectors = directors.split(",");
            const myProducers = producers.split(",");
            const myCategories = categories.split(",");
            var movieStat = false;
            if (isRunning === "Currently Running") {
                movieStat = true;
            }

            // package to be posted to the database
            const movie = {
                title: title,
                synopsis: synopsis,
                mpaa_us_film_rating_code : rating,
                trailer_picture_url : poster,
                trailer_video_url : trailer,
                categories : myCategories,
                cast : myCast,
                directors : myDirectors,
                producers : myProducers,
                currently_running : movieStat,
            }

            //console.log(movie);
            addMovie(movie);
            
            
        }
    };

    return (
        <div>
        <div>
            {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
            <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
        </div>
        <div className="CreateMovie">      
            <div className="CreateMovieTitle">
                Add Movie
            </div>
            <form>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Title
                    </div>
                    <input className="CreateMovieInput" value={title} onChange={(e) => setTitle(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Synopsis
                    </div>
                    <textarea className="CreateMovieInput" value={synopsis} onChange={(e) => setSynopsis(e.target.value)}></textarea>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Rating
                    </div>
                    <select className="CreateMovieInput" value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value=""></option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="NC-17">NC-17</option>
                    </select>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Movie Poster (URL)
                    </div>
                    <input className="CreateMovieInput" value={poster} onChange={(e) => setPoster(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Movie Trailer (embed URL)
                    </div>
                    <input className="CreateMovieInput" value={trailer} onChange={(e) => setTrailer(e.target.value)}></input>
                </div>
                <div className="CreateMovieSubtitleTwo">For the following, enter items separated by a single comma with no extra spaces</div>
                <div>Example: Action,Comedy,Horror</div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Categories
                    </div>
                    <input className="CreateMovieInput" value={categories} onChange={(e) => setCategories(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Directors
                    </div>
                    <input className="CreateMovieInput" value={directors} onChange={(e) => setDirectors(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Producers
                    </div>
                    <input className="CreateMovieInput" value={producers} onChange={(e) => setProducers(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Cast
                    </div>
                    <input className="CreateMovieInput" value={cast} onChange={(e) => setCast(e.target.value)}></input>
                </div>
                <div className="CreateMovieEntry">
                    <div className="CreateMovieSubtitle">
                        Movie Status
                    </div>
                    <select className="CreateMovieInput" value={isRunning} onChange={(e) => setIsRunning(e.target.value)}>
                        <option value=""></option>
                        <option value="Currently Running">Currently Running</option>
                        <option value="Coming Soon">Coming Soon</option>
                    </select>
                </div>
                <button className="CreateMovieButton" onClick={onFormSubmit}>Add Movie</button>
            </form>
        </div>
        </div>
    );
}

export default CreateMovie;