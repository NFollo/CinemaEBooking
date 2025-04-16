import axios from 'axios';
import {createAddress} from './AddressManager'


/**
 * Returns true if the input with specified length is a valid decimal number.
 * Returns false otherwise.
 */
function isDecimalNumber(input, length) {
    for (let i = 0; i < length; i++) {
        if ( !(input[i] >= '0' && input[i] <= '9') )
            return false;
    }
    return true;
} // isDecimalNumber




/**
 * Returns true if required fields complete, passwords match, and phone number is valid.
 * Returns false otherwise.
 */
export function isValidRequiredForm(firstName, lastName, email, password, 
    confirmPassword, phoneNumber)
{
    // true if all required fields complete, false otherwise
    const isCompletedForm = (firstName !== '' && lastName !== '' && email !== ''
        && password !== '' && confirmPassword !== '' && phoneNumber !== '');

    // true if phone number of the form '###-###-####', false otherwise
    const isValidPhoneNumber = (phoneNumber.length === 12   // proper length 
        && isDecimalNumber(phoneNumber.slice(0,3), 3)       // first three digits is a number
        && phoneNumber[3] === "-"                           // 4th char is a hyphen
        && isDecimalNumber(phoneNumber.slice(4,7), 3)       // second three digits is a number
        && phoneNumber[7] === "-"                           // 8th char is a hyphen
        && isDecimalNumber(phoneNumber.slice(8,12), 4));    // last four digits is a number

    // ensure all required fields are complete
    if (!isCompletedForm) {
        alert("Please complete all required fields");
        return false;
    }
    // ensure passwords match
    else if (password !== confirmPassword) {
        alert("Passwords do not match");
        return false;
    }
    else if (password.length < 8 && confirmPassword.length < 8) {
        alert("Password must be equal or greater than 8 characters")
        return false;
    }
    // ensure phone number is valid
    else if (!isValidPhoneNumber) {
        alert("Invalid phone number format");
        return false;
    }
    // form is valid
    else
        return true;
} // isValidRequiredForm

/**
 * Returns true if all address fields are complete. 
 * Returns false otherwise.
 */
export function isCompleteAddress(streetAddress, city, state, country, zipCode) {
    return (streetAddress !== "" && city !== "" && state !== "" && country !== "" && zipCode !== "");
} // isCompleteAddress

/**
 * Returns true if all address fields are empty.
 * Returns false otherwise.
 */
function isEmptyAddress(streetAddress, city, state, country, zipCode) {
    return (streetAddress === "" && city === "" && state === "" && country === "" && zipCode === "");
} // isEmptyAddress

/**
 * Returns true if the address field is empty or is fully complete.
 * Returns false otherwise.
 */
export function isValidAddressForm(streetAddress, city, state, country, zipCode) {
    if (!isEmptyAddress(streetAddress, city, state, country, zipCode)
        && !isCompleteAddress(streetAddress, city, state, country, zipCode))
    {
        alert("Please fully complete the address field, or leave blank");
        return false;
    }
    return true;
} // isValidAddressForm

/**
 * Returns true if all payment card fields are complete.
 * Returns false otherwise.
 */
function isCompletePaymentCard(cardType, nameOnCard, cardNumber, expirationMonth, expirationYear, 
    cvc, isCompleteBillingAddress) 
{
    return (cardType !== '' && nameOnCard !== '' && cardNumber !== ''&& expirationMonth !== '' 
        && expirationYear !== '' && cvc !== '' && isCompleteBillingAddress);
} // isCompletePaymentCard

/**
 * Returns true if all payment card fields are empty.
 * Returns false otherwise.
 */
function isEmptyPaymentCard(cardType, nameOnCard, cardNumber, expirationMonth, expirationYear,
    cvc, isEmptyBillingAddress)
{
    return (cardType === '' && nameOnCard === '' && cardNumber === ''&& expirationMonth === '' 
        && expirationYear === '' && cvc === '' && isEmptyBillingAddress);
} // isEmptyPaymentCard

/**
 * Returns true if the payment card field is empty or if is fully complete with properly
 * formatted card number and cvc.
 * 
 * Returns false otherwise.
 */
export function isValidPaymentCardForm(cardType, nameOnCard, cardNumber, 
    expirationMonth, expirationYear, cvc, billingAddress, billingCity, billingState, 
    billingCountry, billingZipCode) 
{
    // determine state of billing address fields
    const isCompleteBillingAddress = isCompleteAddress(billingAddress, billingCity, 
        billingState, billingCountry, billingZipCode);
    const isEmptyBillingAddress = isEmptyAddress(billingAddress, billingCity, 
        billingState, billingCountry, billingZipCode);
    
    // determine state of payment card input
    const isCompleteCard = isCompletePaymentCard(cardType, nameOnCard, cardNumber,
        expirationMonth, expirationYear, cvc, isCompleteBillingAddress);
    const isEmptyCard = isEmptyPaymentCard(cardType, nameOnCard, cardNumber, 
        expirationMonth, expirationYear, cvc, isEmptyBillingAddress);
    
    // empty form accepted
    if (isEmptyCard)
        return true;

    // partilly complete form rejected
    if (!isCompleteCard || cardType === 'none' || expirationMonth === 'none' || expirationYear === 'none') {
        alert("Please fully complete the payment card field, or leave blank");
        return false;
    }

    // true if card number of the form '####-####-####-####'
    const isValidCardNumber = (cardNumber.length === 19     // proper length
        && isDecimalNumber(cardNumber.slice(0,4), 4)        // first four digits is a number
        && cardNumber[4] === "-"                            // 5th char is a hyphen
        && isDecimalNumber(cardNumber.slice(5,9), 4)        // second four digits is a number
        && cardNumber[9] === "-"                            // 10th char is a hyphen
        && isDecimalNumber(cardNumber.slice(10,14), 4)      // third four digits is a number
        && cardNumber[14] === "-"                           // 15th digit is a hyphen
        && isDecimalNumber(cardNumber.slice(15,19), 4)      // last four digits is a number
    );

    if (!isValidCardNumber) {
        alert("Invalid Card Number format")
        return false;
    }

    // reject if cvc not of the form '###'
    const isValidCVC = (cvc.length === 3 && isDecimalNumber(cvc.slice(0,3), 3))
    if (!isValidCVC) {
        alert("Invalid CVC format")
        return false;
    }

    // otherwise, valid form
    return true;
} // isValidPaymentCard


/**
 * Returns -1 upon database request error.
 * Returns ObjectId of newly created User document otherwise.
 */

export async function createUser(firstName, lastName, email, password, phoneNumber, 
    receivePromotions, homeAddressId) 
{
    const isValidHomeAddressId = (homeAddressId !== 0 && homeAddressId !== -1);

    // Create user JavaScript object
    const newUser = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phoneNumber,
        receive_promotions: receivePromotions,
        address: (isValidHomeAddressId ? homeAddressId : null),
    };

    try {
        // Add user to database and return ID of newly created document
        const response = await axios.post("http://localhost:5000/users", newUser, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return the user ID
        return response.data.user_id;
    } catch (error) {
        if (error.response) {
            // Handle specific HTTP error statuses
            if (error.response.status === 409) {
                alert("Email already exists, please use a different email or login!");
            } else {
                console.error("Error creating user: ", error.response.data);
                alert("Error creating user: " + error.response.data.error);
            }
        } else {
            // Handle network or other errors
            console.error("Error creating user: ", error);
            alert("Error creating user");
        }
        return -1; // Return -1 to indicate failure
    }
}

/**
 * Returns 0 if form's payment card field is empty.
 * Returns -1 upon database request error.
 * Returns ObjectId of newly created PaymentCard document otherwise.
 */
export async function createPaymentCard(cardType, nameOnCard, cardNumber, expirationMonth, 
    expirationYear, cvc, billingAddress, billingCity, billingState, billingCountry, billingZipCode, userId) 
{
    const isEmptyCard = isEmptyPaymentCard(billingAddress, billingCity, billingState, billingCountry,
        billingZipCode);
    // return without error if form fields all empty
    if (isEmptyCard)
        return 0;

    // create billing address in database and exit if error occurs
    const billingAddressId = await createAddress('billing', billingAddress, billingCity, billingState, billingCountry, billingZipCode);
    if (billingAddressId === -1)
        return -1;

    // create payment card javascript object
    const newPaymentCard = {
        card_type: cardType,
        name_on_card: nameOnCard,
        card_number: cardNumber,
        month: expirationMonth,
        year: expirationYear,
        cvc: cvc,
        billing_address: billingAddressId,
        customer: userId
    }

    // add payment card to database and return id of newly created document
    let paymentCardId = null;

    await fetch("http://localhost:5000/createPaymentCard", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newPaymentCard),
    })
    .then((res) => res.json())                               // parse JSON response
    .then((data) => {paymentCardId = data.payment_card_id;}) // assign return value
    .catch((error) => {
        console.error("Error creating payment card: ", error);
        alert("Error creating payment card");
        return -1;
    });

    return paymentCardId;
} // createPaymentCard