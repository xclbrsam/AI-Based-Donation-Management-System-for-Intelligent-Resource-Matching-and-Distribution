import { useEffect, useState } from "react";
import api from "../../services/api";
import "./NGODashboard.css";

function NGODashboard() {

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);


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

        <span className="ngo-dashboard-badge">
          NGO DASHBOARD
        </span>

        <h1>
          Donation Requests
        </h1>

        <p>
          Manage donations received by your NGO.
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
          DONATION REQUESTS
      ================================================= */}

      <div className="ngo-donation-section">

        <h2>
          Incoming Donations
        </h2>


        {donations.length === 0 ? (

          <div className="no-donations">

            <div className="no-donations-icon">
              📦
            </div>

            <h3>
              No donation requests yet
            </h3>

            <p>
              Donations sent to your NGO
              will appear here.
            </p>

          </div>

        ) : (

          <div className="ngo-donation-list">

            {donations.map((donation) => (

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
                      {donation.description}
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