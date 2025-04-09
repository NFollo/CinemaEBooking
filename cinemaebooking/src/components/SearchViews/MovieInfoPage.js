import "./MovieInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function MovieInfoPage({movie}) {
    // navigation for BookTickets button
    const navigate = useNavigate();
    const location = useLocation(); 

    // no movie 
    const [movieInfo, setMovieInfo] = useState(location.state || {
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

    const handleBookTickets = () => {
        if (authorization === "admin" || authorization === "customer") {
            navigate(`/buytickets?movie=${movieInfo.title}`, { // unique url for each movie
                state: movieInfo
            });  
        } else {
            alert("You must be logged in to book tickets");
        } 
    };

    useEffect(() => {
        const getMovieData = async () => {
          try {
            const response = await axios.get('http://localhost:5000/movies/' + movieInfo.title);
            console.log(response.data);
      
            if (!response.data.currently_running) {
              setStatus("Not Currently Running");
            }
            setCategories(response.data.categories);
            setDescription(response.data.synopsis);
            setCastMembers(response.data.cast);
            setDirectors(response.data.directors);
            setProducers(response.data.producers);
            setRating(response.data.mpaa_us_film_rating_code);
      
            // update id
            setMovieInfo(prev => ({
              ...prev,
              _id: response.data._id
            }));
          } catch (e) {
            console.log("Error fetching movie data: " + e);
          }
        };
      
        getMovieData();
      }, []);
      

    return (
        <div className='pageContainer'>
            <p className='title'>{movieInfo.title}</p>

            <p>{status}</p>

            <div className='categoriesContainer'>
                <span className="MovieInfoPageRating">{rating}</span> {categories.map((category) => <div>{category}</div>)}
            </div>

            <img className='poster' src={movieInfo.trailer_picture_url} alt={movieInfo.title} />

            <iframe className='trailer' src={movieInfo.trailer_video_url} title="sonic3" >
            </iframe>

            <p>{description}</p>

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
        </div>
    );
}

export default MovieInfoPage;
