import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NGODashboard.css";

function NGODashboard() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");

  const navigate = useNavigate();


  // =====================================================
  // FETCH NGO DONATIONS
  // =====================================================

  const fetchDonations = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "ngo/donations/"
      );

      console.log(
        "NGO Donations:",
        response.data
      );

      setDonations(response.data);

    } catch (error) {

      console.error(
        "========== NGO DASHBOARD ERROR =========="
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
        "========================================="
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchDonations();

  }, []);


  // =====================================================
  // UPDATE DONATION STATUS
  // =====================================================

  const updateStatus = async (
    donationId,
    newStatus
  ) => {

    try {

      setUpdatingId(donationId);

      const response = await api.patch(
        `donation/${donationId}/status/`,
        {
          status: newStatus,
        }
      );

      console.log(
        "Status Updated:",
        response.data
      );


      // Refresh donation list

      await fetchDonations();


      alert(
        `Donation ${newStatus.toLowerCase()} successfully.`
      );

    } catch (error) {

      console.error(
        "========== STATUS UPDATE ERROR =========="
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
        "========================================="
      );


      if (error.response?.data) {

        alert(
          JSON.stringify(
            error.response.data
          )
        );

      } else {

        alert(
          "Unable to update donation status."
        );

      }

    } finally {

      setUpdatingId(null);

    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    navigate("/login", { replace: true });
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingCount =
    donations.filter(
      (item) =>
        item.status === "Pending"
    ).length;


  const acceptedCount =
    donations.filter(
      (item) =>
        item.status === "Accepted"
    ).length;


  const rejectedCount =
    donations.filter(
      (item) =>
        item.status === "Rejected"
    ).length;


  const collectedCount =
    donations.filter(
      (item) =>
        item.status === "Collected"
    ).length;


  // =====================================================
  // REQUESTS & HISTORY
  // =====================================================

  const pendingDonations = donations.filter(
    (item) => item.status === "Pending"
  );

  const donationHistory = donations.filter(
    (item) => item.status !== "Pending"
  );

  const displayedDonations =
    activeTab === "requests"
      ? pendingDonations
      : donationHistory;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="ngo-dashboard-loading">

        <h2>
          Loading NGO Dashboard...
        </h2>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="ngo-dashboard">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ngo-dashboard-header">

        <div className="ngo-header-actions">
          <button
            type="button"
            className="ngo-header-action"
            onClick={() => navigate("/ngo-profile")}
          >
            👤 Profile
          </button>

          <button
            type="button"
            className="ngo-header-action ngo-logout-action"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        <span className="ngo-dashboard-badge">
          NGO DASHBOARD
        </span>

        <h1>
          NGO Donation Management
        </h1>

        <p>
          Review incoming donation requests and manage your complete donation history.
        </p>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="ngo-stats">


        <div className="ngo-stat-card">

          <span>
            ⏳
          </span>

          <h3>
            Pending
          </h3>

          <strong>
            {pendingCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            ✅
          </span>

          <h3>
            Accepted
          </h3>

          <strong>
            {acceptedCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            ❌
          </span>

          <h3>
            Rejected
          </h3>

          <strong>
            {rejectedCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            🚚
          </span>

          <h3>
            Collected
          </h3>

          <strong>
            {collectedCount}
          </strong>

        </div>

      </div>


      {/* =================================================
          REQUESTS / HISTORY TABS
      ================================================= */}

      <div className="ngo-tabs">

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "requests" ? "active" : ""
          }`}
          onClick={() => setActiveTab("requests")}
        >
          📥 Donation Requests
          <span className="ngo-tab-count">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "history" ? "active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          📜 Donation History
          <span className="ngo-tab-count">
            {donationHistory.length}
          </span>
        </button>

      </div>


      {/* =================================================
          REQUESTS / HISTORY
      ================================================= */}

      <div className="ngo-donation-section">

        <div className="ngo-section-heading">
          <div>
            <h2>
              {activeTab === "requests"
                ? "Incoming Donation Requests"
                : "Donation History"}
            </h2>

            <p>
              {activeTab === "requests"
                ? "Pending donations waiting for your decision."
                : "Accepted, rejected and collected donations from your NGO."}
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={fetchDonations}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>


        {displayedDonations.length === 0 ? (

          <div className="no-donations">

            <div className="no-donations-icon">
              📦
            </div>

            <h3>
              {activeTab === "requests"
                ? "No pending donation requests"
                : "No donation history yet"}
            </h3>

            <p>
              {activeTab === "requests"
                ? "New donations sent to your NGO will appear here."
                : "Accepted, rejected and collected donations will appear here."}
            </p>

          </div>

        ) : (

          <div className="ngo-donation-list">

            {displayedDonations.map((donation) => (

              <div
                className="ngo-donation-card"
                key={donation.id}
              >


                {/* ITEM IMAGE */}

                {donation.item_image && (

                  <img
                    src={donation.item_image}
                    alt={donation.item_name}
                    className="donation-item-image"
                  />

                )}


                <div className="ngo-donation-content">


                  {/* ITEM */}

                  <div className="donation-title-row">

                    <h3>
                      {donation.item_name}
                    </h3>

                    <span
                      className={`status status-${donation.status.toLowerCase()}`}
                    >
                      {donation.status}
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="donation-details">

                    <p>
                      <strong>
                        Category:
                      </strong>{" "}
                      {donation.category}
                    </p>

                    <p>
                      <strong>
                        Quantity:
                      </strong>{" "}
                      {donation.quantity}
                    </p>

                    <p>
                      <strong>
                        Condition:
                      </strong>{" "}
                      {donation.condition}
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {donation.location}
                    </p>

                    <p>
                      <strong>
                        Description:
                      </strong>{" "}
                      {donation.description || "Not available"}
                    </p>

                    <p>
                      <strong>
                        Donation Date:
                      </strong>{" "}
                      {donation.donation_date
                        ? new Date(
                            donation.donation_date
                          ).toLocaleString()
                        : "Not available"}
                    </p>

                  </div>


                  {/* DONOR */}

                <div className="donor-information">

  <h4>
    👤 Donor Information
  </h4>

  <p>
    <strong>Name:</strong>{" "}
    {donation.donor_name || "Not available"}
  </p>

  <p>
    <strong>Email:</strong>{" "}
    {donation.donor_email || "Not available"}
  </p>

  <p>
    <strong>Phone:</strong>{" "}
    {donation.donor_phone || "Not available"}
  </p>

  <p>
    <strong>NGO:</strong>{" "}
    {donation.ngo_name || "Not available"}
  </p>

</div>


                  {/* ACTIONS */}

                  {donation.status === "Pending" && (

                    <div className="donation-actions">

                      <button
                        className="accept-button"
                        disabled={
                          updatingId === donation.id
                        }
                        onClick={() =>
                          updateStatus(
                            donation.id,
                            "Accepted"
                          )
                        }
                      >
                        {updatingId === donation.id
                          ? "Updating..."
                          : "✅ Accept"
                        }
                      </button>


                      <button
                        className="reject-button"
                        disabled={
                          updatingId === donation.id
                        }
                        onClick={() =>
                          updateStatus(
                            donation.id,
                            "Rejected"
                          )
                        }
                      >
                        ❌ Reject
                      </button>

                    </div>

                  )}


                  {/* COLLECT BUTTON */}

                  {donation.status === "Accepted" && (

                    <div className="donation-actions">

                      <button
                        className="collect-button"
                        disabled={
                          updatingId === donation.id
                        }
                        onClick={() =>
                          updateStatus(
                            donation.id,
                            "Collected"
                          )
                        }
                      >
                        🚚 Mark as Collected
                      </button>

                    </div>

                  )}

                  {activeTab === "history" && (
                    <div className="history-status-message">
                      {donation.status === "Accepted" && (
                        <span>
                          ✅ Donation accepted by your NGO.
                        </span>
                      )}

                      {donation.status === "Rejected" && (
                        <span>
                          ❌ Donation was rejected.
                        </span>
                      )}

                      {donation.status === "Collected" && (
                        <span>
                          🚚 Donation has been collected.
                        </span>
                      )}
                    </div>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default NGODashboard;