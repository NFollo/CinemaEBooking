import "./MovieInfoPage.css";
import { useNavigate, useLocation } from "react-router-dom"; 

function MovieInfoPage({movie}) {
    // navigation for BookTickets button
    const navigate = useNavigate();
    const location = useLocation(); 

    // no movie 
    const movieInfo = location.state || {
        title: "Unknown Movie",
        description: "No description available",
        trailer_picture_url: "https://via.placeholder.com/150",
    };
    
    // eventually retrieve from DB
    let title = 'Sonic (R)';
    let status = 'Currently Running';
    let categories = ['Action', 'Fantasy', 'Comedy'];
    //let posterLink = "https://i.etsystatic.com/12729518/r/il/e19c5f/1989024537/il_1080xN.1989024537_hueq.jpg";
    let description = "Gotta go fast hehehehehhe";
    let directors = ["Jeff Fowler"];
    let castMembers = ["Jim Carrey", "Ben Schwartz", "James Marsden", "Tika Sumpter"];
    let producers = ["Tobery Ascher", "Nan Morales", "Tim Miller"];
    let reviews = [["Jennifer", "7", "Good"], ["Bob", "2", "I hate Sanic"]];

    const handleBookTickets = () => {
        navigate("/buytickets", {
            state: movieInfo
        });
    };

    return (
        <div className='pageContainer'>
            <p className='title'>{movieInfo.title}</p>

            <p>{status}</p>

            <div className='categoriesContainer'>
                {categories.map((category) => <div>{category}</div>)}
            </div>

            <img className='poster' src={movieInfo.trailer_picture_url} alt={title} />

            <p>{description}</p>

            <div className='directorsContainer'>
                <p className='label'>Directors:</p>
                {directors.map((director) => <div>{director}</div>)}
            </div>

            <div className='castMembersContainer'>
                <p className='label'>Cast:</p>
                {castMembers.map((castMember) => <div>{castMember}</div>)}
            </div>

            <div className='producersContainer'>
                <p className='label'>Producers:</p>
                {producers.map((producer) => <div>{producer}</div>)}
            </div>

            <button className='button' onClick={handleBookTickets}>
                Book Tickets
            </button>

            <div className='reviewsContainer'>
                <p className='label'>Reviews:</p>
                {reviews.map((review) => (
                    <div className='review'>
                        <div>
                            {review[0] + ": " + review[1] + "/10"}
                        </div> 
                        <div>
                            {review[2]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieInfoPage;
