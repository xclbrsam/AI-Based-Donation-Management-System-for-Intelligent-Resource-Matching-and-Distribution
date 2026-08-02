import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/requests/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="content">

        <div className="topbar">
          <h1>Donation Requests</h1>
        </div>

        <div className="table-box">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>NGO</th>
                <th>Donation</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.ngo}</td>
                    <td>{request.donation}</td>
                    <td>{request.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Requests Found</td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Requests;