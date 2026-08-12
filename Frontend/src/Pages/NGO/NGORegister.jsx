import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/registerService";
import "./NGORegister.css";

function NGORegister() {
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    ngo_name: "",
    description: "",
    registration_number: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    language: "English",
    password: "",
    confirmPassword: "",
    certificate: null,
    logo: null,
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================================
    // PASSWORD CHECK
    // ===================================================

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    // ===================================================
    // PHONE CHECK
    // ===================================================

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must contain exactly 10 digits.");
      return;
    }

    // ===================================================
    // PINCODE CHECK
    // ===================================================

    if (!/^\d{6}$/.test(formData.pincode)) {
      alert("Pincode must contain exactly 6 digits.");
      return;
    }

    // ===================================================
    // CERTIFICATE CHECK
    // ===================================================

    if (!formData.certificate) {
      alert("Please upload NGO Certificate.");
      return;
    }

    // ===================================================
    // LOGO CHECK
    // ===================================================

    if (!formData.logo) {
      alert("Please upload NGO Logo.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // CREATE FORMDATA
      // =================================================

      const data = new FormData();

      // -------------------------------------------------
      // NGO DETAILS
      // -------------------------------------------------

      data.append(
        "ngo_name",
        formData.ngo_name
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "registration_no",
        formData.registration_number
      );

      data.append(
        "email_id",
        formData.email
      );

      data.append(
        "phone_no",
        formData.phone
      );

      // Website is optional
      if (formData.website) {
        data.append(
          "website_link",
          formData.website
        );
      }

      data.append(
        "address",
        formData.address
      );

      data.append(
        "city",
        formData.city
      );

      data.append(
        "state",
        formData.state
      );

      data.append(
        "pincode",
        formData.pincode
      );

      data.append(
        "language",
        formData.language
      );

      data.append(
        "password",
        formData.password
      );

      // -------------------------------------------------
      // NGO CERTIFICATE
      // -------------------------------------------------

      data.append(
        "certificate_files",
        formData.certificate
      );

      // -------------------------------------------------
      // NGO LOGO
      // -------------------------------------------------

      data.append(
        "picture",
        formData.logo
      );

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "========== NGO REGISTRATION DATA =========="
      );

      for (const [key, value] of data.entries()) {
        console.log(
          key,
          value
        );
      }

      console.log(
        "==========================================="
      );

      // =================================================
      // SEND TO BACKEND
      // =================================================

      const response = await registerUser(
        "ngo",
        data
      );

      console.log(
        "NGO Registration Success:",
        response
      );

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "NGO Registered Successfully! 🏢📄"
      );

      navigate("/login");

    } catch (error) {

      // =================================================
      // ERROR
      // =================================================

      console.log(
        "========== NGO REGISTRATION ERROR =========="
      );

      console.log(error);

      console.log(
        "Status:",
        error.response?.status
      );

      console.log(
        "Response:",
        error.response?.data
      );

      console.log(
        "============================================"
      );

      if (error.response?.data) {
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
  // PAGE
  // =====================================================

  return (
    <div className="ngo-register-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="register-header">

        <h1>
          NGO Registration
        </h1>

        <p>
          Register your organization and connect with donors.
        </p>

      </div>


      {/* =================================================
          ACCOUNT TYPE
      ================================================= */}

      <div className="account-type-section">

        <label>
          Register As
        </label>

        <div className="account-type-buttons">

          {/* DONOR */}

          <button
            type="button"
            className="account-type"
            onClick={() =>
              navigate("/register/donor")
            }
          >
            <span>
              👤
            </span>

            <span>
              Donor
            </span>
          </button>


          {/* NGO */}

          <button
            type="button"
            className="account-type active"
          >
            <span>
              🏢
            </span>

            <span>
              NGO
            </span>
          </button>

        </div>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >

        {/* NGO NAME */}

        <input
          type="text"
          name="ngo_name"
          placeholder="NGO Name"
          value={formData.ngo_name}
          onChange={handleChange}
          required
        />


        {/* DESCRIPTION */}

        <textarea
          name="description"
          placeholder="Describe your NGO"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />


        {/* REGISTRATION NUMBER */}

        <input
          type="text"
          name="registration_number"
          placeholder="Registration Number"
          value={formData.registration_number}
          onChange={handleChange}
          required
        />


        {/* EMAIL */}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />


        {/* PHONE */}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          maxLength="10"
          pattern="[0-9]{10}"
          required
        />


        {/* WEBSITE */}

        <input
          type="url"
          name="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={handleChange}
        />


        {/* ADDRESS */}

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
          required
        />


        {/* CITY */}

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />


        {/* STATE */}

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />


        {/* PINCODE */}

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode}
          onChange={handleChange}
          maxLength="6"
          pattern="[0-9]{6}"
          required
        />


        {/* LANGUAGE */}

        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          required
        >
          <option value="English">
            English
          </option>

          <option value="Telugu">
            Telugu
          </option>

          <option value="Hindi">
            Hindi
          </option>

          <option value="Tamil">
            Tamil
          </option>

          <option value="Kannada">
            Kannada
          </option>
        </select>


        {/* =================================================
            CERTIFICATE
        ================================================= */}

        <div className="file-field">

          <label>
            📄 NGO Certificate
          </label>

          <input
            type="file"
            name="certificate"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />

          <small>
            Upload PDF, JPG, JPEG or PNG.
          </small>

        </div>


        {/* =================================================
            LOGO
        ================================================= */}

        <div className="file-field">

          <label>
            🖼️ NGO Logo
          </label>

          <input
            type="file"
            name="logo"
            onChange={handleChange}
            accept="image/*"
            required
          />

          <small>
            Upload your NGO logo.
          </small>

        </div>


        {/* PASSWORD */}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />


        {/* CONFIRM PASSWORD */}

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />


        {/* SUBMIT */}

        <button
          type="submit"
          className="register-submit"
          disabled={loading}
        >
          {loading
            ? "Creating NGO Account..."
            : "Create NGO Account"}
        </button>

      </form>

    </div>
  );
}

export default NGORegister;