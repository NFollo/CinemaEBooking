import './ComingSoon.css';
import { useNavigate } from "react-router-dom"; 
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';

function ComingSoon() {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [sixMovies, setSixMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/movies/homepageInfo")
      .then((res) => res.json())
      .then((data) => {
        // Filter movies where currently_running is false (coming soon)
        const filteredMovies = data.filter(movie => !movie.currently_running)
          .map(movie => ({
            title: movie.title,
            trailer_picture_url: movie.trailer_picture_url,
            trailer_video_url: movie.trailer_video_url,
            currently_running: movie.currentlyRunning,
          }));
        setMovies(filteredMovies);
      })
      .catch((error) => console.error("Error fetching movies:", error));   
  }, []); 

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
      {sixMovies.length > 0 ? (
        <Carousel className="ComingSoonCarousel">
          {sixMovies.map((movieGroup, index) => (
            <Carousel.Item key={`carousel-item-${index}`}>
              <div className="ComingSoonGrid">
                {movieGroup.map((movieData, movieIndex) => (        
                  <div className="SoonMovie" key={`movie-${index}-${movieIndex}`}>
                    <div className="SoonMovieImg" onClick={() => handleClick(movieData)}> 
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
      ) : (
        <div className="no-movies">No upcoming movies found</div>
      )}
      <button className="ComingSoonBrowse" onClick={handleBrowseClick}>
        Browse All Movies
      </button>   
    </div>
  );
}

export default ComingSoon;