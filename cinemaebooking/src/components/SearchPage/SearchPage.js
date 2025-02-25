import "./SearchPage.css";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { Link, useNavigate } from 'react-router-dom';

function SearchPage({query}) {
    const navigate = useNavigate();

    var sampleMovies = [
        {
            title: "Sonic",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc: "Sonic is fast"            
        },
        {
            title: "Detective Pikachu",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc:  "Ryan Reynolds is an electric mouse"
        },
        {
            title: "Sonic 3",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc:  "Sonic is three times as fast"
        },
        {
            title: "Sonic 2",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc:  "Sonic is not quite as fast as in Sonic 3"
        },
        {
            title: "Pokemon the First Movie",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc:  "The first movie (for pokemon)"
        },
        {
            title: "Sonic 4",
            img: "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg",
            desc:  "I'm running out of movies"
        }
    ]

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

        sampleMovies.forEach((movie) => {
            
            if (query != null && (query === "" || doesMatch(query, movie.title)) ) {
                const movieCard = document.createElement("div");
                movieCard.className = "SearchPageMovieCard";

                const movieImg = document.createElement("img");
                movieImg.src = movie.img;

                const movieTitle = document.createElement("div");
                movieTitle.className = "SearchPageMovieTitle";
                movieTitle.textContent = movie.title;

                const movieDesc = document.createElement("div");
                movieDesc.className = "SearchPageMovieDesc";
                movieDesc.textContent = movie.desc;

                const viewMovieButton = document.createElement("button");
                viewMovieButton.className = 'button';
                viewMovieButton.textContent = "View Movie";
                viewMovieButton.addEventListener("click", () => {
                    navigate("/movieinfo")
                })

                movieCard.append(movieImg);
                movieCard.append(movieTitle);
                movieCard.append(movieDesc);
                movieCard.append(viewMovieButton);
                movieContainer.append(movieCard);
            }

        });

    };

    useEffect(() => { // this loads the search once on page startup
        searchMovies();
    });

    return (
      <div className="SearchPage">
        <div className="SearchPageHeader">
            Search results for "{query}"
        </div>
        <div id="movies" className="SearchPageMovies">
                      
        </div>
      </div>
    );

}
  
export default SearchPage;