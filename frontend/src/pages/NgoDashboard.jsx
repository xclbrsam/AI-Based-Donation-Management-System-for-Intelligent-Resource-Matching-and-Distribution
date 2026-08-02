import "./NgoDashboard.css";
import { useEffect, useState } from "react";
import api from "../services/api";

function NgoDashboard() {
  const [stats, setStats] = useState({
    available: 0,
    accepted: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/donations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const donations = response.data;

      setStats({
        available: donations.filter(
          (d) => d.status === "AVAILABLE"
        ).length,

        accepted: donations.filter(
          (d) => d.status === "ACCEPTED"
        ).length,

        completed: donations.filter(
          (d) => d.status === "COMPLETED"
        ).length,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>NGO Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Available Donations</h3>
          <h2>{stats.available}</h2>
        </div>

        <div className="card">
          <h3>Accepted Donations</h3>
          <h2>{stats.accepted}</h2>
        </div>

        <div className="card">
          <h3>Completed Deliveries</h3>
          <h2>{stats.completed}</h2>
        </div>
      </div>
    </div>
  );
}

export default NgoDashboard;