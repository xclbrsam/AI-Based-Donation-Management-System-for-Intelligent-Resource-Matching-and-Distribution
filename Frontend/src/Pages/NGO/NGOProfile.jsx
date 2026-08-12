import { useEffect, useState } from "react";
import api from "../../services/api";
import "./NGOProfile.css";

function NGOProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH NGO PROFILE
  // =====================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("profile/");

      console.log("NGO Profile:", response.data);

      setProfile(response.data);

    } catch (error) {

      console.error(
        "========== NGO PROFILE ERROR =========="
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
        "======================================="
      );

      setError(
        error.response?.data?.detail ||
        "Unable to load NGO profile."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="ngo-profile-page">

        <div className="ngo-profile-card">

          <h2>
            Loading NGO Profile...
          </h2>

        </div>

      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="ngo-profile-page">

        <div className="ngo-profile-card">

          <h2>
            ⚠️ Profile Error
          </h2>

          <p>
            {error}
          </p>

          <button onClick={fetchProfile}>
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // NO PROFILE
  // =====================================================

  if (!profile) {
    return (
      <div className="ngo-profile-page">

        <div className="ngo-profile-card">

          <h2>
            No NGO Profile Found
          </h2>

        </div>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="ngo-profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ngo-profile-header">

        <span className="ngo-profile-badge">
          NGO PROFILE
        </span>

        <h1>
          {profile.ngo_name || "NGO Profile"}
        </h1>

        <p>
          Manage and view your organization information.
        </p>

      </div>


      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="ngo-profile-card">


        {/* =================================================
            NGO LOGO
        ================================================= */}

        <div className="ngo-logo-section">

          {profile.picture ? (

            <img
              src={profile.picture}
              alt={profile.ngo_name}
              className="ngo-logo"
            />

          ) : (

            <div className="ngo-logo-placeholder">
              🏢
            </div>

          )}

        </div>


        {/* =================================================
            NGO NAME
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🏢 NGO Name
          </strong>

          <span>
            {profile.ngo_name || "-"}
          </span>

        </div>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📝 Description
          </strong>

          <span>
            {profile.description || "-"}
          </span>

        </div>


        {/* =================================================
            REGISTRATION NUMBER
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📋 Registration Number
          </strong>

          <span>
            {profile.registration_no || "-"}
          </span>

        </div>


        {/* =================================================
            EMAIL
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📧 Email
          </strong>

          <span>
            {profile.email_id || "-"}
          </span>

        </div>


        {/* =================================================
            PHONE
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📞 Phone
          </strong>

          <span>
            {profile.phone_no || "-"}
          </span>

        </div>


        {/* =================================================
            WEBSITE
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🌐 Website
          </strong>

          <span>
            {profile.website_link || "-"}
          </span>

        </div>


        {/* =================================================
            ADDRESS
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📍 Address
          </strong>

          <span>
            {profile.address || "-"}
          </span>

        </div>


        {/* =================================================
            CITY
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🏙️ City
          </strong>

          <span>
            {profile.city || "-"}
          </span>

        </div>


        {/* =================================================
            STATE
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🌎 State
          </strong>

          <span>
            {profile.state || "-"}
          </span>

        </div>


        {/* =================================================
            PINCODE
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            📮 Pincode
          </strong>

          <span>
            {profile.pincode || "-"}
          </span>

        </div>


        {/* =================================================
            LANGUAGE
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🗣️ Language
          </strong>

          <span>
            {profile.language || "-"}
          </span>

        </div>


        {/* =================================================
            NGO STATUS
        ================================================= */}

        <div className="ngo-profile-field">

          <strong>
            🔐 Verification Status
          </strong>

          <span
            className={
              `ngo-status ngo-status-${(
                profile.status || "Pending"
              ).toLowerCase()}`
            }
          >
            {profile.status || "Pending"}
          </span>

        </div>


        {/* =================================================
            CERTIFICATE
        ================================================= */}

        <div className="ngo-certificate-section">

          <h3>
            📄 NGO Certificate
          </h3>

          {profile.certificate_files ? (

            <a
              href={profile.certificate_files}
              target="_blank"
              rel="noopener noreferrer"
              className="certificate-button"
            >
              📄 View Certificate
            </a>

          ) : (

            <p>
              Certificate not available.
            </p>

          )}

        </div>


        {/* =================================================
            REFRESH
        ================================================= */}

        <button
          className="ngo-refresh-button"
          onClick={fetchProfile}
        >
          🔄 Refresh Profile
        </button>

      </div>

    </div>
  );
}

export default NGOProfile;