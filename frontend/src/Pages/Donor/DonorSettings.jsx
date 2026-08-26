import { FiBell, FiMoon, FiSettings, FiShield } from "react-icons/fi";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./DonorNotifications.css";

function DonorSettings() {
  return (
    <div className="donor-settings-page">
      <header className="settings-header">
        <span><FiSettings /> ACCOUNT</span>
        <h1>Settings</h1>
        <p>Control how your donor workspace behaves.</p>
      </header>
      <section className="settings-card">
        <div className="notification-row">
          <div className="notification-icon coral"><FiBell /></div>
          <div className="notification-copy"><strong>Donation notifications</strong><p>Receive updates when donation status changes.</p></div>
          <span className="notification-time">ON</span>
        </div>
        <div className="notification-row">
          <div className="notification-icon blue"><FiMoon /></div>
          <div className="notification-copy"><strong>Appearance</strong><p>Switch between the available application themes.</p></div>
          <ThemeToggle />
        </div>
        <div className="notification-row">
          <div className="notification-icon green"><FiShield /></div>
          <div className="notification-copy"><strong>Account privacy</strong><p>Your donor information stays within your authenticated account.</p></div>
          <span className="notification-time">SECURE</span>
        </div>
      </section>
    </div>
  );
}
export default DonorSettings;
