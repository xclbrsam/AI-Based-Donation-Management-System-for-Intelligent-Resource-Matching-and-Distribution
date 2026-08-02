import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "./AdminDashboard.css";

function Reports() {

  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchDonations();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/donations/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonations(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="content">

        <div className="topbar">
          <h1>Reports</h1>
        </div>

        <div className="cards">

          <div className="card">
            <h3>Total Users</h3>
            <h1>{users.length}</h1>
          </div>

          <div className="card">
            <h3>Total NGOs</h3>
            <h1>{users.filter(user => user.role === "NGO").length}</h1>
          </div>

          <div className="card">
            <h3>Total Donors</h3>
            <h1>{users.filter(user => user.role === "DONOR").length}</h1>
          </div>

          <div className="card">
            <h3>Total Admins</h3>
            <h1>{users.filter(user => user.role === "ADMIN").length}</h1>
          </div>

          <div className="card">
            <h3>Total Donations</h3>
            <h1>{donations.length}</h1>
          </div>

          <div className="card">
            <h3>Available Donations</h3>
            <h1>{donations.filter(d => d.status === "AVAILABLE").length}</h1>
          </div>

          <div className="card">
            <h3>Accepted Donations</h3>
            <h1>{donations.filter(d => d.status === "ACCEPTED").length}</h1>
          </div>

          <div className="card">
            <h3>Completed Donations</h3>
            <h1>{donations.filter(d => d.status === "COMPLETED").length}</h1>
          </div>

        </div>

        <div className="table-box">

          <h2>System Report</h2>

          <table>

            <thead>
              <tr>
                <th>Report</th>
                <th>Count</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Total Users</td>
                <td>{users.length}</td>
              </tr>

              <tr>
                <td>Total NGOs</td>
                <td>{users.filter(user => user.role === "NGO").length}</td>
              </tr>

              <tr>
                <td>Total Donors</td>
                <td>{users.filter(user => user.role === "DONOR").length}</td>
              </tr>

              <tr>
                <td>Total Admins</td>
                <td>{users.filter(user => user.role === "ADMIN").length}</td>
              </tr>

              <tr>
                <td>Total Donations</td>
                <td>{donations.length}</td>
              </tr>

              <tr>
                <td>Available Donations</td>
                <td>{donations.filter(d => d.status === "AVAILABLE").length}</td>
              </tr>

              <tr>
                <td>Accepted Donations</td>
                <td>{donations.filter(d => d.status === "ACCEPTED").length}</td>
              </tr>

              <tr>
                <td>Completed Donations</td>
                <td>{donations.filter(d => d.status === "COMPLETED").length}</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Reports;