import "./Manage.css";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/promotions")
      .then((res) => setPromotions(res.data))
      .catch((err) => console.error("Error fetching promotions:", err));
  }, []);

  const handleEdit = (promotion) => {
    const isNewPromo = !promotion._id;  // Check if it's a new promotion
    navigate("/editpromotions", { state: { promotion, isNewPromo } });
  };
  

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/promotions/${id}`)
      .then(() => {
        setPromotions(prev => prev.filter(p => p._id !== id));
      })
      .catch((err) => console.error("Error deleting promotion:", err));
  };

  return (
    <div className="Manage">
      <div className="ManageTitle">Manage Promotions</div>

      {promotions.map((promo) => (
        <div className="ManageUnit" key={promo._id}>
          <div className="ManageUnitName">{promo.promo_code}</div>
          <div className="ManageUnitOptions">
            <div onClick={() => handleEdit(promo)} className="ManageEditButton">Edit</div>
            <div onClick={() => handleDelete(promo._id)} className="ManageEditButton">Delete</div>
            {/* <div className="ManagePromocode">Code: {promo.code || "none"}</div> */}
          </div>
        </div>
      ))}

      <div className="ManageUnit">
        <div className="ManageEditButtonAdd" onClick={() => handleEdit({})}>
          Add Promotion
        </div>
      </div>
    </div>
  );
}

export default ManagePromotions;
