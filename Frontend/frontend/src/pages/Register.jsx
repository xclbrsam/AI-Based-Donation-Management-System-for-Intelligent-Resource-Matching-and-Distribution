import { useState } from "react";

import {
  ArrowLeft,
  Building2,
  Eye,
  EyeOff,
  Heart,
  HeartHandshake,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import "../styles/Auth.css";


function Register() {

  const navigate = useNavigate();


  const [accountType, setAccountType] =
    useState("user");


  const [showPassword, setShowPassword] =
    useState(false);


  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  // =====================================
  // COMMON FORM DATA
  // =====================================

  const [formData, setFormData] = useState({

    username: "",
    email: "",
    phone: "",

    password: "",
    confirmPassword: "",

    // NGO fields

    ngo_name: "",
    registration_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    website: "",
    description: "",

  });


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData((previous) => ({

      ...previous,

      [name]: value,

    }));

  };


  // =====================================
  // ACCOUNT TYPE
  // =====================================

  const changeAccountType = (type) => {

    setAccountType(type);

    setError("");

    setSuccess("");

  };


  // =====================================
  // REGISTRATION
  // =====================================

  const handleRegister = async (e) => {

    e.preventDefault();


    setError("");
    setSuccess("");


    // -------------------------------------
    // Basic validation
    // -------------------------------------

    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError(
        "Please fill in all required fields."
      );

      return;

    }


    // -------------------------------------
    // Password confirmation
    // -------------------------------------

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;

    }


    // -------------------------------------
    // Phone validation
    // -------------------------------------

    if (
      !/^\d{10}$/.test(
        formData.phone
      )
    ) {

      setError(
        "Phone number must contain exactly 10 digits."
      );

      return;

    }


    setLoading(true);


    try {

      // ===================================
      // STEP 1
      // REGISTER USER
      // ===================================

      await api.post(
        "/register/",
        {
          username:
            formData.username,

          email:
            formData.email,

          password:
            formData.password,

          phone:
            formData.phone,

          role:
            accountType === "user"
              ? "Donor"
              : "NGO",
        }
      );


      // ===================================
      // STEP 2
      // LOGIN AUTOMATICALLY
      // ===================================

      const loginResponse =
        await api.post(
          "/login/",
          {
            username:
              formData.username,

            password:
              formData.password,
          }
        );


      const loginData =
        loginResponse.data;


      // ===================================
      // SAVE JWT
      // ===================================

      localStorage.setItem(
        "access_token",
        loginData.tokens.access
      );

      localStorage.setItem(
        "refresh_token",
        loginData.tokens.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loginData.user
        )
      );

      localStorage.setItem(
        "role",
        loginData.user.role
      );


      // ===================================
      // STEP 3
      // SAVE PROFILE DATA
      // ===================================

      if (
        accountType === "ngo"
      ) {

        await api.put(
          "/profile/",
          {
            ngo_name:
              formData.ngo_name,

            registration_number:
              formData.registration_number,

            address:
              formData.address,

            city:
              formData.city,

            state:
              formData.state,

            pincode:
              formData.pincode,

            website:
              formData.website,

            description:
              formData.description,
          },
          {
            headers: {
              Authorization:
                `Bearer ${loginData.tokens.access}`,
            },
          }
        );

      }


      // ===================================
      // SUCCESS
      // ===================================

      setSuccess(
        accountType === "ngo"
          ? "NGO registered successfully!"
          : "Donor account created successfully!"
      );


      // ===================================
      // TEMPORARY REDIRECT
      // ===================================

      setTimeout(() => {

        navigate("/");

      }, 1200);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      if (error.response) {

        const data =
          error.response.data;


        // --------------------------------
        // Django serializer errors
        // --------------------------------

        if (
          typeof data === "object"
        ) {

          const messages = [];


          Object.entries(data).forEach(
            ([field, value]) => {

              if (Array.isArray(value)) {

                messages.push(
                  `${field}: ${value.join(", ")}`
                );

              } else {

                messages.push(
                  `${field}: ${value}`
                );

              }

            }
          );


          if (messages.length > 0) {

            setError(
              messages.join(" | ")
            );

          } else {

            setError(
              "Registration failed."
            );

          }

        } else {

          setError(
            "Registration failed."
          );

        }

      } else {

        setError(
          "Unable to connect to the server. Make sure Django is running."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="auth-page register-page">


      {/* ===================================
          LEFT SIDE
      =================================== */}

      <div className="auth-left">

        <Link
          to="/"
          className="auth-logo"
        >

          <div className="auth-logo-icon">

            <HeartHandshake size={25} />

          </div>

          <div>

            <h2>
              KindLink
            </h2>

            <span>
              AI Donation Platform
            </span>

          </div>

        </Link>


        <div className="auth-quote">

          <div className="quote-mark">
            "
          </div>

          <h1>

            Your kindness
            <br />

            <span>
              can change lives.
            </span>

          </h1>

          <p>

            Whether you are an individual donor
            or an organization helping communities,
            KindLink connects generosity with real needs.

          </p>

        </div>


        <div className="auth-left-bottom">

          <Heart size={20} />

          <span>
            Together, we can make every donation count.
          </span>

        </div>

      </div>


      {/* ===================================
          RIGHT SIDE
      =================================== */}

      <div className="auth-right">


        <Link
          to="/"
          className="back-home"
        >

          <ArrowLeft size={17} />

          Back to Home

        </Link>


        <div className="register-container">


          <div className="mobile-logo">

            <div className="auth-logo-icon">

              <HeartHandshake size={23} />

            </div>

            <h2>
              KindLink
            </h2>

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <span className="auth-label">
              GET STARTED
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Choose how you want to use KindLink.
            </p>

          </div>


          {/* ACCOUNT TYPE */}

          <div className="account-selector">


            <button
              type="button"
              className={
                accountType === "user"
                  ? "account-option active"
                  : "account-option"
              }
              onClick={() =>
                changeAccountType("user")
              }
            >

              <span className="account-icon">

                <User size={17} />

              </span>

              <div>

                <strong>
                  Donor
                </strong>

                <small>
                  Donate items
                </small>

              </div>

            </button>


            <button
              type="button"
              className={
                accountType === "ngo"
                  ? "account-option active"
                  : "account-option"
              }
              onClick={() =>
                changeAccountType("ngo")
              }
            >

              <span className="account-icon">

                <Building2 size={17} />

              </span>

              <div>

                <strong>
                  NGO
                </strong>

                <small>
                  Manage needs
                </small>

              </div>

            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="auth-error">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="auth-success">
              {success}
            </div>

          )}


          {/* ===================================
              DONOR FORM
          =================================== */}

          {accountType === "user" && (

            <form
              className="auth-form register-form"
              onSubmit={handleRegister}
            >


              <div className="form-group">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />

              </div>


              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit phone number"
                  maxLength="10"
                />

              </div>


              <div className="form-group">

                <label>
                  Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Confirm Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              <label className="terms-checkbox">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the Terms &
                  Conditions and Privacy Policy.
                </span>

              </label>


              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >

                {loading
                  ? "Creating Account..."
                  : "Create Donor Account"}

              </button>

            </form>

          )}


          {/* ===================================
              NGO FORM
          =================================== */}

          {accountType === "ngo" && (

            <form
              className="auth-form register-form"
              onSubmit={handleRegister}
            >


              <div className="form-group">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose NGO username"
                />

              </div>


              <div className="form-group">

                <label>
                  NGO / Organization Name
                </label>

                <input
                  type="text"
                  name="ngo_name"
                  value={formData.ngo_name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
                />

              </div>


              <div className="form-group">

                <label>
                  NGO Registration Number
                </label>

                <input
                  type="text"
                  name="registration_number"
                  value={
                    formData.registration_number
                  }
                  onChange={handleChange}
                  placeholder="Enter registration number"
                />

              </div>


              <div className="form-group">

                <label>
                  Official Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter official NGO email"
                />

              </div>


              <div className="form-group">

                <label>
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digit phone number"
                  maxLength="10"
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                </div>


                <div className="form-group">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                </div>

              </div>


              <div className="form-group">

                <label>
                  Organization Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Complete organization address"
                  rows="2"
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                  />

                </div>

              </div>


              <div className="form-group">

                <label>
                  Organization Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe your NGO and its work"
                  rows="3"
                />

              </div>


              <div className="form-group">

                <label>
                  Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              <div className="form-group">

                <label>
                  Confirm Password
                </label>

                <div className="password-input">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              <label className="terms-checkbox">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I confirm that the information
                  provided belongs to a legitimate
                  organization.
                </span>

              </label>


              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >

                {loading
                  ? "Registering NGO..."
                  : "Register NGO"}

              </button>

            </form>

          )}


          {/* LOGIN */}

          <div className="register-prompt">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>


        </div>

      </div>

    </div>

  );
}

export default Register;