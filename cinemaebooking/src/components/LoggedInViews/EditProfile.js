import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";


function EditProfile() {
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
        const billingRes = await axios.post("http://localhost:5000/createAddress", billingAddressPayload);
        const billingAddressId = billingRes.data.address_id;
        if (!billingAddressId) return -1;
    
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
        const res = await axios.get(`http://localhost:5000/users/${email}`);
        const data = res.data;

        // gets user info
        setUser({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            receivePromotions: data.receive_promotions
        });

        // gets home address 
        if (data.address != null) {
            const addrId = data.address.$oid || data.address._id || data.address;
            const getaddr = await axios.get(`http://localhost:5000/addresses/${addrId}`);
            const addr = getaddr.data;

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
        const getCards = await axios.get('http://localhost:5000/paymentCards/' + (data._id.$oid || data._id));
        const cards = getCards.data;
        setCards(cards);
        if (cards.length >= 1) {
            const getBillingAddress = async (cardObj) => {
                const res = await axios.get('http://localhost:5000/addresses/' + (cardObj.billing_address.$oid || cardObj.billing_address._id));
                return res.data;
            };
        
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
        
        try {
            // updates user
            // TEMP FIX
            if (newPassword === "")
                await axios.patch(`http://localhost:5000/users/${user.email}`, {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_number: user.phone_number,
                    receive_promotions: user.receivePromotions,
                });
            else {
                await axios.patch(`http://localhost:5000/users/${user.email}`, {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_number: user.phone_number,
                    receive_promotions: user.receivePromotions,
                    password: newPassword,
                });
            }
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
                await axios.patch(`http://localhost:5000/addresses/${address.id.$oid}`, address);
                console.log("Updated existing address:", address.id);
            } else {
                const createRes = await axios.post("http://localhost:5000/createAddress", {
                    street: address.street,
                    city: address.city,
                    state: address.state,
                    zip_code: address.zip_code,
                    country: address.country,
                    type: "home",
                });

                const newAddressId = createRes.data.address_id;
                console.log("Created new address:", newAddressId);

                await axios.patch(`http://localhost:5000/users/${user.email}`, {
                    address: newAddressId,
                });

                setAddress((prev) => ({ ...prev, id: newAddressId }));
            }

            // updates billing address
            if (card.billing_address.id) {
                await axios.patch(`http://localhost:5000/addresses/${card.billing_address.id.$oid}`, card.billing_address);
            }

            // updates cards
            if (card.id) {
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
            const res = await axios.get(`http://localhost:5000/users/${email}`);
            const userId = res.data._id?.$oid || res.data._id;
    
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
                <input type="text" name="card_number" value={card.card_number} onChange={handleCardChange} />
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card.month} onChange={handleCardChange} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card.year} onChange={handleCardChange} />
                <div>CVC:</div>
                <input type="text" name="cvc" value={card.cvc} onChange={handleCardChange} />

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
                <input type="text" name="card_number" value={card2.card_number} onChange={handleCard2Change} />
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card2.month} onChange={handleCard2Change} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card2.year} onChange={handleCard2Change} />
                <div>CVC:</div>
                <input type="text" name="cvc" value={card2.cvc} onChange={handleCard2Change} />

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
                <input type="text" name="card_number" value={card3.card_number} onChange={handleCard3Change} />
                <div>Expiration Month:</div>
                <input type="text" name="month" value={card3.month} onChange={handleCard3Change} />
                <div>Expiration Year:</div>
                <input type="text" name="year" value={card3.year} onChange={handleCard3Change} />
                <div>CVC:</div>
                <input type="text" name="cvc" value={card3.cvc} onChange={handleCard3Change} />

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

            <div className="EditProfileSubtitle">Add New Card</div>

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
            <input type="text" name="card_number" value={newCard.card_number}
            onChange={(e) => setNewCard({ ...newCard, card_number: e.target.value })}
            />
            <div>Expiration Month:</div>
            <input type="text" name="month" value={newCard.month}
            onChange={(e) => setNewCard({ ...newCard, month: e.target.value })}
            />
            <div>Expiration Year:</div>
            <input type="text" name="year" value={newCard.year}
            onChange={(e) => setNewCard({ ...newCard, year: e.target.value })}
            />
            <div>CVC:</div>
            <input type="text" name="cvc" value={newCard.cvc}
            onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
            />

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
            </div>
            
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
    );
}

export default EditProfile;
