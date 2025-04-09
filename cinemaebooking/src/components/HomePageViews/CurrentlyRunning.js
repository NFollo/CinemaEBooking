import './CurrentlyRunning.css';
import { useNavigate } from "react-router-dom"; 
import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect } from 'react';

function CurrentlyRunning() {
  const navigate = useNavigate(); 
  const [movies, setMovies] = useState([]);
  const [carouselGroups, setCarouselGroups] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/movies/homepageInfo")
      .then((res) => res.json())
      .then((data) => {
        // Filter movies where currently_running is true
        const currentlyRunningMovies = data.filter(movie => movie.currently_running)
          .map(movie => ({
            title: movie.title,
            trailer_picture_url: movie.trailer_picture_url,
            trailer_video_url: movie.trailer_video_url,
            currently_running: movie.currentlyRunning,
          }));
        setMovies(currentlyRunningMovies);
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
      setCarouselGroups(grouped);
    }
  }, [movies]);

  const handleClick = (movie) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/movieinfo?movie=${movie.title}`, {
      state: movie
    });
  };
  
  const handleBrowseClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate("/search");
  };

  return (
    <div className="CurrentlyRunning">
      <div className="ComingSoonText">
        Currently Running
      </div>
      {carouselGroups.length > 0 ? (
        <Carousel className="ComingSoonCarousel">
          {carouselGroups.map((movieGroup, groupIndex) => (
            <Carousel.Item key={`carousel-item-${groupIndex}`}>
              <div className="ComingSoonGrid">
                {movieGroup.map((movieData, movieIndex) => (        
                  <div className="SoonMovie" key={`movie-${groupIndex}-${movieIndex}`}>
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
        <div className="no-movies">No movies currently running</div>
      )}
      <button className="ComingSoonBrowse" onClick={handleBrowseClick}>
        Browse All Movies
      </button>   
    </div>
  );
}

export default CurrentlyRunning;