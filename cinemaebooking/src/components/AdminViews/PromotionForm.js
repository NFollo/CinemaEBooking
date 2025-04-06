import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function PromotionForm({ initialData, movies, onSubmit, isEdit }) {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

// TODO: VALIDATE FORM FIELDS

  const [formData, setFormData] = useState({
    promo_code: "",
    discount: "",
    expiration_date: "",
    movie_id: "",
    email_send: false,
  });

  // validate fields
  const validate = () => {
    const newErrors = {};
  
    if (!formData.promo_code.trim()) {
      newErrors.promo_code = "Promotion code is required.";
    }
  
    if (!formData.movie_id) {
      newErrors.movie_id = "Please select a movie.";
    }
  
    const discountValue = parseFloat(formData.discount);
    if (
      isNaN(discountValue) || 
      discountValue <= 0 || 
      discountValue >= 1
    ) {
      newErrors.discount = "Discount must be a decimal between 0.0 and 1.0 (e.g., 0.25 for 25%).";
    }
  
    if (!formData.expiration_date) {
      newErrors.expiration_date = "Expiration date is required.";
    }
  
    return newErrors;
  };

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        promo_code: initialData.promo_code || "",
        discount: initialData.discount || "",
        expiration_date: initialData.expiration_date
          ? new Date(initialData.expiration_date).toISOString().split("T")[0]
          : "",
        movie_id: initialData.movie_id || "",
        email_send: initialData.email_send || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle the submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      alert("Please fix the following errors:\n\n" + errorMessages);
      return;
    }
    
    const dataToSubmit = {
      promo_code: formData.promo_code,
      discount: parseFloat(formData.discount),
      expiration_date: new Date(formData.expiration_date).toISOString(),
      movie_id: formData.movie_id,
      email_send: formData.email_send,
    };

    onSubmit(dataToSubmit);
  };

  // go back to manage promotion page
  const goBackHandler = (e) => {
    e.preventDefault(); // Prevent form submit
    navigate("/managepromotions");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>Promotion Code:</div>
      <input
        type="text"
        name="promo_code"
        value={formData.promo_code}
        onChange={handleChange}
      />

      <div>Select Movie:</div>
      <select
        name="movie_id"
        value={formData.movie_id}
        onChange={handleChange}
      >
        <option value="">-- Select a Movie --</option>
        {movies.map((movie) => (
          <option key={movie._id} value={movie._id}>
            {movie.title}
          </option>
        ))}
      </select>

      <div>Discount Amount:</div>
      <input
        type="number"
        name="discount"
        min="0.01"
        max="0.99"
        step="0.01"
        placeholder="e.g., 0.25 for 25%"
        value={formData.discount}
        onChange={handleChange}
      />

      <div>Expiration Date:</div>
      <input
        type="date"
        name="expiration_date"
        value={formData.expiration_date}
        onChange={handleChange}
      />

      <div>
        <label>
          <input
            type="checkbox"
            name="email_send"
            checked={formData.email_send}
            onChange={handleChange}
          />
          Send Email Notification
        </label>
      </div>

      <div>
        <input
          type="submit"
          value={isEdit ? "Save Changes" : "Create Promotion"}
          className="AdminEditSave"
        />
      </div>
      <div>
      <input
          type="submit"
          value="Go Back"
          className="AdminEditSave"
          onClick={goBackHandler}
        />
      </div>
    </form>
  );
}

export default PromotionForm;
