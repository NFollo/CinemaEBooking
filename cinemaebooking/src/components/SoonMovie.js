import { useState } from "react";
import "./SoonMovie.css";

function SoonMovie() {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div className="SoonMovie">
      <div 
        className={`SoonMovieImg ${isClicked ? "clicked" : ""}`} 
        onClick={() => setIsClicked(!isClicked)} 
      >
        <img 
          src="https://connect.gtcmovies.com/CDN/Image/Entity/FilmPosterGraphic/HO00004607" 
          alt="poster"
        />
        {isClicked && (
          <button className="overlayText">Buy Tickets</button>
          )}
      </div>
      <div className="SoonMovieTitle">
        Dog Man
      </div>
    </div>
  );
}

export default SoonMovie;