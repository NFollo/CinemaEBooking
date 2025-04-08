import "./AdminEdit.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";
import PromotionForm from './PromotionForm';

function EditPromotions() {
  const [movies, setMovies] = useState([]);
  const [promoData, setPromoData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the promotion passed via router state, if any
  const [promotion, setPromotion] = useState(null);
  const [isNewPromo, setIsNewPromo] = useState(false);
  const isEdit = !isNewPromo;

  // Fetch all movies
useEffect(() => {
  axios.get("http://localhost:5000/movies")
    .then((res) => setMovies(res.data))
    .catch((err) => console.error("Error fetching movies:", err));

  // Load promotion data from location.state or localStorage / if refreshing the pages, remembers the page
  if (location.state?.promotion) {
    setPromotion(location.state.promotion);
    setIsNewPromo(location.state.isNewPromo || false);
  } else {
    const saved = localStorage.getItem("promotionData");
    if (saved) {
      const { promotion, isNewPromo } = JSON.parse(saved);
      setPromotion(promotion);
      setIsNewPromo(isNewPromo);
    }
  }
}, [location.state]);



  // Initialize promotion data
  useEffect(() => {
    if (isEdit && promotion) {
      setPromoData({
        promo_code: promotion.promo_code || "",
        discount: promotion.discount || "",
        expiration_date: promotion.expiration_date || "",
        movie_id: promotion.movie_id || "",
        email_send: promotion.email_send || false,
      });
    } else {
      setPromoData({
        promo_code: "",
        discount: "",
        expiration_date: "",
        movie_id: "",
        email_send: false,
      });
    }
  }, [promotion, isEdit]);

  const handleSaveChanges = (data) => {
    if (isEdit) {
      axios.put(`http://localhost:5000/promotions/${promotion._id}`, data)
        .then(() => navigate("/managepromotions"))
        .catch(err => console.error("Failed to update promotion:", err));
    } else {
      axios.post("http://localhost:5000/promotions", data)
        .then(() => navigate("/managepromotions"))
        .catch(err => console.error("Failed to create promotion:", err));
    }
  };

  return (
    <div className="AdminEdit">
      <div className="AdminEditTitle">{isEdit ? "Edit Promotion" : "Add Promotion"}</div>
      {promoData && (
        <PromotionForm
          initialData={promoData}
          movies={movies}
          onSubmit={handleSaveChanges}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}

export default EditPromotions;
