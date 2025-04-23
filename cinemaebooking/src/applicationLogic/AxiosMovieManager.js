import axios from 'axios';

export async function GetMovieList() {
    try {
        const response = await axios.get('http://localhost:5000/movies');
        return response.data;
    } catch (error) {
        console.error("Error getting movies: ", error);
        return []; 
    }
}

export async function CreateMovie(movie) {
    try {
        const response = await axios.post('http://localhost:5000/movies', movie);
        return response.data; 
    } catch (error) {
        console.error("Error creating movie: ", error);
        return -1; 
    }
}


export async function GetSingleMovieByTitle(movieTitle) {
    try {
        const response = await axios.get(`http://localhost:5000/movies/${movieTitle}`);
        return response.data; 
    } catch (error) {
        console.error("Error getting movie:", error);
        return -1; 
    }
}

export default { GetMovieList, CreateMovie, GetSingleMovieByTitle};