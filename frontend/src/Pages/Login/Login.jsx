import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await loginUser(
        email,
        password
      );

      console.log(
        "Login Success:",
        data
      );

      // =================================================
      // CHECK RESPONSE
      // =================================================

      if (!data) {
        alert("Invalid login response.");
        return;
      }

      if (!data.tokens) {
        alert("Login tokens were not received.");

        console.error(
          "Tokens missing from login response:",
          data
        );

        return;
      }

      // =================================================
      // SAVE TOKENS
      // =================================================

      localStorage.setItem(
        "access",
        data.tokens.access
      );

      localStorage.setItem(
        "refresh",
        data.tokens.refresh
      );

      // =================================================
      // SAVE USER DETAILS
      // =================================================

      localStorage.setItem(
        "user_type",
        data.user_type
      );

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "user_name",
        data.name || ""
      );

      localStorage.setItem(
        "user_email",
        data.email || ""
      );

      // =================================================
      // DEBUG
      // =================================================

      console.log(
        "================================="
      );

      console.log(
        "LOGIN SUCCESS"
      );

      console.log(
        "User Type:",
        data.user_type
      );

      console.log(
        "User ID:",
        data.user_id
      );

      console.log(
        "User Name:",
        data.name
      );

      console.log(
        "User Email:",
        data.email
      );

      console.log(
        "================================="
      );

      // =================================================
      // NORMALIZE USER TYPE
      // =================================================

      const userType = String(
        data.user_type || ""
      )
        .trim()
        .toLowerCase();

      console.log(
        "Normalized User Type:",
        userType
      );

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Login Successful!"
      );

      // =================================================
      // NGO LOGIN
      // =================================================

      if (userType === "ngo") {

        console.log(
          "Redirecting to NGO Dashboard..."
        );

        navigate(
          "/ngo-dashboard"
        );

        return;
      }

      // =================================================
      // DONOR LOGIN
      // =================================================

      if (userType === "donor") {

        console.log(
          "Redirecting to Donor Dashboard..."
        );

        navigate(
          "/dashboard"
        );

        return;
      }

      // =================================================
      // UNKNOWN USER TYPE
      // =================================================

      console.error(
        "Unknown user type:",
        data.user_type
      );

      alert(
        "Unknown user type. Please contact the administrator."
      );

    } catch (error) {

      // =================================================
      // LOGIN ERROR
      // =================================================

      console.log(
        "========== LOGIN ERROR =========="
      );

      console.log(
        error
      );

      console.log(
        "Status:",
        error.response?.status
      );

      console.log(
        "Response:",
        error.response?.data
      );

      console.log(
        "================================="
      );

      if (error.response) {

        alert(
          error.response.data?.message ||
          error.response.data?.detail ||
          "Login Failed"
        );

      } else {

        alert(
          "Cannot connect to backend server"
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
    <div className="login-page">

      {/* =================================================
          LEFT BRAND SECTION
      ================================================= */}

      <section className="login-brand">

        <div className="brand-content">

          {/* LOGO */}

          <div className="brand-logo">

            <span className="brand-logo-icon">
              ✦
            </span>

            <span>
              AI Donations
            </span>

          </div>


          {/* BRAND MESSAGE */}

          <div className="brand-message">

            <p className="brand-eyebrow">
              GIVE • CONNECT • IMPACT
            </p>

            <h1>
              Give more.
              <br />
              Waste less.
              <br />

              <span>
                Create impact.
              </span>

            </h1>

            <p className="brand-description">
              Connect useful resources with people
              and organizations that need them.
              Every contribution has the power to
              create a meaningful difference.
            </p>

          </div>


          {/* IMPACT CARD */}

          <div className="impact-card">

            <div className="impact-icon">
              ♥
            </div>

            <div>

              <strong>
                Every donation matters.
              </strong>

              <span>
                Your unused items can become
                someone else's opportunity.
              </span>

            </div>

          </div>

        </div>


        {/* DECORATIONS */}

        <div
          className="brand-decoration decoration-one"
        />

        <div
          className="brand-decoration decoration-two"
        />

      </section>


      {/* =================================================
          RIGHT LOGIN SECTION
      ================================================= */}

      <section className="login-section">

        <div className="login-card">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="login-header">

            <span className="mobile-logo">
              ✦ AI Donations
            </span>

            <p className="login-eyebrow">
              WELCOME BACK
            </p>

            <h2>
              Sign in to continue
            </h2>

            <p>
              Access your donations, profile
              and impact dashboard.
            </p>

          </div>


          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon" aria-hidden="true">
                  ✉️
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-group">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    alert(
                      "Password reset will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "◉"
                    : "○"}
                </button>

              </div>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner" />

                  <span>
                    Signing in...
                  </span>
                </>

              ) : (

                <>
                  <span>
                    Sign In
                  </span>

                  <span className="button-arrow">
                    →
                  </span>
                </>

              )}

            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="register-prompt">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Create an account
            </button>

          </div>


          {/* =================================================
              FOOTER
          ================================================= */}

          <p className="login-footer">

            By continuing, you agree to our

            <span>
              {" "}Terms{" "}
            </span>

            and

            <span>
              {" "}Privacy Policy.
            </span>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;