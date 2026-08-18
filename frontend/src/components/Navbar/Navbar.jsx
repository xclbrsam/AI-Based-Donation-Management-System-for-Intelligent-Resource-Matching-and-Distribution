import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const userType = localStorage.getItem("user_type");


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");

    navigate("/login");

  };


  return (

    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="logo">
        AI Donation
      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <ul className="nav-links">


        {/* =================================================
            HOME
        ================================================= */}

        <li>
          <Link to="/">
            Home
          </Link>
        </li>


        {/* =================================================
            NOT LOGGED IN
        ================================================= */}

        {!token && (
          <>

            <li>
              <Link to="/login">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register">
                Register
              </Link>
            </li>

          </>
        )}


        {/* =================================================
            LOGGED IN
        ================================================= */}

        {token && (
          <>


            {/* DASHBOARD */}

            <li>
              <Link to="/dashboard">
                Dashboard
              </Link>
            </li>


            {/* =================================================
                DONOR OPTIONS
            ================================================= */}

            {userType === "Donor" && (
              <>

                <li>
                  <Link to="/donate-item">
                    📦 Donate
                  </Link>
                </li>

                <li>
                  <Link to="/my-donations">
                    📋 My Donations
                  </Link>
                </li>

              </>
            )}


            {/* =================================================
                NGO OPTIONS
            ================================================= */}
{userType === "NGO" && (
  <>
    <li>
      <Link to="/ngo-dashboard">
        🏢 NGO Dashboard
      </Link>
    </li>

    <li>
      <Link to="/ngo-profile">
        👤 NGO Profile
      </Link>
    </li>
  </>
)}
            {/* =================================================
                LOGOUT
            ================================================= */}

            <li>

              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>

            </li>

          </>
        )}

      </ul>

    </nav>

  );
}

export default Navbar;