import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./DonorDashboard.css";

function DonorDashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // USER DETAILS
  // =====================================================

  const userName =
    localStorage.getItem("user_name") || "Donor";

  const userEmail =
    localStorage.getItem("user_email") || "";

  // =====================================================
  // FETCH DONATIONS
  // =====================================================

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "my-donations/"
        );

        console.log(
          "Dashboard Donations:",
          response.data
        );

        if (Array.isArray(response.data)) {
          setDonations(response.data);
        } else {
          setDonations([]);
        }

      } catch (error) {
        console.error(
          "Dashboard donation fetch error:",
          error
        );

        setDonations([]);

      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalDonations = donations.length;

  const pendingDonations =
    donations.filter(
      (donation) =>
        String(donation.status).toLowerCase() ===
        "pending"
    ).length;

  const acceptedDonations =
    donations.filter(
      (donation) =>
        String(donation.status).toLowerCase() ===
          "accepted" ||
        String(donation.status).toLowerCase() ===
          "collected"
    ).length;

  const collectedDonations =
    donations.filter(
      (donation) =>
        String(donation.status).toLowerCase() ===
        "collected"
    ).length;

  // =====================================================
  // RECENT DONATIONS
  // =====================================================

  const recentDonations =
    donations.slice(0, 4);

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value =
      String(status || "Pending")
        .toLowerCase();

    return `dashboard-status ${value}`;
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    return status || "Pending";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="donor-dashboard-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="dashboard-hero">

        <div className="dashboard-hero-content">

          <span className="dashboard-eyebrow">
            DONOR DASHBOARD
          </span>

          <h1>
            Welcome back,{" "}
            <span>
              {userName}
            </span>{" "}
            👋
          </h1>

          <p>
            Every item you give can become
            something meaningful for someone
            who needs it.
          </p>

        </div>


        <div className="dashboard-hero-actions">

          {/* LOGOUT */}
          <button
            type="button"
            className="dashboard-top-button logout-top-button"
            onClick={() => {

              localStorage.removeItem("access");
              localStorage.removeItem("refresh");

              localStorage.removeItem("user_type");
              localStorage.removeItem("user_id");
              localStorage.removeItem("user_name");
              localStorage.removeItem("user_email");

              navigate("/login", {
                replace: true
              });

            }}
          >
            <span>↪</span>
            Logout
          </button>


          {/* DONATE */}
          <button
            type="button"
            className="dashboard-donate-top-button"
            onClick={() =>
              navigate("/donate-item")
            }
          >
            <span>＋</span>
            Donate an Item
          </button>

        </div>

      </section>


      {/* =================================================
          USER INFO
      ================================================= */}

      <section className="dashboard-user-card">

        <div className="dashboard-user-avatar">
          {userName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="dashboard-user-info">

          <strong>
            {userName}
          </strong>

          <span>
            {userEmail ||
              "Donor account"}
          </span>

        </div>

        <button
          className="profile-button"
          onClick={() =>
            navigate("/profile")
          }
        >
          View Profile →
        </button>

      </section>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="dashboard-stats">

        {/* TOTAL */}

        <div className="stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>

            <span>
              TOTAL DONATIONS
            </span>

            <strong>
              {totalDonations}
            </strong>

            <small>
              Items donated
            </small>

          </div>

        </div>


        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-icon pending-icon">
            ◷
          </div>

          <div>

            <span>
              PENDING
            </span>

            <strong>
              {pendingDonations}
            </strong>

            <small>
              Awaiting NGO review
            </small>

          </div>

        </div>


        {/* ACCEPTED */}

        <div className="stat-card">

          <div className="stat-icon accepted-icon">
            ✓
          </div>

          <div>

            <span>
              ACCEPTED
            </span>

            <strong>
              {acceptedDonations}
            </strong>

            <small>
              Accepted by NGOs
            </small>

          </div>

        </div>


        {/* COLLECTED */}

        <div className="stat-card">

          <div className="stat-icon collected-icon">
            ♥
          </div>

          <div>

            <span>
              COLLECTED
            </span>

            <strong>
              {collectedDonations}
            </strong>

            <small>
              Successfully collected
            </small>

          </div>

        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span>
              GET STARTED
            </span>

            <h2>
              Make your next move
            </h2>

          </div>

        </div>


        <div className="quick-actions">

          {/* DONATE */}

          <button
            className="quick-action donate-action"
            onClick={() =>
              navigate("/donate-item")
            }
          >

            <div className="quick-action-icon">
              📦
            </div>

            <div>

              <h3>
                Donate an Item
              </h3>

              <p>
                Give something useful
                a second life.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          {/* MY DONATIONS */}

          <button
            className="quick-action"
            onClick={() =>
              navigate("/my-donations")
            }
          >

            <div className="quick-action-icon">
              📋
            </div>

            <div>

              <h3>
                My Donations
              </h3>

              <p>
                Track your donated
                items and their status.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          {/* PROFILE */}

          <button
            className="quick-action"
            onClick={() =>
              navigate("/profile")
            }
          >

            <div className="quick-action-icon">
              👤
            </div>

            <div>

              <h3>
                My Profile
              </h3>

              <p>
                View and manage your
                donor information.
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

        </div>

      </section>


      {/* =================================================
          RECENT DONATIONS
      ================================================= */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span>
              YOUR ACTIVITY
            </span>

            <h2>
              Recent donations
            </h2>

          </div>


          {donations.length > 0 && (

            <button
              className="view-all-button"
              onClick={() =>
                navigate("/my-donations")
              }
            >
              View all →
            </button>

          )}

        </div>


        <div className="recent-donations-card">

          {loading ? (

            <div className="dashboard-empty">

              <div className="dashboard-loading">
                <span />
              </div>

              <p>
                Loading your donations...
              </p>

            </div>

          ) : recentDonations.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-dashboard-icon">
                📦
              </div>

              <h3>
                No donations yet
              </h3>

              <p>
                Your donation activity will
                appear here.
              </p>

              <button
                onClick={() =>
                  navigate("/donate-item")
                }
              >
                Make your first donation →
              </button>

            </div>

          ) : (

            <div className="recent-list">

              {recentDonations.map(
                (donation) => (

                  <div
                    className="recent-donation"
                    key={donation.id}
                  >

                    {/* IMAGE */}

                    <div className="recent-image">

                      {donation.item_image ? (

                        <img
                          src={
                            donation.item_image
                          }
                          alt={
                            donation.item_name
                          }
                        />

                      ) : (

                        <span>
                          📦
                        </span>

                      )}

                    </div>


                    {/* INFO */}

                    <div className="recent-info">

                      <strong>
                        {donation.item_name ||
                          "Donation"}
                      </strong>

                      <span>
                        {donation.ngo_name ||
                          "NGO not available"}
                      </span>

                    </div>


                    {/* STATUS */}

                    <span
                      className={getStatusClass(
                        donation.status
                      )}
                    >
                      {getStatusText(
                        donation.status
                      )}
                    </span>


                    {/* DATE */}

                    <span className="recent-date">

                      {donation.donation_date
                        ? new Date(
                            donation.donation_date
                          ).toLocaleDateString()
                        : "--"}

                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          IMPACT CARD
      ================================================= */}

      <section className="dashboard-impact">

        <div className="impact-symbol">
          ♥
        </div>

        <div className="impact-content">

          <span>
            YOUR IMPACT
          </span>

          <h2>
            Small contributions.
            <br />
            Meaningful change.
          </h2>

          <p>
            Every donation helps useful resources
            reach organizations and communities
            that need them.
          </p>

        </div>

        <div className="impact-number">

          <strong>
            {totalDonations}
          </strong>

          <span>
            contributions
          </span>

        </div>

      </section>

    </div>
  );
}

export default DonorDashboard;