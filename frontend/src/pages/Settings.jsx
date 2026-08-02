import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

function Settings() {

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="content">

        <div className="topbar">
          <h1>Settings</h1>
        </div>

        <div className="table-box">

          <h2>Admin Settings</h2>

          <div style={{ padding: "20px" }}>

            <p><strong>Project:</strong> AI Donation System</p>

            <p><strong>Version:</strong> 1.0</p>

            <p><strong>Developer:</strong> Poojitha</p>

            <p><strong>Backend:</strong> Django REST Framework</p>

            <p><strong>Frontend:</strong> React + Vite</p>

            <p><strong>Database:</strong> PostgreSQL</p>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;