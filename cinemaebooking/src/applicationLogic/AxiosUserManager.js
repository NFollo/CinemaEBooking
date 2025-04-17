import axios from "axios";

/**
 * Simulated implementation of UserManager "interface".
 */


export async function axiosCreateUser(newUser) {
    const response = await axios.post("http://localhost:5000/users", newUser);
        
    const userId = response.data.user_id;  
    return userId;
} // axiosCreateUser


export async function axiosGetUserByEmail(email) {
    let user = null;
    const response = await axios.get(`http://localhost:5000/users/email/${email}`)
        .catch((error) => {
            console.error("Error retrieving user: ", error);
            user = -1;
        });

    if (user !== -1)
        user = response.data;

    return user;
} // axiosGetUserByEmail


export async function axiosGetSubscribedUsers() {
    let users = null;
    const response = await axios.get("http://localhost:5000/users/subscribed")
        .catch((err) => {
            console.error("Error fetching subscribed users:", err);
            users = -1;
        }
    );

    if (users !== -1)
        users = response.data;
      
    return users;
} // axiosGetSubscribedUsers


export async function axiosUpdateUserAddress(email, addressId) {
    let user = null;
    const response = await axios.patch(`http://localhost:5000/users/email/${email}`, 
        {address: addressId}
    )
        .catch((error) => {
            console.error("Error updating user: ", error);
            user = -1;
        }
    );

    if (user !== -1)
        user = response.data;

    return user;
} // axiosUpdateUserAddress


export async function axiosUpdateUserVerificationStatus(email, status) {
    let user = null;

    const response = await axios.patch(`http://localhost:5000/users/email/${email}`, 
        {verified_user: status}
    )
        .catch((error) => {
            console.error("Error updating user: ", error);
            user = -1;
        }
    );

    if (user !== -1)
        user = response.data;

    return user;
} // axiosUpdateUserVerificationStatus


export async function axiosUpdateUserPassword(email, password) {
    let user = null;

    const response = await axios.patch(`http://localhost:5000/users/email/${email}`,
        {password: password}
    )
        .catch((error) => {
            console.error("Error updating user: ", error);
            user = -1;
        }
    );

    if (user !== -1)
        user = response.data;

    return user;
} // axiosUpdatePassword


export async function axiosUpdateUserDetails(email, userData) {
    let user = null;

    const response = await axios.patch(`http://localhost:5000/users/email/${email}`, 
        {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
            receive_promotions: userData.receivePromotions,
        }
    )
        .catch((error) => {
            console.error("Error updating user: ", error);
            user = -1;
        }
    );

    if (user !== -1)
        user = response.data;

    return user;
} // axiosUpdateUserDetails