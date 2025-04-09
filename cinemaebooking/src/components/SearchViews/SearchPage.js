import "./SearchPage.css";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage({ query }) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [filterBy, setFilterBy] = useState('title'); // 'title' or 'category'
    const [isMovieMatch, setIsMovieMatch] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetch("http://localhost:5000/movies")
            .then((res) => res.json())
            .then((data) => {
                setMovies(data);
                // Extract all unique categories
                const categories = new Set();
                data.forEach(movie => {
                    movie.categories?.forEach(cat => categories.add(cat));
                });
                setAllCategories(Array.from(categories).sort());
            })
            .catch((error) => console.error("Error fetching movies:", error));
    }, []);

    const searchMovies = () => {
        const movieContainer = document.getElementById("movies");
        movieContainer.innerHTML = ''; // Clear previous results

        const filteredMovies = movies.filter(movie => {
            // Always apply title search if query exists
            const titleMatch = !query || movie.title.toLowerCase().includes(query.toLowerCase());
            
            // Apply category filter only when in category mode and category is selected
            const categoryMatch = filterBy !== 'category' || !selectedCategory || movie.categories?.includes(selectedCategory);
            
            return titleMatch && categoryMatch;
        });

        setIsMovieMatch(filteredMovies.length > 0);

        filteredMovies.forEach((movie) => {
            const movieCard = document.createElement("div");
            movieCard.className = "SearchPageMovieCard";

            const movieImg = document.createElement("img");
            movieImg.src = movie.trailer_picture_url;
            
            const movieTitle = document.createElement("div");
            movieTitle.className = "SearchPageMovieTitle";
            movieTitle.textContent = movie.title;

            const movieRating = document.createElement("div");
            movieRating.className = "SearchPageSubtext1";
            movieRating.textContent = movie.mpaa_us_film_rating_code;
            movieRating.style.fontWeight = 'bold';

            const movieCategories = document.createElement("div");
            movieCategories.className = "SearchPageSubtext2";
            movieCategories.textContent = movie.categories?.join(', ') || 'No categories';
            movieCategories.style.fontStyle = 'italic';

            const viewMovieButton = document.createElement("button");
            viewMovieButton.className = 'button';
            viewMovieButton.textContent = "View Movie";
            viewMovieButton.addEventListener("click", () => {
                navigate(`/movieinfo?movie=${movie.title}`, { state: movie });
            });
            
            movieCard.append(movieImg);
            movieCard.append(movieRating);
            movieCard.append(movieTitle);
            movieCard.append(movieCategories);
            movieCard.append(viewMovieButton);
            movieContainer.append(movieCard);
        });
    };

    useEffect(() => {
        searchMovies();
    }, [movies, query, filterBy, selectedCategory]);

    const toggleFilterBy = () => {
        setFilterBy(prev => prev === 'title' ? 'category' : 'title');
        // Don't reset category filter when switching modes
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div className="SearchPage">        
            <div className="SearchPageHeader">
                {query === "" && !selectedCategory ? "Browse All Movies" : 
                 filterBy === 'title' ? `Search results for "${query}"` : 
                 selectedCategory ? `Movies in category: ${selectedCategory}` : "Select a category"}
                
                <div className="filter-controls">
                    <button onClick={toggleFilterBy} className="toggle-button">
                        Filter by: {filterBy === 'title' ? 'Category' : 'Title'}
                    </button>
                    
                    {filterBy === 'category' && (
                        <select 
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="category-select"
                        >
                            <option value="">All Categories</option>
                            {allCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
            <div id="movies" className="SearchPageMovies"></div>
            {!isMovieMatch && (query !== "" || selectedCategory !== "") && (
                <p className="centered">No movies match the search criteria!</p>
            )}
        </div>
    );
}

export default SearchPage;