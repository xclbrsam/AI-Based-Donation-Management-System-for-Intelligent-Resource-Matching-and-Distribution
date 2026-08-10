import { Link } from "react-router-dom";


function Navbar() {

  const isLoggedIn =
    !!localStorage.getItem(
      "access_token"
    );


  return (

    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >

        <div className="logo-icon">
          ♥
        </div>

        <div className="logo-text">

          <h2>
            KindLink
          </h2>

          <span>
            AI Donation Platform
          </span>

        </div>

      </Link>


      <div className="nav-links">

        <a href="/#home">
          Home
        </a>

        <a href="/#how-it-works">
          How It Works
        </a>

        <a href="/#about">
          About
        </a>

        <a href="/#impact">
          Impact
        </a>

      </div>


      <div className="nav-actions">

        {isLoggedIn ? (

          <Link
            to="/profile"
            className="register-btn"
          >
            Profile
          </Link>

        ) : (

          <>

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>

          </>

        )}

      </div>

    </nav>

  );

}

export default Navbar;