import "./Manage.css";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import SendPromotionModal from "./SendPromotionModal";

import AdminNavBar from '../NavBarViews/AdminNavBar';
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import {getSubscribedUsers} from "../../applicationLogic/UserManager";

function ManagePromotions( {onSearch, input, clearInput, logout} ) {
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  // authorization
  const [authorization, setAuthorization] = useState(Cookies.get("authorization"));

  // popup for sending the promo
  const [showModal, setShowModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [userCount, setUserCount] = useState(0); // State to hold user count

  useEffect(() => {
    axios.get("http://localhost:5000/promotions")
      .then((res) => setPromotions(res.data))
      .catch((err) => console.error("Error fetching promotions:", err));
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);  // Parse the ISO string
    return date.toLocaleDateString(undefined, options);  // Format it to a readable format
  };

  const handleEdit = (promotion) => {
    const isNewPromo = !promotion._id;  // Check if it's a new promotion
    localStorage.setItem("promotionData", JSON.stringify({ promotion, isNewPromo }));
    navigate("/editpromotions", { state: { promotion, isNewPromo } });
  };

  const handleSend = (promotion) => {
    // Close the modal first
    setShowModal(false);
  
    // Send the promotion
    axios.post("http://localhost:5000/promotions/send", { promotion })
      .then((res) => {
        console.log("Promotion sent successfully", res.data);
        alert("Promotion sent successfully!");
  
        // Update the promotions list to reflect the sent status
        setPromotions(prevPromotions =>
          prevPromotions.map(p => 
            p._id === promotion._id ? { ...p, email_send: true } : p
          )
        );
      })
      .catch((err) => {
        console.error("Error sending promotion:", err);
        alert("Failed to send promotion.");
      });
  };
  

  const handleCloseModal = () => {
    setShowModal(false); // Close modal when "Cancel" is clicked
  };
  
  
  const openModal = async (promo) => {
    await getSubscribedUsers()
      .then((users) => {
        const count = users.length; // Get the count of subscribed users
        setUserCount(count); // Set the user count
        setSelectedPromo(promo);
        setShowModal(true);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/promotions/${id}`)
      .then(() => {
        setPromotions(prev => prev.filter(p => p._id !== id));
      })
      .catch((err) => console.error("Error deleting promotion:", err));
  };

  return (
    <div>
    <div>
      {authorization === "admin" ? "" : <Navigate to="/"></Navigate>}  
      <AdminNavBar onSearch={onSearch} logout={logout} input={input} clearInput={clearInput}/>
    </div>
    <div className="Manage">
      <div className="ManageTitle">Manage Promotions</div>

      {promotions.map((promo) => (
        <div className="ManageUnit" key={promo._id}>
          <div className="ManageUnitName">{"Code: " + promo.promo_code}</div>
          {/* Display the end date of the promotion */}
          {promo.expiration_date && promo.email_send &&(
            <div className="">
              <strong>Ends on: </strong>{formatDate(promo.expiration_date)}
            </div>
          )}
          <div className="ManageUnitOptions">
            {/* Check if the promotion has been sent */}
            {!promo.email_send && (
              <>
                <div onClick={() => openModal(promo)} className="ManageEditButton">Send</div>
                <div onClick={() => handleEdit(promo)} className="ManageEditButton">Edit</div>
                <div onClick={() => handleDelete(promo._id)} className="ManageEditButton">Delete</div>
              </>
            )}
            {promo.email_send && (
              <div className="ManageUnitOptions">
                <div className="ManageEditButton" style={{ cursor: "not-allowed", opacity: 0.5 }}>Sent</div>
                <div className="ManageEditButton" style={{ cursor: "not-allowed", opacity: 0.5 }}>Edit </div>
                <div className="ManageEditButton" style={{ cursor: "not-allowed", opacity: 0.5 }}>Delete </div>
              </div>
              
            )}
          </div>
        </div>
      ))}

      <div className="ManageUnit">
        <div className="ManageEditButtonAdd" onClick={() => handleEdit({})}>
          Add Promotion
        </div>
      </div>
      {showModal && selectedPromo && (
        <SendPromotionModal
          promotion={selectedPromo}
          userCount={userCount} 
          onClose={() => handleCloseModal(false)}
          onSend={() => handleSend(selectedPromo)}
        />
      )}
    </div>
    </div>
  );
}

export default ManagePromotions;
