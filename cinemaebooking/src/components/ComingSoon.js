import './ComingSoon.css';
import { useNavigate } from "react-router-dom"; 
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';

function ComingSoon() {

  const navigate = useNavigate(); 
  const [movies, setMovies] = useState([]);

  const [sixMovies, setSixMovies] = useState([]);

  useEffect(() => {
         fetch("http://localhost:5000/movies/homepageInfo") // Fetch from backend API
           .then((res) => res.json()) // Parse JSON response
           .then((data) =>{
             setMovies(
               data.map((movie) => ({
                 title: movie.title,
                 trailer_picture_url: movie.trailer_picture_url,
                 currently_running: movie.currentlyRunning, // Keep same as API
               }))
             );
             console.log(data);
         }
           )
           .catch((error) => console.error("Error fetching movies:", error));   
 
  }, []); 

  useEffect(() => { 
    if(movies.length >= 6) {
      setSixMovies([
        [movies[2], movies[3], movies[4]]
      ]);
    }
  }, [movies]);

  /*const movieList = [
    {
      title: "Dog Man 1",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 2",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 3",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 4",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 5",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 6",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 7",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 8",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 9 ",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 10",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 11",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    },
    {
      title: "Dog Man 12",
      description: "Description of move here",
      image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
    }
  ];*/

  const handleClick = (myindex) => {
    navigate("/movieinfo", { state: movies[myindex] });
  };
  
  const handleBrowseClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate("/search");
  };

  return (
    <div className="ComingSoon">
      <div className="ComingSoonText">
        Coming Soon
      </div>
      <Carousel className="ComingSoonCarousel">
        {sixMovies.length > 0 && sixMovies.map((smallMovieList) => (
          <Carousel.Item>
            <div className="ComingSoonGrid">
              {smallMovieList.map((movieData) => (        
                <div className="SoonMovie">
                  <div className="SoonMovieImg" onClick={() => handleClick(movies.indexOf(movieData))}> 
                    <img src={movieData.trailer_picture_url} alt={movieData.title} />
                  </div>
                  <div className="SoonMovieTitle">{movieData.title}</div>
                  <div className="SoonMovieDesc">{movieData.description}</div>
                </div>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>   
      <button className="ComingSoonBrowse" onClick={() => handleBrowseClick()}>Browse All Movies</button>   
    </div>
  );
}

export default ComingSoon;
