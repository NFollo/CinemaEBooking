import "./CreateMovie.css";
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import axios from "axios";

function CreateMovie() {

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

    async function addMovie (movie) {
        //console.log(movie);
        const billingRes = await axios.post("http://localhost:5000/movies", movie);
        //const billingAddressId = billingRes.data.address_id;
        //console.log(billingAddressId);
        navigate("/managemovies");
        alert("Movie added successfully");
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        if (title === "" || synopsis === "" || rating === "" || poster === "" || trailer === "" || categories === "" || producers === "" || directors === "" || cast === "") {
            alert("Please fill out all of the data before submitting");
        } else {
            // create arrays from the string inputs
            const myCast = cast.split(",");
            const myDirectors = directors.split(",");
            const myProducers = producers.split(",");
            const myCategories = categories.split(",");

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
                currently_running : true,
            }

            //console.log(movie);
            addMovie(movie);
            
            
        }
    };

    return (
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
                        Movie Trailer (URL)
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
                <button className="CreateMovieButton" onClick={onFormSubmit}>Add Movie</button>
            </form>
        </div>
    );
}

export default CreateMovie;