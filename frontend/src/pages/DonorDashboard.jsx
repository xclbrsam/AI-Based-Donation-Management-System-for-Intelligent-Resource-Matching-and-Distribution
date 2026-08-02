import "./DonorDashboard.css";
import { useEffect, useState } from "react";
import api from "../services/api";

function DonorDashboard() {
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/donations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const donations = response.data;

      console.log(donations);

      setTotal(donations.length);

      setPending(
        donations.filter(
          (d) => d.status?.toLowerCase() === "pending"
        ).length
      );

      setAccepted(
        donations.filter(
          (d) => d.status?.toLowerCase() === "accepted"
        ).length
      );

      setCompleted(
        donations.filter(
          (d) => d.status?.toLowerCase() === "completed"
        ).length
      );
    } catch (error) {
      console.log(error);
      alert("Unable to load dashboard");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Donor Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Donations</h3>
          <h2>{total}</h2>
        </div>

        <div className="card">
          <h3>Pending Donations</h3>
          <h2>{pending}</h2>
        </div>

        <div className="card">
          <h3>Accepted Donations</h3>
          <h2>{accepted}</h2>
        </div>

        <div className="card">
          <h3>Completed Donations</h3>
          <h2>{completed}</h2>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;