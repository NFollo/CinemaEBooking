import {createAddress} from './AddressManager';
import {getUserByEmail} from './UserManager';
import axios from "axios";
import Cookies from "js-cookie";

export async function axiosCreatePaymentCard(cardDetails, addressDetails) {
    let cardId = null;
    const email = Cookies.get("email");
    const customerId = await getUserByEmail(email).then((userJSON) => userJSON._id.$oid);

    const addressId = await createAddress("billing", addressDetails.street, addressDetails.city, 
        addressDetails.state, addressDetails.country, addressDetails.zipCode);
    if (addressId === -1)
        return -1;

    const cardPayload = {
        card_type: cardDetails.cardType,
        name_on_card: cardDetails.nameOnCard,
        card_number: cardDetails.cardNumber,
        month: cardDetails.month,
        year: cardDetails.year,
        cvc: cardDetails.cvc,
        billing_address: addressId,
        customer: customerId,
    };

    const response = await axios.post("http://localhost:5000/createPaymentCard", cardPayload)
        .catch((error) => {
            console.error("Error creating payment card: ", error);
            cardId = -1;
        });

    if (cardId !== -1)
        cardId = response.data;
    
    return cardId;


} // axiosCreatePaymentCard