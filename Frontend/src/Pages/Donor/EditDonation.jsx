import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./EditDonation.css";

function EditDonation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    condition: "Good",
    location: "",
    description: "",
    item_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PENDING DONATION
  // =====================================================

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`donation/${id}/`);
        const donation = response.data;

        // Only pending donations can be edited.
        if (
          String(donation.status || "Pending").toLowerCase() !==
          "pending"
        ) {
          setError("Only pending donations can be edited.");
          return;
        }

        setFormData({
          item_name: donation.item_name || "",
          category: donation.category || "",
          quantity: donation.quantity ?? "",
          condition: donation.condition || "Good",
          location: donation.location || "",
          description: donation.description || "",
          item_image: null,
        });

        if (donation.item_image) {
          setImagePreview(donation.item_image);
        }
      } catch (error) {
        console.error(
          "EDIT DONATION FETCH ERROR:",
          error.response?.data || error
        );

        setError(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Unable to load donation details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDonation();
    } else {
      setLoading(false);
      setError("Donation ID is missing.");
    }
  }, [id]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0] || null;

      setFormData((prev) => ({
        ...prev,
        item_image: file,
      }));

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =====================================================
  // SAVE CHANGES
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_name.trim()) {
      alert("Please enter the item name.");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter the pickup location.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = new FormData();

      data.append("item_name", formData.item_name.trim());
      data.append("category", formData.category);
      data.append("quantity", formData.quantity);
      data.append("condition", formData.condition);
      data.append("location", formData.location.trim());
      data.append("description", formData.description.trim());

      // Send image only when donor selects a new image.
      if (formData.item_image) {
        data.append("item_image", formData.item_image);
      }

      await api.patch(`donation/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Donation updated successfully.");
      navigate("/my-donations");
    } catch (error) {
      console.error(
        "EDIT DONATION ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Unable to update donation."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="edit-donation-page">
        <div className="edit-donation-loading">
          <div className="loading-icon">📦</div>
          <h2>Loading donation...</h2>
          <p>Please wait while we load your donation details.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && !formData.item_name) {
    return (
      <div className="edit-donation-page">
        <div className="edit-donation-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to edit donation</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/my-donations")}
          >
            ← Back to My Donations
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="edit-donation-page">
      <div className="edit-donation-header">
        <span className="edit-donation-badge">
          DONOR DASHBOARD
        </span>

        <h1>Edit Donation</h1>

        <p>
          Update your pending donation details before it is
          accepted.
        </p>
      </div>

      {error && (
        <div className="edit-donation-error inline-error">
          ⚠️ {error}
        </div>
      )}

      <form
        className="edit-donation-form"
        onSubmit={handleSubmit}
      >
        {/* IMAGE */}

        <div className="edit-donation-card">
          <div className="card-heading">
            <div className="heading-icon">📷</div>

            <div>
              <span>DONATION IMAGE</span>
              <h2>Update your item photo</h2>
            </div>
          </div>

          <label
            htmlFor="edit-item-image"
            className={
              imagePreview
                ? "edit-upload-box has-preview"
                : "edit-upload-box"
            }
          >
            {imagePreview ? (
              <div className="edit-image-preview">
                <img
                  src={imagePreview}
                  alt="Donation preview"
                />
                <div>Click to change image</div>
              </div>
            ) : (
              <div className="edit-upload-content">
                <div className="upload-icon">📷</div>
                <strong>Upload a donation photo</strong>
                <span>JPG, JPEG or PNG</span>
              </div>
            )}

            <input
              id="edit-item-image"
              type="file"
              name="item_image"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* DONATION DETAILS */}

        <div className="edit-donation-card">
          <div className="card-heading">
            <div className="heading-icon coral-icon">📋</div>

            <div>
              <span>DONATION DETAILS</span>
              <h2>Update your contribution</h2>
            </div>
          </div>

          <div className="edit-two-column">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Example: Rice"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Medical Supplies">
                  Medical Supplies
                </option>
                <option value="School Supplies">
                  School Supplies
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Pickup / Location</label>

            <div className="location-input">
              <span>📍</span>

              <input
                type="text"
                name="location"
                placeholder="Example: Vijayawada"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="4"
              placeholder="Describe your donation..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="edit-donation-actions">
          <button
            type="button"
            className="edit-cancel-button"
            onClick={() => navigate("/my-donations")}
            disabled={saving}
          >
            ← Cancel
          </button>

          <button
            type="submit"
            className="edit-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "✓ Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDonation;
