import { useState } from "react";
import "./SoonMovie.css";
import BuyTicketsPopup from "./BuyTicketsPopup";

function SoonMovie() {
  const [isClicked, setIsClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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
          <button className="buyTicketsButton" onClick={() => setShowPopup(true)}>
          Buy Tickets
        </button>
          )}
      </div>
      <div className="SoonMovieTitle">
        Dog Man
      </div>

      {showPopup && <BuyTicketsPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}

export default SoonMovie;