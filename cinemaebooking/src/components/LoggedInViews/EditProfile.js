import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import {createAddress, getAddress, updateAddress} from "../../applicationLogic/AddressManager";
import {getUserByEmail, updateUserAddress, updateUserDetails, updateUserPassword} 
    from "../../applicationLogic/UserManager";
import LoggedNavBar from '../NavBarViews/LoggedNavBar';
import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";


function EditProfile( {onSearch, input, clearInput, logout} ) {

    // authorization
    const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [cards, setCards] = useState([]);
     const [oldPassword, setOldPassword] = useState("");
     const [newPassword, setNewPassword] = useState("");

    // general info

    const [user, setUser] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        receivePromotions: false
    });

    // home address
    const [address, setAddress] = useState({
        id: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        type: "home",
    });

    // card and billing
    const [card, setCard] = useState({
        id: "",
        card_type: "",
        card_number: "",
        name_on_card: "",
        last_four: "",
        month: "",
        year: "",
        cvc: "",

        billing_address: {
            id: "",
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
            type: "billing",
        },
    });
    const [card2, setCard2] = useState(null);
    const [card3, setCard3] = useState(null);

  

    const [newCard, setNewCard] = useState({
        card_type: "",
        name_on_card: "",
        card_number: "",
        month: "",
        year: "",
        cvc: "",
        billing_address: {
            street: "",
            city: "",
            state: "",
            zip_code: "",
            country: "",
            type: "billing",
        },
    });

    // only allow numbers
    const disallowNonNumericInput = (evt) => {
        if (evt.ctrlKey) return;
        if (evt.key.length > 1) return;
        if (/[0-9]/.test(evt.key)) return;
        evt.preventDefault();
    };

    // format card number
    const formatToCardNumber = (evt) => {
        const digits = evt.target.value.replace(/\D/g, '').substring(0, 16);
        const part1 = digits.substring(0, 4);
        const part2 = digits.substring(4, 8);
        const part3 = digits.substring(8, 12);
        const part4 = digits.substring(12, 16);
    
        let formattedCard = '';
        if (digits.length > 12) {
            formattedCard = `${part1}-${part2}-${part3}-${part4}`;
        } else if (digits.length > 8) {
            formattedCard = `${part1}-${part2}-${part3}`;
        } else if (digits.length > 4) {
            formattedCard = `${part1}-${part2}`;
        } else {
            formattedCard = part1;
        }
    
        switch (evt.target.name) {
            case "card1_number":
                setCard((prev) => ({ ...prev, card_number: formattedCard }));
                break;
            case "card2_number":
                setCard2((prev) => ({ ...prev, card_number: formattedCard }));
                break;
            case "card3_number":
                setCard3((prev) => ({ ...prev, card_number: formattedCard }));
                break;
            case "newCard_number":
                setNewCard((prev) => ({ ...prev, card_number: formattedCard }));
                break;
            default:
        }
        //setCardNumber(formattedCard);
    }

    async function createPaymentCard(
        cardType,
        nameOnCard,
        cardNumber,
        expirationMonth,
        expirationYear,
        cvc,
        billingStreet,
        billingCity,
        billingState,
        billingCountry,
        billingZipCode,
        userId
    ) {
        const billingAddressPayload = {
            type: "billing",
            street: billingStreet,
            city: billingCity,
            state: billingState,
            country: billingCountry,
            zip_code: billingZipCode,
        };
    
        // Create billing address
        const billingAddressId = await createAddress("billing", billingStreet, billingCity, billingState, billingCountry, billingZipCode);
        if (billingAddressId === -1) {
            alert("Error saving billing address");
            return -1;
        }
    
        // Create card
        const cardPayload = {
            card_type: cardType,
            name_on_card: nameOnCard,
            card_number: cardNumber,
            month: expirationMonth,
            year: expirationYear,
            cvc: cvc,
            billing_address: billingAddressId,
            customer: userId,
        };
    
        const res = await axios.post("http://localhost:5000/createPaymentCard", cardPayload);
        return res.data.payment_card_id || -1;
    }
    
    // gets info from db
    const fetchData = async () => {
        const email = Cookies.get("email");
        if (!email) {
            return;
        }

        try {
        const retrievedUser = await getUserByEmail(email);

        // gets user info
        setUser({
            email: retrievedUser.email,
            first_name: retrievedUser.first_name,
            last_name: retrievedUser.last_name,
            phone_number: retrievedUser.phone_number,
            receivePromotions: retrievedUser.receive_promotions
        });

        // gets home address 
        if (retrievedUser.address != null) {
            const addrId = retrievedUser.address.$oid || retrievedUser.address._id || retrievedUser.address;
            const addr = await getAddress(addrId);

            setAddress({
                id: addr._id || addrId,
                street: addr.street || "",
                city: addr.city || "",
                state: addr.state || "",
                zip_code: addr.zip_code || "",
                country: addr.country || "",
                type: addr.type || "home",
            });
        }

        // gets card info
        const getCards = await axios.get('http://localhost:5000/paymentCards/' 
            + (retrievedUser._id.$oid || retrievedUser._id));
        const cards = getCards.data;
        setCards(cards);
        if (cards.length >= 1) {
            const getBillingAddress = async (cardObj) => 
                await getAddress(cardObj.billing_address.$oid || cardObj.billing_address._id);
        
            const firstCard = cards[0];
            const billing1 = await getBillingAddress(firstCard);
            setCard({
                id: firstCard._id || firstCard.id,
                card_type: firstCard.card_type,
                name_on_card: firstCard.name_on_card,
                card_number: "",
                month: firstCard.month,
                year: firstCard.year,
                cvc: "",
                billing_address: {
                    id: billing1._id,
                    street: billing1.street,
                    city: billing1.city,
                    state: billing1.state,
                    zip_code: billing1.zip_code,
                    country: billing1.country,
                    type: billing1.type,
                },
            });
        
            if (cards.length >= 2) {
                const secondCard = cards[1];
                const billing2 = await getBillingAddress(secondCard);
                setCard2({
                    id: secondCard._id,
                    card_type: secondCard.card_type,
                    name_on_card: secondCard.name_on_card,
                    card_number: "",
                    month: secondCard.month,
                    year: secondCard.year,
                    cvc: "",
                    billing_address: {
                        id: billing2._id,
                        street: billing2.street,
                        city: billing2.city,
                        state: billing2.state,
                        zip_code: billing2.zip_code,
                        country: billing2.country,
                        type: billing2.type,
                    },
                });
            }
        
            if (cards.length >= 3) {
                const thirdCard = cards[2];
                const billing3 = await getBillingAddress(thirdCard);
                setCard3({
                    id: thirdCard._id,
                    card_type: thirdCard.card_type,
                    name_on_card: thirdCard.name_on_card,
                    card_number: "",
                    month: thirdCard.month,
                    year: thirdCard.year,
                    cvc: "",
                    billing_address: {
                        id: billing3._id,
                        street: billing3.street,
                        city: billing3.city,
                        state: billing3.state,
                        zip_code: billing3.zip_code,
                        country: billing3.country,
                        type: billing3.type,
                    },
                });
            }
        }
          
        } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to fetch user data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        if (name === "card1_number")
            setCard((prev) => ({...prev, ["card_number"]: value}));
        else
            setCard((prev) => ({ ...prev, [name]: value }));
    };

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setCard((prev) => ({
        ...prev,
        billing_address: {
            ...prev.billing_address,
            [name]: value,
        },
        }));
    };

    const handleCard2Change = (e) => {
        const { name, value } = e.target;
        if (name === "card2_number")
            setCard2((prev) => ({...prev, ["card_number"]: value}));
        else
            setCard2((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleBilling2Change = (e) => {
        const { name, value } = e.target;
        setCard2((prev) => ({
            ...prev,
            billing_address: {
                ...prev.billing_address,
                [name]: value,
            },
        }));
    };
    
    const handleCard3Change = (e) => {
        const { name, value } = e.target;
        if (name === "card3_number")
            setCard3((prev) => ({...prev, ["card_number"]: value}));
        else
            setCard3((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleBilling3Change = (e) => {
        const { name, value } = e.target;
        setCard3((prev) => ({
            ...prev,
            billing_address: {
                ...prev.billing_address,
                [name]: value,
            },
        }));
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ( (card && card.card_type === "") || (card2 && card2.card_type === "") 
              || (card3 && card3.card_type === "")) {
            alert("Please select a valid card type");
            return;
        }

        
        try {
            const newUser = {
                firstName: user.first_name,
                lastName: user.last_name,
                phoneNumber: user.phone_number,
                receivePromotions: user.receivePromotions
            }

            await updateUserDetails(user.email, newUser);
            if (newPassword !== "")
                await updateUserPassword(user.email, newPassword);
            
            /*
            // rest password
             await axios.post('http://localhost:5000/resetPassword', {
                 email: user.email,
                 old_password: oldPassword,
                 new_password: newPassword,
               });              
            */

            // updates home address
            if (address.id) {
                await updateAddress(address.id.$oid, address.type, address.street, address.city, 
                    address.state, address.country, address.zip_code);
            } else {

                const newAddressId = await createAddress("home", address.street, address.city, address.state,
                    address.country, address.zip_code);
                console.log("Created new address:", newAddressId);

                await updateUserAddress(user.email, newAddressId);

                setAddress((prev) => ({ ...prev, id: newAddressId }));
            }

            // updates billing addresses
            if (card && card.billing_address.id) {
                await updateAddress(card.billing_address.id.$oid, "billing", card.billing_address.street, 
                    card.billing_address.city, card.billing_address.state, card.billing_address.country,
                    card.billing_address.zip_code);
            }
            
            if (card2 && card2.billing_address.id) {
                await updateAddress(card2.billing_address.id.$oid, "billing", card2.billing_address.street, 
                    card2.billing_address.city, card2.billing_address.state, card2.billing_address.country,
                    card2.billing_address.zip_code);
            }

            if (card3 && card3.billing_address.id) {
                await updateAddress(card3.billing_address.id.$oid, "billing", card3.billing_address.street, 
                    card3.billing_address.city, card3.billing_address.state, card3.billing_address.country,
                    card3.billing_address.zip_code);
            }

            // updates cards
            if (card) {
                await axios.patch(`http://localhost:5000/paymentCards/${card.id.$oid}`, {
                    card_type: card.card_type,
                    name_on_card: card.name_on_card,
                    card_number: card.card_number,
                    month: card.month,
                    year: card.year,
                    cvc: card.cvc,
                    billing_address: card.billing_address.id,
                });
            }

            if (card2) {
                await axios.patch(`http://localhost:5000/paymentCards/${card2.id.$oid}`, {
                    card_type: card2.card_type,
                    name_on_card: card2.name_on_card,
                    card_number: card2.card_number,
                    month: card2.month,
                    year: card2.year,
                    cvc: card2.cvc,
                    billing_address: card2.billing_address.id,
                });
            }

            if (card3) {
                await axios.patch(`http://localhost:5000/paymentCards/${card3.id.$oid}`, {
                    card_type: card3.card_type,
                    name_on_card: card3.name_on_card,
                    card_number: card3.card_number,
                    month: card3.month,
                    year: card3.year,
                    cvc: card3.cvc,
                    billing_address: card3.billing_address.id,
                });
            }

            await fetchData();
            await axios.post('http://localhost:5000/sendProfileChangedEmail', {
                email: user.email,
            });

        } catch (err) {
        console.error("Failed to update profile:", err);
        setError("Failed to save changes.");
        }
        navigate("/viewprofile")
    };

    const handleAddCard = async () => {
        if (cards.length >= 3) {
            alert("You can only add up to 3 cards.");
            return;
        }
        const email = Cookies.get("email");
        if (!email) {
            setError("Not logged in.");
            return;
        }
    
        try {
            // Get user ID
            const retrievedUser = await getUserByEmail(email);
            const userId = retrievedUser._id?.$oid || retrievedUser._id;
    
            const paymentCardId = await createPaymentCard(
                newCard.card_type,
                newCard.name_on_card,
                newCard.card_number,
                newCard.month,
                newCard.year,
                newCard.cvc,
                newCard.billing_address.street,
                newCard.billing_address.city,
                newCard.billing_address.state,
                newCard.billing_address.country,
                newCard.billing_address.zip_code,
                userId
            );
    
            if (paymentCardId === -1) {
                setError("Failed to create new payment card.");
                return;
            }
    
            // Reset form state
            setNewCard({
                card_type: "",
                name_on_card: "",
                card_number: "",
                month: "",
                year: "",
                cvc: "",
                billing_address: {
                    street: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    country: "",
                    type: "billing",
                },
            });
    
            // Refresh data
            await fetchData();
    
            alert("Card successfully added!");
        } catch (err) {
            console.error("Error adding new card:", err);
            setError("Something went wrong while adding the card.");
        }
    };

    
    const handleDeleteCard = async (cardId, billingAddressId) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
    
        try {
            // Delete the card (the backend will also delete billing address)
            await axios.delete(`http://localhost:5000/paymentCards/${cardId}`);
            console.log("Deleted card:", cardId);
    
            // Refresh data after deletion
            await fetchData();
            alert("Card deleted successfully!");
            window.location.reload(); // reload the page after a card is deleted 
        } catch (err) {
            console.error("Error deleting card:", err);
            setError("Failed to delete card.");
        }
    };
    
    

    return (
        <div>
        <div>
            {(authorization === "admin" || authorization === "customer") ? "" : <Navigate to="/"></Navigate>}  
                  {authorization === "admin" ? <AdminNavBar onSearch={onSearch} input={input} clearInput={clearInput} logout={logout}/> 
                    : (authorization === "customer" ? <LoggedNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/> 
                    : "")}
        </div>
        <div className="EditProfile">
        <div className="EditProfileTitle">Edit Profile</div>
        {error && <div className="Error">{error}</div>}

        <form className="EditProfileForm" onSubmit={handleSubmit}>
            {/* general information */}
            <div className="EditProfileSubtitle">General Information</div>
            <div>Email: <span>{user.email}</span></div>
            <div>First Name:</div>
            <input type="text" name="first_name" value={user.first_name} onChange={handleUserChange} />
            <div>Last Name:</div>
            <input type="text" name="last_name" value={user.last_name} onChange={handleUserChange} />
            <div>Phone Number:</div>
            <input type="text" name="phone_number" value={user.phone_number} onChange={handleUserChange} />

            {/* change password */}
             <div className="EditProfileSubtitle">Change Password</div>
            <div>Current Password:</div>
            <input
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            />
            <div>New Password:</div>
            <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* home address */}
            <div className="EditProfileSubtitle">Home Address</div>
            <div>Street:</div>
            <input type="text" name="street" value={address.street} onChange={handleAddressChange} />
            <div>City:</div>
            <input type="text" name="city" value={address.city} onChange={handleAddressChange} />
            <div>State:</div>
            <input type="text" name="state" value={address.state} onChange={handleAddressChange} />
            <div>Zip Code:</div>
            <input type="text" name="zip_code" value={address.zip_code} onChange={handleAddressChange} />
            <div>Country:</div>
            <input type="text" name="country" value={address.country} onChange={handleAddressChange} />

            {/* card information */}
            {cards.length >= 1 && (
                <>
                <div className="EditProfileSubtitle">Card 1 Information</div>
                <div>Card Type:</div>
                <select name="card_type" value={card.card_type} onChange={handleCardChange}>
                    <option value="">Select</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                </select>

                <div>Name on Card:</div>
                <input type="text" name="name_on_card" value={card.name_on_card} onChange={handleCardChange} />
                <div>Card Number:</div>
                <input type="text" name="card1_number" value={card.card_number} onChange={handleCardChange} 
                    placeholder="1111-2222-3333-4444"
                    maxlength="19"
                    onKeyDown={disallowNonNumericInput}
                    onKeyUp={formatToCardNumber}/>
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card.month} onChange={handleCardChange} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card.year} onChange={handleCardChange} />
                <div>CVC:</div>
                <input type="password" name="cvc" value={card.cvc} onChange={handleCardChange} 
                    maxLength={3}/>

                <div className="EditProfileSubtitle">Billing Address</div>
                <div>Street:</div>
                <input type="text" name="street" value={card.billing_address.street} onChange={handleBillingChange} />
                <div>City:</div>
                <input type="text" name="city" value={card.billing_address.city} onChange={handleBillingChange} />
                <div>State:</div>
                <input type="text" name="state" value={card.billing_address.state} onChange={handleBillingChange} />
                <div>Zip Code:</div>
                <input type="text" name="zip_code" value={card.billing_address.zip_code} onChange={handleBillingChange} />
                <div>Country:</div>
                <input type="text" name="country" value={card.billing_address.country} onChange={handleBillingChange} />

                <div style={{ marginTop: "10px" }}>
                    <button
                        type="button"
                        className="deleteCardButton"
                        onClick={() =>
                            handleDeleteCard(
                                card.id?.$oid || card.id,
                                card.billing_address.id?.$oid || card.billing_address.id
                            )
                        }
                    >
                        Delete Card
                    </button>
                </div>
                </>
            )}

            {card2 && (
            <>
                <div className="EditProfileSubtitle">Card 2 Information</div>
                <div>Card Type:</div>
                <select name="card_type" value={card2.card_type} onChange={handleCard2Change}>
                <option value="">Select</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                </select>

                <div>Name on Card:</div>
                <input type="text" name="name_on_card" value={card2.name_on_card} onChange={handleCard2Change} />
                <div>Card Number:</div>
                <input type="text" name="card2_number" value={card2.card_number} onChange={handleCard2Change} 
                    placeholder="1111-2222-3333-4444"
                    maxlength="19"
                    onKeyDown={disallowNonNumericInput}
                    onKeyUp={formatToCardNumber}/>
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card2.month} onChange={handleCard2Change} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card2.year} onChange={handleCard2Change} />
                <div>CVC:</div>
                <input type="password" name="cvc" value={card2.cvc} onChange={handleCard2Change} 
                    maxLength={3}/>

                <div className="EditProfileSubtitle">Billing Address (Card 2)</div>
                <div>Street:</div>
                <input type="text" name="street" value={card2.billing_address.street} onChange={handleBilling2Change} />
                <div>City:</div>
                <input type="text" name="city" value={card2.billing_address.city} onChange={handleBilling2Change} />
                <div>State:</div>
                <input type="text" name="state" value={card2.billing_address.state} onChange={handleBilling2Change} />
                <div>Zip Code:</div>
                <input type="text" name="zip_code" value={card2.billing_address.zip_code} onChange={handleBilling2Change} />
                <div>Country:</div>
                <input type="text" name="country" value={card2.billing_address.country} onChange={handleBilling2Change} />

                <div style={{ marginTop: "10px" }}>
                <button
                    type="button"
                    className="deleteCardButton"
                    onClick={() =>
                    handleDeleteCard(
                        card2.id?.$oid || card2.id,
                        card2.billing_address.id?.$oid || card2.billing_address.id
                    )
                    }
                >
                    Delete Card 2
                </button>
                </div>
            </>
            )}
            {card3 && (
            <>
                <div className="EditProfileSubtitle">Card 3 Information</div>
                <div>Card Type:</div>
                <select name="card_type" value={card3.card_type} onChange={handleCard3Change}>
                <option value="">Select</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
                </select>

                <div>Name on Card:</div>
                <input type="text" name="name_on_card" value={card3.name_on_card} onChange={handleCard3Change} />
                <div>Card Number:</div>
                <input type="text" name="card3_number" value={card3.card_number} onChange={handleCard3Change} 
                    placeholder="1111-2222-3333-4444"
                    maxlength="19"
                    onKeyDown={disallowNonNumericInput}
                    onKeyUp={formatToCardNumber}/>
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card3.month} onChange={handleCard3Change} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card3.year} onChange={handleCard3Change} />
                <div>CVC:</div>
                <input type="password" name="cvc" value={card3.cvc} onChange={handleCard3Change} 
                    maxLength={3}/>

                <div className="EditProfileSubtitle">Billing Address (Card 3)</div>
                <div>Street:</div>
                <input type="text" name="street" value={card3.billing_address.street} onChange={handleBilling3Change} />
                <div>City:</div>
                <input type="text" name="city" value={card3.billing_address.city} onChange={handleBilling3Change} />
                <div>State:</div>
                <input type="text" name="state" value={card3.billing_address.state} onChange={handleBilling3Change} />
                <div>Zip Code:</div>
                <input type="text" name="zip_code" value={card3.billing_address.zip_code} onChange={handleBilling3Change} />
                <div>Country:</div>
                <input type="text" name="country" value={card3.billing_address.country} onChange={handleBilling3Change} />

                <div style={{ marginTop: "10px" }}>
                <button
                    type="button"
                    className="deleteCardButton"
                    onClick={() =>
                    handleDeleteCard(
                        card3.id?.$oid || card3.id,
                        card3.billing_address.id?.$oid || card3.billing_address.id
                    )
                    }
                >
                    Delete Card 3
                </button>
                </div>
            </>
            )}

            {!card3 && (<><div className="EditProfileSubtitle">Add New Card</div>

            <div>Card Type:</div>
            <select name="card_type" value={newCard.card_type} onChange={(e) =>
            setNewCard({ ...newCard, card_type: e.target.value })
            }>
            <option value="">Select</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            </select>

            <div>Name on Card:</div>
            <input type="text" name="name_on_card" value={newCard.name_on_card}
            onChange={(e) => setNewCard({ ...newCard, name_on_card: e.target.value })}
            />
            <div>Card Number:</div>
            <input type="text" name="newCard_number" value={newCard.card_number}
                onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
                placeholder="1111-2222-3333-4444"
                    maxlength="19"
                    onKeyDown={disallowNonNumericInput}
                    onKeyUp={formatToCardNumber}/>
            <div>Expiration Month:</div>
            <input type="text" name="month" value={newCard.month}
            onChange={(e) => setNewCard({ ...newCard, month: e.target.value })}
            />
            <div>Expiration Year:</div>
            <input type="text" name="year" value={newCard.year}
            onChange={(e) => setNewCard({ ...newCard, year: e.target.value })}
            />
            <div>CVC:</div>
            <input type="password" name="cvc" value={newCard.cvc}
            onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
            maxLength={3}/>

            <div className="EditProfileSubtitle">New Billing Address</div>

            <div>Street:</div>
            <input type="text" name="street" value={newCard.billing_address.street}
            onChange={(e) => setNewCard({
                ...newCard,
                billing_address: { ...newCard.billing_address, street: e.target.value },
            })}
            />
            <div>City:</div>
            <input type="text" name="city" value={newCard.billing_address.city}
            onChange={(e) => setNewCard({
                ...newCard,
                billing_address: { ...newCard.billing_address, city: e.target.value },
            })}
            />
            <div>State:</div>
            <input type="text" name="state" value={newCard.billing_address.state}
            onChange={(e) => setNewCard({
                ...newCard,
                billing_address: { ...newCard.billing_address, state: e.target.value },
            })}
            />
            <div>Zip Code:</div>
            <input type="text" name="zip_code" value={newCard.billing_address.zip_code}
            onChange={(e) => setNewCard({
                ...newCard,
                billing_address: { ...newCard.billing_address, zip_code: e.target.value },
            })}
            />
            <div>Country:</div>
            <input type="text" name="country" value={newCard.billing_address.country}
            onChange={(e) => setNewCard({
                ...newCard,
                billing_address: { ...newCard.billing_address, country: e.target.value },
            })}
            />

            <div style={{ marginTop: "10px" }}>
                <button type="button" className="addNewCardButton" onClick={handleAddCard}>
                Add New Card
                </button>
            </div></>)}
            
            <div className="SignupFormSplit">
            Receive promotions:
            <input id="receivePromotions"
                type="checkbox" 
                name="receivePromotions"
                checked={user.receivePromotions}
                onChange={(e) => {setUser({
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_number: user.phone_number,
                    receivePromotions: e.target.checked
                })}}>
            </input>
        </div>

            <input type="submit" value="Save Changes" className="EditProfileSave" />
        </form>
        </div>
        </div>
    );
}

export default EditProfile;
