import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./DonateItem.css";

function DonateItem() {
  const navigate = useNavigate();

  // =====================================================
  // LOGGED-IN DONOR
  // =====================================================

  const donorName = localStorage.getItem("user_name");
  const donorEmail = localStorage.getItem("user_email");

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    ngo: "",
    item_name: "",
    category: "Clothing",
    quantity: 1,
    condition: "Good",
    description: "",
    location: "",
    item_image: null,
  });

  // =====================================================
  // NGO DATA
  // =====================================================

  const [ngos, setNgos] = useState([]);
  const [ngoLoading, setNgoLoading] = useState(true);
  const [ngoError, setNgoError] = useState("");

  // =====================================================
  // DONATION LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  const [imagePreview, setImagePreview] = useState(null);

  // =====================================================
  // FETCH APPROVED NGOS
  // =====================================================

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setNgoLoading(true);
        setNgoError("");

        const token = localStorage.getItem("access");

        if (!token) {
          setNgoError("Please login first.");
          return;
        }

        console.log("Fetching approved NGOs...");

        const response = await api.get("ngos/");

        console.log(
          "NGO API Status:",
          response.status
        );

        console.log(
          "Approved NGOs:",
          response.data
        );

        if (Array.isArray(response.data)) {
          setNgos(response.data);
        } else {
          console.error(
            "Unexpected NGO response:",
            response.data
          );

          setNgoError(
            "Invalid NGO data received from server."
          );
        }

      } catch (error) {
        console.error(
          "========== NGO FETCH ERROR =========="
        );

        console.error(error);

        console.error(
          "Status:",
          error.response?.status
        );

        console.error(
          "Response:",
          error.response?.data
        );

        console.error(
          "URL:",
          error.config?.url
        );

        console.error(
          "====================================="
        );

        if (error.response?.status === 401) {
          setNgoError(
            "Your login session has expired. Please login again."
          );
        } else if (error.response?.status === 403) {
          setNgoError(
            "You do not have permission to view NGOs."
          );
        } else if (error.response?.status === 404) {
          setNgoError(
            "NGO API endpoint was not found."
          );
        } else if (error.response?.status === 500) {
          setNgoError(
            "Server error while loading NGOs."
          );
        } else {
          setNgoError(
            "Unable to connect to backend server."
          );
        }

      } finally {
        setNgoLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    if (files) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        setImagePreview(
          URL.createObjectURL(file)
        );
      }

    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =====================================================
  // SUBMIT DONATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // CHECK NGO
    // ---------------------------------------------------

    if (!formData.ngo) {
      alert("Please select an NGO.");
      return;
    }

    // ---------------------------------------------------
    // CHECK ITEM NAME
    // ---------------------------------------------------

    if (!formData.item_name.trim()) {
      alert("Please enter the item name.");
      return;
    }

    // ---------------------------------------------------
    // CHECK QUANTITY
    // ---------------------------------------------------

    if (Number(formData.quantity) < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "ngo",
        formData.ngo
      );

      data.append(
        "item_name",
        formData.item_name
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "quantity",
        formData.quantity
      );

      data.append(
        "condition",
        formData.condition
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "location",
        formData.location
      );

      if (formData.item_image) {
        data.append(
          "item_image",
          formData.item_image
        );
      }

      console.log(
        "Submitting donation..."
      );

      const response = await api.post(
        "donation/",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Donation Created:",
        response.data
      );

      alert(
        "Item donation submitted successfully! 📦"
      );

      navigate("/my-donations");

    } catch (error) {
      console.error(
        "========== DONATION ERROR =========="
      );

      console.error(error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "===================================="
      );

      if (error.response?.status === 401) {
        alert(
          "Your login session has expired. Please login again."
        );
      } else if (error.response?.data) {
        alert(
          JSON.stringify(
            error.response.data
          )
        );
      } else {
        alert(
          "Cannot connect to backend server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SELECTED NGO
  // =====================================================

  const selectedNGO = ngos.find(
    (ngo) =>
      String(ngo.id) ===
      String(formData.ngo)
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="donate-page">

      {/* =================================================
          HERO
      ================================================= */}

      <div className="donate-hero">

        <div>

          <span className="donate-badge">
            MAKE A DIFFERENCE
          </span>

          <h1>
            Donate an item.
            <br />
            <span>Create an impact.</span>
          </h1>

          <p>
            Give useful things a second life by
            connecting them with people and
            organizations that need them.
          </p>

        </div>

        <div className="hero-heart">
          ♥
        </div>

      </div>


      {/* =================================================
          MAIN FORM
      ================================================= */}

      <form
        className="donate-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            DONOR CARD
        ================================================= */}

        <div className="donate-card donor-card">

          <div className="card-heading">

            <div className="heading-icon">
              👤
            </div>

            <div>
              <span>
                DONOR
              </span>

              <h2>
                Your contribution
              </h2>
            </div>

          </div>

          <div className="donor-information">

            <div className="donor-avatar">
              {donorName
                ? donorName.charAt(0).toUpperCase()
                : "D"}
            </div>

            <div>

              <strong>
                {donorName ||
                  "Logged-in donor"}
              </strong>

              <span>
                {donorEmail ||
                  "Your donation account"}
              </span>

            </div>

            <div className="verified-label">
              ✓ Logged in
            </div>

          </div>

        </div>


        {/* =================================================
            NGO SECTION
        ================================================= */}

        <div className="donate-card">

          <div className="card-heading">

            <div className="heading-icon coral-icon">
              🏢
            </div>

            <div>
              <span>
                DESTINATION
              </span>

              <h2>
                Where should it go?
              </h2>
            </div>

          </div>


          <div className="form-group">

            <label>
              Select an approved NGO
            </label>

            <select
              name="ngo"
              value={formData.ngo}
              onChange={handleChange}
              required
              disabled={
                ngoLoading ||
                ngos.length === 0
              }
            >

              <option value="">
                {ngoLoading
                  ? "Loading approved NGOs..."
                  : ngos.length === 0
                  ? "No approved NGOs available"
                  : "Choose an NGO"}
              </option>

              {ngos.map((ngo) => (

                <option
                  key={ngo.id}
                  value={ngo.id}
                >
                  {ngo.ngo_name}
                </option>

              ))}

            </select>

            {ngoError && (
              <small className="error-message">
                {ngoError}
              </small>
            )}

            {!ngoLoading &&
              !ngoError &&
              ngos.length > 0 && (
                <small>
                  Choose the organization
                  that should receive your item.
                </small>
              )}

          </div>


          {/* SELECTED NGO PREVIEW */}

          {selectedNGO && (

            <div className="selected-ngo">

              <div className="selected-ngo-icon">
                🏢
              </div>

              <div>

                <strong>
                  {selectedNGO.ngo_name}
                </strong>

                <span>
                  Approved organization
                </span>

              </div>

              <span className="approved-badge">
                ✓ Approved
              </span>

            </div>

          )}

        </div>


        {/* =================================================
            ITEM DETAILS
        ================================================= */}

        <div className="donate-card">

          <div className="card-heading">

            <div className="heading-icon coral-icon">
              📦
            </div>

            <div>
              <span>
                ITEM DETAILS
              </span>

              <h2>
                Tell us about your donation
              </h2>
            </div>

          </div>


          <div className="two-column">

            {/* ITEM NAME */}

            <div className="form-group">

              <label>
                Item name
              </label>

              <input
                type="text"
                name="item_name"
                placeholder="Example: Winter Clothes"
                value={formData.item_name}
                onChange={handleChange}
                required
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="Clothing">
                  Clothing
                </option>

                <option value="Books">
                  Books
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Furniture">
                  Furniture
                </option>

                <option value="Medical Supplies">
                  Medical Supplies
                </option>

                <option value="School Supplies">
                  School Supplies
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* QUANTITY */}

            <div className="form-group">

              <label>
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />

            </div>


            {/* CONDITION */}

            <div className="form-group">

              <label>
                Condition
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >

                <option value="New">
                  New
                </option>

                <option value="Like New">
                  Like New
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Used">
                  Used
                </option>

              </select>

            </div>

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the item, its size, condition, quantity, or anything the NGO should know..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>


          {/* LOCATION */}

          <div className="form-group">

            <label>
              Pickup / Location
            </label>

            <div className="location-input">

              <span>
                📍
              </span>

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

        </div>


        {/* =================================================
            IMAGE UPLOAD
        ================================================= */}

        <div className="donate-card">

          <div className="card-heading">

            <div className="heading-icon coral-icon">
              📷
            </div>

            <div>
              <span>
                ITEM PHOTO
              </span>

              <h2>
                Show what you're donating
              </h2>
            </div>

          </div>


          <label
            htmlFor="item-image"
            className={
              imagePreview
                ? "upload-box has-preview"
                : "upload-box"
            }
          >

            {imagePreview ? (

              <div className="image-preview-wrapper">

                <img
                  src={imagePreview}
                  alt="Donation preview"
                />

                <div className="change-image">
                  Click to change image
                </div>

              </div>

            ) : (

              <div className="upload-content">

                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  Upload a photo
                </strong>

                <span>
                  Click here to choose an image
                </span>

                <small>
                  JPG, JPEG or PNG
                </small>

              </div>

            )}

            <input
              id="item-image"
              type="file"
              name="item_image"
              accept="image/*"
              onChange={handleChange}
            />

          </label>

        </div>


        {/* =================================================
            FINAL ACTION
        ================================================= */}

        <div className="donate-action">

          <div className="action-message">

            <span>
              ♥
            </span>

            <div>
              <strong>
                Ready to make a difference?
              </strong>

              <p>
                Your donation will be sent to
                the selected NGO for review.
              </p>
            </div>

          </div>


          <button
            type="submit"
            className="donate-submit"
            disabled={
              loading ||
              ngoLoading ||
              ngos.length === 0
            }
          >

            {loading ? (
              <>
                <span className="donate-spinner" />
                Submitting...
              </>
            ) : (
              <>
                Donate Item
                <span>
                  →
                </span>
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}

export default DonateItem;