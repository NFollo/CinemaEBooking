import {axiosCreateUser, axiosGetUserByEmail, axiosGetSubscribedUsers,
    axiosUpdateUserAddress, axiosUpdateUserVerificationStatus, axiosUpdateUserPassword,
    axiosUpdateUserDetails, axiosGetUserBookings} from "./AxiosUserManager";

/**
 * Simulated interface for managing user information.
 */


/**
 * Creates a new user in the database. 
 * Returns the document's _id upon success, or the error status code upon failure.
 * Throws any data access errors to be handled by caller.
 */
export async function createUser(newUser) {
    return axiosCreateUser(newUser);
} // createUser


/**
 * Gets user with specified email address.
 * Returns a json object representing the user data upon success, or -1 upon failure.
 */
export async function getUserByEmail(email) {
    return axiosGetUserByEmail(email);
} // getUsers


/**
 * Gets all users who are subscribed for promotions.
 * Returns a list of json objects representing user data upon success, or -1 upon failure.
 */
export async function getSubscribedUsers() {
    return axiosGetSubscribedUsers();
} // getSubscribedUsers


/**
 * Updates the address reference field of the user with the specified email.
 * Returns a json object representing the user data upon success, or -1 upon failure.
 */
export async function updateUserAddress(email, addressId) {
    return axiosUpdateUserAddress(email, addressId);
} // updateUserAddress


/**
 * Updates the verification status of the user with the specified email.
 * Returns a json object representing the user data upon success, or -1 upon failure.
 */
export async function updateUserVerificationStatus(email, status) {
    return axiosUpdateUserVerificationStatus(email, status);
} // updateUserVerificationStatus


/**
 * Updates the password of the user with the specified email.
 * Returns a json object representing the user data upon success, or -1 upon failure.
 */
export async function updateUserPassword(email, password) {
    return axiosUpdateUserPassword(email, password);
} // updateUserPassword


/**
 * Updates the first name, last name, phone number, and/or promotional opt-in status
 *   of the user with the specified email.
 * Returns a json object representing the user data upon success, or -1 upon failure.
 */
export async function updateUserDetails(email, userData) {
    return axiosUpdateUserDetails(email, userData);
} // updateUserDetails


/**
 * Gets bookings of user with specified email address.
 * Returns a json object representing the booking data upon success, or -1 upon failure.
 */
export async function getUserBookings(email) {
    return axiosGetUserBookings(email);
} // getUserBookings