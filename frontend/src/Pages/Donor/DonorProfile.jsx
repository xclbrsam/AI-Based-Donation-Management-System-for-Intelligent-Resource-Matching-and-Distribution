import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./DonorProfile.css";

function DonorProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH DONOR PROFILE
  // =====================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const userId =
          localStorage.getItem("user_id");

        console.log(
          "Fetching donor profile:",
          userId
        );

        /*
         * We use the logged-in donor ID.
         * Change the endpoint only if your backend
         * uses a different profile URL.
         */

        const response = await api.get(
          `donor/${userId}/`
        );

        console.log(
          "Donor Profile:",
          response.data
        );

        setProfile(response.data);

      } catch (error) {
        console.error(
          "========== PROFILE ERROR =========="
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
          "==================================="
        );

        /*
         * Fallback to localStorage so the page
         * can still display basic information.
         */

        setProfile({
          name:
            localStorage.getItem(
              "user_name"
            ) || "Donor",

          email:
            localStorage.getItem(
              "user_email"
            ) || "",

          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          language_preference:
            "English",
        });

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-loading">

        <div className="profile-spinner" />

        <p>
          Loading your profile...
        </p>

      </div>
    );
  }

  // =====================================================
  // PROFILE DATA
  // =====================================================

  const name =
    profile?.name ||
    localStorage.getItem("user_name") ||
    "Donor";

  const email =
    profile?.email ||
    localStorage.getItem("user_email") ||
    "Not available";

  const phone =
    profile?.phone ||
    "Not available";

  const address =
    profile?.address ||
    "Not available";

  const city =
    profile?.city ||
    "Not available";

  const state =
    profile?.state ||
    "Not available";

  const pincode =
    profile?.pincode ||
    "Not available";

  const language =
    profile?.language_preference ||
    "English";

  // =====================================================
  // INITIAL
  // =====================================================

  const initial =
    name.charAt(0).toUpperCase();

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="donor-profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="profile-hero">

        <div className="profile-hero-content">

          <span className="profile-eyebrow">
            DONOR PROFILE
          </span>

          <h1>
            Your profile
          </h1>

          <p>
            Manage your personal information
            and keep your donation account
            up to date.
          </p>

        </div>

        <div className="profile-hero-symbol">
          👤
        </div>

      </section>


      {/* =================================================
          PROFILE MAIN
      ================================================= */}

      <div className="profile-layout">

        {/* =================================================
            LEFT PROFILE CARD
        ================================================= */}

        <aside className="profile-summary">

          <div className="profile-avatar">
            {initial}
          </div>

          <h2>
            {name}
          </h2>

          <p>
            {email}
          </p>

          <div className="profile-role">
            ● DONOR ACCOUNT
          </div>

          <div className="profile-divider" />

          <div className="profile-summary-item">

            <span>
              Member
            </span>

            <strong>
              Donor
            </strong>

          </div>

          <div className="profile-summary-item">

            <span>
              Language
            </span>

            <strong>
              {language}
            </strong>

          </div>

        </aside>


        {/* =================================================
            RIGHT DETAILS
        ================================================= */}

        <main className="profile-details">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="profile-card">

            <div className="profile-card-heading">

              <div className="profile-card-icon">
                👤
              </div>

              <div>

                <span>
                  PERSONAL INFORMATION
                </span>

                <h2>
                  Basic details
                </h2>

              </div>

            </div>


            <div className="profile-info-grid">

              <div className="profile-info">

                <span>
                  Full Name
                </span>

                <strong>
                  {name}
                </strong>

              </div>


              <div className="profile-info">

                <span>
                  Email Address
                </span>

                <strong>
                  {email}
                </strong>

              </div>


              <div className="profile-info">

                <span>
                  Phone Number
                </span>

                <strong>
                  {phone}
                </strong>

              </div>


              <div className="profile-info">

                <span>
                  Preferred Language
                </span>

                <strong>
                  {language}
                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              LOCATION
          ================================================= */}

          <section className="profile-card">

            <div className="profile-card-heading">

              <div className="profile-card-icon coral">
                📍
              </div>

              <div>

                <span>
                  LOCATION
                </span>

                <h2>
                  Address details
                </h2>

              </div>

            </div>


            <div className="profile-address">

              <div className="address-icon">
                📍
              </div>

              <div>

                <span>
                  Address
                </span>

                <strong>
                  {address}
                </strong>

              </div>

            </div>


            <div className="profile-info-grid location-grid">

              <div className="profile-info">

                <span>
                  City
                </span>

                <strong>
                  {city}
                </strong>

              </div>


              <div className="profile-info">

                <span>
                  State
                </span>

                <strong>
                  {state}
                </strong>

              </div>


              <div className="profile-info">

                <span>
                  Pincode
                </span>

                <strong>
                  {pincode}
                </strong>

              </div>

            </div>

          </section>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <section className="profile-card account-card">

            <div className="profile-card-heading">

              <div className="profile-card-icon">
                🔐
              </div>

              <div>

                <span>
                  ACCOUNT
                </span>

                <h2>
                  Account settings
                </h2>

              </div>

            </div>


            <div className="account-actions">

              <button
                className="edit-profile-button"
                onClick={() =>
                  navigate(
                    "/profile/edit"
                  )
                }
              >
                ✎
                <span>
                  Edit Profile
                </span>
                →
              </button>


              <button
                className="dashboard-button"
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
              >
                ←
                <span>
                  Back to Dashboard
                </span>
              </button>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default DonorProfile;