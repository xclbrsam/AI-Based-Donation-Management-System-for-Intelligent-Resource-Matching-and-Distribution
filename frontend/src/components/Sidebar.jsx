import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <h2>AI Donation</h2>

      <ul>

        <Link to="/admin-dashboard" className="nav-link">
          <li>Dashboard</li>
        </Link>

        <Link to="/users" className="nav-link">
          <li>Users</li>
        </Link>

        <Link to="/ngos" className="nav-link">
          <li>NGOs</li>
        </Link>

        <Link to="/donations" className="nav-link">
          <li>Donations</li>
        </Link>

        <Link to="/requests" className="nav-link">
          <li>Requests</li>
        </Link>

        <Link to="/reports" className="nav-link">
          <li>Reports</li>
        </Link>

        <Link to="/settings" className="nav-link">
          <li>Settings</li>
        </Link>

      </ul>

      <button
        style={{ marginTop: "20px", width: "100%" }}
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;