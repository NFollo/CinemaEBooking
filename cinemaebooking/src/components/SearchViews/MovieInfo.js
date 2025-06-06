import "./MovieInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import MovieMgr from "../../applicationLogic/AxiosMovieManager";

function MovieInfo({setHasData, setFailedLoad, showProxy}) {
    // navigation for BookTickets button
    const navigate = useNavigate();
    const location = useLocation(); 

    // const [hasData, setHasData] = useState(false);
    // const [failedLoad, setFailedLoad] = useState(false);
    
    // no movie 

    // if refresh page, saves the information
    const storedMovieInfo = localStorage.getItem("movieInfo");
    const movieInfo = location.state || (storedMovieInfo ? JSON.parse(storedMovieInfo) : {
        title: "Unknown Movie",
        description: "No description available",
        trailer_picture_url: "https://via.placeholder.com/150",
        trailer_video_url: ""
    });

    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));
    
    // eventually retrieve from DB
    //let title = 'Sonic (R)';
    const [status, setStatus] = useState('Currently Running');
    const [categories, setCategories] = useState([""]);
    //let posterLink = "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg";
    const [description, setDescription] = useState("");
    const [directors, setDirectors] = useState([""]);
    const [castMembers, setCastMembers] = useState([""]);
    const [producers, setProducers] = useState([""]);
    const [rating, setRating] = useState("");
    let reviews = [["Jennifer", "7", "Good"], ["Bob", "2", "I hate Sanic"]];
    
    // store movie data object to pass in to booking
    const [movieData, setMovieData] = useState(movieInfo);


    const handleBookTickets = () => {
        if (authorization === "admin" || authorization === "customer") {
            console.log(movieData._id?.$oid);
            navigate(`/buytickets?movie=${movieData.title}`, { // unique url for each movie
                state: movieData // pass whole movie object in
            });  
        } else {
            alert("You must be logged in to book tickets");
        } 
    };

    useEffect(() => {
        const getMovieData = async () => {
            // proxy start
            const data = await MovieMgr.GetSingleMovieByTitle(movieInfo.title); 
            if (data === -1) {
              console.error("Failed to load movie data.");

              // proxy case for failed load
              setFailedLoad(true);
              setHasData(true);

              return;
            }
        
            console.log(data);
            setMovieData(data);
        
            if (!data.currently_running) {
              setStatus("Coming Soon");
            }
        
            setCategories(data.categories);
            setDescription(data.synopsis);
            setCastMembers(data.cast);
            setDirectors(data.directors);
            setProducers(data.producers);
            setRating(data.mpaa_us_film_rating_code);
        
            // update id
            setMovieData(prev => ({
              ...prev,
              _id: data._id
            }));

            // proxy
            setHasData(true);

          };
        
          getMovieData();
      }, []);
      

    useEffect(() => {
        if (location.state) {
            localStorage.setItem("movieInfo", JSON.stringify(location.state));
        }
    }, [location.state]);

    if (showProxy) {
    return (
        <div>
        
        <div className='pageContainer'>
            <p className='title'>{movieInfo.title}</p>

            <p>{status}</p>

            <div className='categoriesContainer'>
                <span className="MovieInfoPageRating">{rating}</span> {categories.map((category) => <div>{category}</div>)}
            </div>

            <img className='poster' src={movieInfo.trailer_picture_url} alt={movieInfo.title} />

            <iframe className='trailer' src={movieInfo.trailer_video_url} title="sonic3" >
            </iframe>

            <div className='description'>{description}</div>

            <div className='directorsContainer'>
                <p className='label'>Directors:</p>
                {directors.map((director) => <div>{director}</div>)}
            </div>

            <div className='castMembersContainer'>
                <p className='label'>Cast:</p>
                {castMembers.map((castMember) => <div>{castMember}</div>)}
            </div>

            <div className='producersContainer'>
                <p className='label'>Producers:</p>
                {producers.map((producer) => <div>{producer}</div>)}
            </div>

            <button className='button' onClick={handleBookTickets}>
                Book Tickets
            </button>
            <br></br>

            
        </div>
        </div>
    );
    } else {
        return <div></div>;
    }
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

export default MovieInfo;
