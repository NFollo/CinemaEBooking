
export function updateTimeButtonStatus(id, numAtTime, numShowrooms) {
    const button = document.getElementById(id);
    if (numAtTime === numShowrooms)
        button.className = "Disabled";
    else if (button !== null)
        button.className = "ScheduleButton";
} // updateTimeButtonStatus


export function updateShowroomButtonStatus(id, showrooms, showroomNumber) {
    const button = document.getElementById(id);
    if (showrooms.includes(showroomNumber))
        button.className = "Disabled";
    else if (button !== null)
        button.className = "ScheduleButton";
} // updateShowroomButtonStatus


export async function getShowsByDate(targetDate) {
    let shows;
    await fetch(`http://localhost:5000/shows/${targetDate}`,
        {method: "GET", 
         headers: {"Content-Type": "application/json"}}
    )
    .then( (res) => res.json() )
    .then( (data) => shows = data)
    .catch((error) => console.error("Error fetching dates:", error));
    return shows;
} // getShowsByDate


export async function getShowroomByShow(show) {
    let showroom;
    await fetch(`http://localhost:5000/showrooms/${show.showroom}`,
        {method: "GET",
         headers: {"Content-Type": "application/json"}}
    )
    .then( (res) => res.json())
    .then( (data) => showroom = data)
    .catch((error) => console.error("Error fetching showrooms:", error));
    return showroom;
} // getShowroomByShow


async function getMovieByTitle(title) {
    let movieId;
    await fetch(`http://localhost:5000/movies/${title}`,
        {method: "GET",
         headers: {"Content-Type": "application/json"}}
    )
    .then( (res) => res.json() )
    .then( (data) => {movieId = data._id})
    return movieId;
} // getMovieByTitle


async function getShowroomByNumber(number) {
    let showroomId;
    await fetch(`http://localhost:5000/showrooms/number/${number}`,
        {method: "GET",
         headers: {"Content-Type": "application/json"}}
    )
    .then( (res) => res.json())
    .then( (data) => showroomId = data._id)
    return showroomId;
} // getShowroomByNumber


export async function handleFormSubmit(title, showroom, date, time) {
    let movieId;
    let showroomId;

    movieId = await getMovieByTitle(title);
    showroomId = await getShowroomByNumber(showroom);

    let newShowroom = {
        movie: movieId,
        showroom: showroomId,
        date: date,
        time: time,
        duration: 3
    } 

    await fetch("http://localhost:5000/shows",
        {method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(newShowroom),
        }
    )
}