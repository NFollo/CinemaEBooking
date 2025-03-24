import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function EditProfile() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    

    // general info
    const [user, setUser] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
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
        card_number: "",
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
        if (getCards.data.length >= 1) {
            const firstCard = getCards.data[0];
    
            // gets billing address 
            const billingAddrRes = await axios.get(
            'http://localhost:5000/addresses/' + (firstCard.billing_address.$oid || firstCard.billing_address._id)
            );
            const billingAddr = billingAddrRes.data;
    
            setCard({
            id: firstCard._id || firstCard.id,
            card_type: firstCard.card_type,
            name_on_card: firstCard.name_on_card,
            card_number: "",
            month: firstCard.month,
            year: firstCard.year,
            cvc: "",
            billing_address: {
                id: billingAddr._id,
                street: billingAddr.street || "",
                city: billingAddr.city || "",
                state: billingAddr.state || "",
                zip_code: billingAddr.zip_code || "",
                country: billingAddr.country || "",
                type: billingAddr.type || "billing",
            },
            });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // updates user
            await axios.patch(`http://localhost:5000/users/${user.email}`, {
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
            });

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
                await axios.patch(`http://localhost:5000/payment_cards/${card.id.$oid}`, {
                card_type: card.card_type,
                name_on_card: card.name_on_card,
                card_number: card.card_number,
                month: card.month,
                year: card.year,
                cvc: card.cvc,
                billing_address: card.billing_address.id,
                });
            }

            alert("Profile updated successfully!");
            await fetchData();

        } catch (err) {
        console.error("Failed to update profile:", err);
        setError("Failed to save changes.");
        }
    };

    const handleAddCard = async () => {
        try {
        const email = Cookies.get("email");
        const userRes = await axios.get(`http://localhost:5000/users/${email}`);
        const userId = userRes.data._id;

        const cardRes = await axios.get(`http://localhost:5000/paymentcards/${userId}`);
        if (cardRes.data.length >= 3) {
            alert("You can only have up to 3 payment cards.");
            return;
        }

        const billingAddressRes = await axios.post("http://localhost:5000/createAddress", {
            street: card.billing_address.street,
            city: card.billing_address.city,
            state: card.billing_address.state,
            zip_code: card.billing_address.zip_code,
            country: card.billing_address.country,
            type: "billing",
        });

        const billingAddressId = billingAddressRes.data.address_id;

        await axios.post("http://localhost:5000/createPaymentCard", {
            card_type: card.card_type,
            card_number: card.card_number,
            name_on_card: card.name_on_card,
            month: card.month,
            year: card.year,
            cvc: card.cvc,
            billing_address: billingAddressId,
            customer: userId,
        });

        alert("Payment card added successfully!");
        window.location.reload();
        } catch (err) {
        console.error("Failed to add payment card:", err);
        alert("Failed to add card. Please check your inputs.");
        }
    };

    return (
        <div className="EditProfile">
        <div className="EditProfileTitle">Edit Profile</div>
        {error && <div className="Error">{error}</div>}

        <form className="EditProfileForm" onSubmit={handleSubmit}>
            <div className="EditProfileSubtitle">General Information</div>
            <div>Email: <span>{user.email}</span></div>

            <div>First Name:</div>
            <input type="text" name="first_name" value={user.first_name} onChange={handleUserChange} />

            <div>Last Name:</div>
            <input type="text" name="last_name" value={user.last_name} onChange={handleUserChange} />

            <div>Phone Number:</div>
            <input type="text" name="phone_number" value={user.phone_number} onChange={handleUserChange} />

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

            <div className="EditProfileSubtitle">Card Information</div>
            <div>Card Type:</div>
            <select name="card_type" value={card.card_type} onChange={handleCardChange}>
            <option value="">Select</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            </select>

            <div>Name on Card:</div>
            <input type="text" name="name_on_card" value={card.name_on_card} onChange={handleCardChange} />

            <div>Card Number:</div>
            <input
                type="text"
                name="card_number"
                value="****************"
                onChange={handleCardChange}
            />

            <div>Expiration Month:</div>
            <input type="text" name="month" value={card.month} onChange={handleCardChange} />

            <div>Expiration Year:</div>
            <input type="text" name="year" value={card.year} onChange={handleCardChange} />

            <div>CVC:</div>
            <input
                type="text"
                name="cvc"
                value="***"
                onChange={handleCardChange}
            />

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

            <button type="button" className="addNewCardButton" onClick={handleAddCard}>
            Add New Card
            </button>

            <input type="submit" value="Save Changes" className="EditProfileSave" />
        </form>
        </div>
    );
}

export default EditProfile;
