import "./SearchPage.css";
import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Link, useNavigate } from 'react-router-dom';

function SearchPage({query}) {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]); // State for movie list

    var movieContainer = document.getElementById("movies");

    const searchMovies = () => {

        movieContainer = document.getElementById("movies");
        while (movieContainer.firstChild) {
            movieContainer.removeChild(movieContainer.firstChild);
        }

        function removeWhitespace (mystring) {
            var newstring = "";
            for (let i = 0; i < mystring.length; i++) {
                if (mystring.charAt(i) !== " ") {
                    newstring = newstring + mystring.charAt(i);
                }
            }
            return newstring;
        }

        function doesMatch (originalQuery, originalTitle) {

            var title = originalTitle.toLowerCase();
            var myquery = originalQuery.toLowerCase();

            title = removeWhitespace(title);
            myquery = removeWhitespace(myquery);

            for (let i = 0; i < Math.min(title.length, myquery.length); i++) {
                if (myquery.charAt(i) !== title.charAt(i)) {
                    return false;
                }
            }
            return true; 

        };

        movies.forEach((movie) => {
            
            if (query != null && (query === "" || doesMatch(query, movie.title)) ) {
                const movieCard = document.createElement("div");
                movieCard.className = "SearchPageMovieCard";


                // says to add movie trailer in search??? - Angel
                // // Movie Trailer (video element)
                // const trailer = document.createElement("video");
                // trailer.src = movie.trailer_video_url;
                // trailer.poster = movie.trailer_picture_url;
                // trailer.controls = true;
                // trailer.className = "movie-trailer";

                const movieImg = document.createElement("img");
                movieImg.src = movie.trailer_picture_url;
                
                const movieTitle = document.createElement("div");
                movieTitle.className = "SearchPageMovieTitle";
                movieTitle.textContent = movie.title;

                const movieRating = document.createElement("div");
                movieTitle.className = "SearchPageSubtext1";
                movieRating.textContent = movie.mpaa_us_film_rating_code;
                movieRating.style.fontWeight = 'bold';

                console.log("SEARCH: " + movie)
                // const movieDesc = document.createElement("div");
                // movieDesc.className = "SearchPageMovieDesc";
                // movieDesc.textContent = movie.desc;
                
                const viewMovieButton = document.createElement("button");
                viewMovieButton.className = 'button';
                viewMovieButton.textContent = "View Movie";
                viewMovieButton.addEventListener("click", () => {
                    navigate(`/movieinfo?movie=${movie.title}`, 
                        {state: movie})
                })
                
                movieCard.append(movieImg);
                movieCard.append(movieRating)
                movieCard.append(movieTitle);
                //movieCard.append(movieDesc);
                movieCard.append(viewMovieButton);
                movieContainer.append(movieCard);
            }

        });

    };

useEffect(() => {
    fetch("http://localhost:5000/movies") // no need to do /homepageInfo, just pass the whole movie object -Angel
      .then((res) => res.json()) 
      .then((data) => {
        setMovies(data);  // set all movie
    })
      .catch((error) => console.error("Error fetching movies:", error));   
}, []);

      useEffect(() => {
        searchMovies();
      }, [movies, query]);

    return (
      <div className="SearchPage">        
        <div className="SearchPageHeader">
            {query === "" ? "Browse All Movies" : "Search results for \"" + query + "\""}            
        </div>
        <div id="movies" className="SearchPageMovies">
                      
        </div>
      </div>
    );

}
  
export default SearchPage;