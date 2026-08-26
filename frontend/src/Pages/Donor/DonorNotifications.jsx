import { FiBell, FiCheckCircle, FiTruck, FiZap } from "react-icons/fi";
import "./DonorNotifications.css";

const notifications = [
  { icon: FiCheckCircle, title: "Donation updates", text: "Your latest donation status will appear here when the NGO responds.", time: "Ready", tone: "green" },
  { icon: FiTruck, title: "Pickup updates", text: "Pickup scheduling and collection updates will be shown here.", time: "Ready", tone: "blue" },
  { icon: FiZap, title: "AI recommendations", text: "Relevant NGO matching suggestions can appear here as you donate.", time: "AI", tone: "coral" },
];

function DonorNotifications() {
  return (
    <div className="donor-notifications-page">
      <header className="notification-header">
        <span><FiBell /> COMMUNICATION</span>
        <h1>Notifications</h1>
        <p>Keep track of donation, pickup and matching updates.</p>
      </header>
      <section className="notification-card">
        {notifications.map(({ icon: Icon, title, text, time, tone }) => (
          <article className="notification-row" key={title}>
            <div className={`notification-icon ${tone}`}><Icon /></div>
            <div className="notification-copy"><strong>{title}</strong><p>{text}</p></div>
            <span className="notification-time">{time}</span>
          </article>
        ))}
      </section>
    </div>
  );
}
export default DonorNotifications;
