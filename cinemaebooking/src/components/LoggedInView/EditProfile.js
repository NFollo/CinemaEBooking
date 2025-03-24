import "./EditProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const [address, setAddress] = useState({
    id: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    type: "home",
  });

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
      type: "billing",
    },
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = Cookies.get("email");
      if (!email) {
        setError("No email cookie found.");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/users/${email}`);
        const data = res.data;

        setUser({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        });

        if (data.address) {
          setAddress({
            ...data.address,
          });
        }

        if (data.payment_cards && data.payment_cards.length > 0) {
          const cardData = data.payment_cards[0];
          setCard({
            id: cardData.id,
            card_type: cardData.card_type,
            name_on_card: cardData.name_on_card,
            card_number: "",
            month: cardData.month,
            year: cardData.year,
            cvc: "",
            billing_address: {
              ...cardData.billing_address,
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to fetch user data.");
      }
    };

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
      await axios.patch(`http://localhost:5000/users/${user.email}`, {
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
      });

      await axios.patch(`http://localhost:5000/addresses/${address.id}`, address);

      await axios.patch(`http://localhost:5000/addresses/${card.billing_address.id}`, card.billing_address);

      await axios.patch(`http://localhost:5000/payment_cards/${card.id}`, {
        card_type: card.card_type,
        name_on_card: card.name_on_card,
        card_number: card.card_number,
        month: card.month,
        year: card.year,
        cvc: card.cvc,
        billing_address: card.billing_address.id,
      });

      navigate("/viewprofile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to save changes.");
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

        <div className="EditProfileSubtitle">Home Address</div>

        <div>Street:</div>
        <input type="text" name="street" value={address.street} onChange={handleAddressChange} />

        <div>City:</div>
        <input type="text" name="city" value={address.city} onChange={handleAddressChange} />

        <div>State:</div>
        <input type="text" name="state" value={address.state} onChange={handleAddressChange} />

        <div>Zip Code:</div>
        <input type="text" name="zip_code" value={address.zip_code} onChange={handleAddressChange} />

        <input type="submit" value="Save Changes" className="EditProfileSave" />
      </form>
    </div>
  );
}

export default EditProfile;
