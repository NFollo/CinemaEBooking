import "./Manage.css";
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from 'react';

function ManageMovies({query}) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);

    // navigated to the create movie page
    const navCreateMovie = () => {
        navigate("/admincreatemovie"); 
    }

    var movieContainer = document.getElementById("movies");
    const searchMovies = () => {
        // clear current movie container
        movieContainer = document.getElementById("movies");
        while (movieContainer.firstChild)
            movieContainer.removeChild(movieContainer.firstChild);
      
        // removes whitespace from string when called
        function removeWhitespace (mystring) {
            var newstring = "";
            for (let i = 0; i < mystring.length; i++) {
                if (mystring.charAt(i) !== " ")
                    newstring = newstring + mystring.charAt(i);
            }
            return newstring;
        } // remove whitespace
  
        // returns true if originalQuery matches originalTitle without whitespace, 
        // ignoring capitalization
        function doesMatch (originalQuery, originalTitle) {
            var title = originalTitle.toLowerCase();
            var myquery = originalQuery.toLowerCase();
  
            title = removeWhitespace(title);
            myquery = removeWhitespace(myquery);
  
            for (let i = 0; i < Math.min(title.length, myquery.length); i++) {
                if (myquery.charAt(i) !== title.charAt(i))
                    return false;
            }
            return true; 
        } // doesMatch
  
        movies.forEach((movie) => {
            if (query != null && (query === "" || doesMatch(query, movie.title)) ) {
                const movieCard = document.createElement("div");
                movieCard.className = "ManageUnit";

                const movieImg = document.createElement("img");
                movieImg.src = movie.trailer_picture_url;
                movieImg.className = "ManageUnitImage"

                const movieTitle = document.createElement("div");
                movieTitle.className = "ManageUnitName";
                movieTitle.textContent = movie.title;

                const bottomButtons = document.createElement("div");
                bottomButtons.className = "ManageUnitOptions";

                const editButton = document.createElement("button");
                editButton.className = "ManageEditButton";
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => {navigate("/admineditmovie")});

                const deleteButton = document.createElement("button");
                deleteButton.className = "ManageEditButton";
                deleteButton.textContent = "Delete";

                const scheduleButton = document.createElement("button");
                scheduleButton.className = "ManageEditButton";
                scheduleButton.textContent = "Schedule";
                scheduleButton.addEventListener("click", () => {
                    navigate(`/schedule?movie=${movie.title}`, 
                        {state: movie})
                });

                bottomButtons.append(editButton);
                bottomButtons.append(deleteButton);
                bottomButtons.append(scheduleButton);

                movieCard.append(movieImg);
                movieCard.append(movieTitle);
                movieCard.append(bottomButtons);

                movieContainer.append(movieCard);
            }
        });
    } // search movies
  
    useEffect(() => {
      fetch("http://localhost:5000/movies/homepageInfo") // Fetch from backend API
          .then((res) => res.json()) // Parse JSON response
          .then((data) =>{
              setMovies(
                  data.map((movie) => ({
                      title: movie.title,
                      trailer_picture_url: movie.trailer_picture_url,
                      trailer_video_url: movie.trailer_video_url,
                      currently_running: movie.currentlyRunning, // Keep same as API
                  }))
              );
          console.log(data);
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
            <div className="ManageMoviesAddButton">
                <button className="ManageEditButton" onClick={navCreateMovie}>Add Movie</button>  
            </div>
            <div id="movies" className="MoviesContainer"></div>
        </div>
      );
}

export default ManageMovies;