import { HeartHandshake } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">

        <HeartHandshake size={22} />

        <span>KindLink</span>

      </div>

      <p>
        Connecting generosity with real needs through intelligent technology.
      </p>

      <div className="footer-line"></div>

      <small>
        © 2026 KindLink. AI-Based Donation Management System.
      </small>

    </footer>
  );
}

export default Footer;