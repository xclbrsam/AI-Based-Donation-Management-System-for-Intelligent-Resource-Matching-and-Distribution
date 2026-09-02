import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiGift,
  FiPackage,
  FiActivity,
  FiSearch,
  FiAward,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSun,
} from "react-icons/fi";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useRanking } from "../../context/RankingContext";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FiHome, end: true },
  { to: "/donate-item", label: "Donate", icon: FiGift },
  { to: "/my-donations", label: "My Donations", icon: FiPackage },
  { to: "/my-activity", label: "My Activity", icon: FiActivity },
  { to: "/notifications", label: "Notifications", icon: FiBell, badge: true },
];

function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { currentDonor, loading: rankingsLoading } = useRanking();
  const userName = localStorage.getItem("user_name") || "Donor";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`donor-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand" onClick={() => { navigate("/dashboard"); onClose(); }}>
        <div className="sidebar-brand-mark">AI</div>
        <div>
          <strong>ResourceBridge</strong>
          <span>Donor workspace</span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{userName.charAt(0).toUpperCase()}</div>
        <div className="sidebar-user-copy">
          <strong>{userName}</strong>
          <span>Donor</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="sidebar-section-label">MAIN</p>
        {navItems.slice(0, 4).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink
          to="/explore-ngos"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          onClick={onClose}
        >
          <FiSearch />
          <span>Explore NGOs</span>
        </NavLink>
        <NavLink
          to="/ranking"
          className={({ isActive }) => `sidebar-link sidebar-ranking ${isActive ? "active" : ""}`}
          onClick={onClose}
        >
          <FiAward />
          <span>Ranking</span>
          <span className="sidebar-ranking-badge">{rankingsLoading || !currentDonor ? "--" : `#${currentDonor.rank}`}</span>
        </NavLink>

        <p className="sidebar-section-label">COMMUNICATION</p>
        <NavLink
          to="/notifications"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          onClick={onClose}
        >
          <FiBell />
          <span>Notifications</span>
          <span className="sidebar-badge">•</span>
        </NavLink>

        <p className="sidebar-section-label">ACCOUNT</p>
        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          onClick={onClose}
        >
          <FiUser />
          <span>Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          onClick={onClose}
        >
          <FiSettings />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-theme-row">
          <div className="sidebar-theme-label">
            <span className="theme-icon"><FiSun /></span>
            <span>Appearance</span>
          </div>
          <ThemeToggle />
        </div>

        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
