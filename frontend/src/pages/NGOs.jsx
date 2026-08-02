import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

function NGOs() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ngoUsers = response.data.filter(
        (user) => user.role === "NGO"
      );

      setNgos(ngoUsers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="content">

        <div className="topbar">
          <h1>NGOs</h1>
        </div>

        <div className="table-box">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>

            <tbody>

              {ngos.map((ngo) => (
                <tr key={ngo.id}>
                  <td>{ngo.id}</td>
                  <td>{ngo.username}</td>
                  <td>{ngo.email}</td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default NGOs;