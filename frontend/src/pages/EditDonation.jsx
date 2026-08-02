import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditDonation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    item_name: "",
    category: "Food",
    quantity: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get(`/donations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch donation");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateDonation = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access");

      await api.put(`/donations/${id}/`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Donation Updated Successfully");
      navigate("/donations");
    } catch (error) {
      console.log(error);
      alert("Unable to update donation");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Edit Donation</h1>

        <form onSubmit={updateDonation}>

          <input
            type="text"
            name="item_name"
            value={form.item_name}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Food</option>
            <option>Clothes</option>
            <option>Books</option>
            <option>Medicine</option>
            <option>Electronics</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
          />

          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Update Donation
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditDonation;