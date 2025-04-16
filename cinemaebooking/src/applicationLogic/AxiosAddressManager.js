import axios from 'axios';

/**
 * Simulated implementation of AddressManager "interface".
 */


export async function axiosCreateAddress(type, street, city, state, country, zipCode) {
    const newAddress = {
        type: type,
        street: street,
        city: city,
        state: state,
        country: country,
        zip_code: zipCode
    }

    let addressId = null;
    const response = await axios.post("http://localhost:5000/addresses", newAddress)
        .catch((error) => {
            console.error("Error creating address: ", error);
            addressId = -1;
        });
    
    if (addressId !== -1)
        addressId = response.data.address_id;

    return addressId;
} // axiosCreateAddress


export async function axiosGetAddress(id) {
    const address = await axios.get(`http://localhost:5000/addresses/${id}`)
        .catch((error) => {
            console.error("Error retrieving address: ", error);
        });
    return address.data;
} // axiosGetAddress


export async function axiosUpdateAddress(id, type, street, city, state, country, zipCode) {
    const newAddress = {
        type: type,
        street: street,
        city: city,
        state: state,
        country: country,
        zip_code: zipCode
    }

    const address = await axios.patch(`http://localhost:5000/addresses/${id}`, newAddress)
        .catch((error) => {
            console.error("Error updating address: ", error);
        });
    return address.data;
} // axiosUpdateAddress