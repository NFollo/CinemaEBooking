import {axiosCreateAddress, axiosGetAddress, axiosUpdateAddress} from "./AxiosAddressManager";

/**
 * Simulated interface for managing address information.
 */

/**
 * Creates a new address in the database.
 * Returns the document's _id upon success, or -1 upon failure.
 */
export async function createAddress(type, street, city, state, country, zipCode) {
    return axiosCreateAddress(type, street, city, state, country, zipCode);
} // createAddress

/**
 * Gets an existing address by its id.
 * Returns a json object representing the address data upon success.
 */
export async function getAddress(id) {
    return axiosGetAddress(id);
} // getAddress

/**
 * Updates the existing address specified by id.
 * Returns a json object representing the update address data upon success.
 */
export async function updateAddress(id, type, street, city, state, country, zipCode) {
    return axiosUpdateAddress(id, type, street, city, state, country, zipCode);
} // updateAddress