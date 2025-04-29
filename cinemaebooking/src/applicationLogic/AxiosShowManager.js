import axios from "axios";

export async function axiosGetShowById(id) {
    let show;

    const response = await axios.get(`http://localhost:5000/shows/id/${id}`)
        .catch((error) => {
            console.error("Error fetching show data: ", error);
            show = -1;
        });

    if (show !== -1)
        show = response.data;
    
    return show;
} // axiosGetShowById