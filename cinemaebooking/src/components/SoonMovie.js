import { useNavigate } from "react-router-dom"; 
import "./SoonMovie.css";

function SoonMovie() {
  const navigate = useNavigate(); 

  const movieData = {
    title: "Dog Man",
    description: "Description of move here",
    image: "https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607",
  };

  const handleClick = () => {
    navigate("/buytickets", { state: movieData });
  };

  return (
    <div className="SoonMovie">
      <div className="SoonMovieImg" onClick={handleClick}> 
        <img src={movieData.image} alt={movieData.title} />
      </div>
      <div className="SoonMovieTitle">{movieData.title}</div>
      <div className="SoonMovieDesc">{movieData.description}</div>
    </div>
  );
}

export default SoonMovie;