import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Donate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    item_name: "",
    category: "Food",
    quantity: "",
    description: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  // AI Recommendation
  const [recommendation, setRecommendation] = useState(null);

  const getRecommendation = async (category) => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.post(
        "/recommend/",
        {
          category: category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendation(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (name === "category") {
      getRecommendation(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("access");

      await api.post("/donations/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Donation Added Successfully!");

      setForm({
        item_name: "",
        category: "Food",
        quantity: "",
        description: "",
        location: "",
      });

      setRecommendation(null);

      navigate("/donations");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Unable to connect to Django Server");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-card">

        <h1>Donate an Item</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={form.item_name}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option value="Food">Food</option>
            <option value="Clothes">Clothes</option>
            <option value="Books">Books</option>
            <option value="Medicine">Medicine</option>
            <option value="Electronics">Electronics</option>
            <option value="Other">Other</option>
          </select>

          {/* AI Recommendation */}
          {recommendation && (
            <div
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                padding: "15px",
                background: "#eef8ff",
                border: "1px solid #4da6ff",
                borderRadius: "8px",
              }}
            >
              <h3>🤖 AI Recommendation</h3>

              <p>
                <strong>Recommended NGO:</strong>{" "}
                {recommendation.ngo}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {recommendation.confidence}
              </p>
            </div>
          )}

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Donate"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Donate;