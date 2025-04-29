import './ComingSoon.css';
import { useNavigate } from "react-router-dom"; 
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';
import MovieMgr from "../../applicationLogic/AxiosMovieManager";

function ComingSoon() {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [sixMovies, setSixMovies] = useState([]);

  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await MovieMgr.GetMovieList(); 
  
        const filteredMovies = allMovies
          .filter(movie => !movie.currently_running) // Filter movies that are "coming soon"
          .map(movie => ({
            title: movie.title,
            trailer_picture_url: movie.trailer_picture_url,
            trailer_video_url: movie.trailer_video_url,
            currently_running: movie.currently_running,
            rating: movie.mpaa_us_film_rating_code, 
          }));
  
        setMovies(filteredMovies); 
        //setLoading(false); // Set loading state to false
        function delayData() {
          setHasData(true);
        }
        setTimeout(delayData, 500);
      } catch (error) {
        return; // no need to do anyhting, the error is already in movieMgr
        //(false);
      }
    };
  
    fetchMovies(); // Call fetchMovies when component mounts
  }, []); // Empty dependency array ensures this only runs once on mount

  useEffect(() => { 
    // Group into sets of 3 for the carousel
    if (movies.length > 0) {
      const grouped = [];
      for (let i = 0; i < movies.length; i += 3) {
        grouped.push(movies.slice(i, i + 3));
      }
      setSixMovies(grouped);
    }
  }, [movies]);

  const handleClick = (movie) => {
    navigate(`/movieinfo?movie=${movie.title}`, {
      state: movie
    });
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
      {!hasData ? <div className="no-movies">Loading Data...</div> : (sixMovies.length > 0 ? (
        <Carousel className="ComingSoonCarousel">
          {sixMovies.map((movieGroup, index) => (
            <Carousel.Item key={`carousel-item-${index}`}>
              <div className="ComingSoonGrid">
                {movieGroup.map((movieData, movieIndex) => (        
                  <div className="SoonMovie" key={`movie-${index}-${movieIndex}`}>
                    <div className="SoonMovieImg" onClick={() => handleClick(movieData)}> 
                      <img src={movieData.trailer_picture_url} alt={movieData.title} />
                    </div>
                    <div className="SoonMovieRating">{movieData.rating}</div>
                    <div className="SoonMovieTitle">{movieData.title}</div>
                    <div className="SoonMovieDesc">{movieData.description}</div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="no-movies">No movies comming soon</div>
      ))}
      <button className="ComingSoonBrowse" onClick={handleBrowseClick}>
        Browse All Movies
      </button>   
    </div>
  );
}

export default ComingSoon;