import "./AdminDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
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
      alert("Unable to fetch users");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <div className="admin-container">

      {/* Sidebar */}
      <div className="sidebar">

        <h2>AI Donation</h2>

        <ul>
          <li><Link to="/admin-dashboard">Dashboard</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/donations">Donations</Link></li>
          <li><Link to="/register">Add User</Link></li>
        </ul>

        <button onClick={handleLogout}>Logout</button>

      </div>

      {/* Main Content */}
      <div className="content">

        <h1>Admin Dashboard</h1>

        <div className="cards">

          <div className="card">
            <h3>Total Users</h3>
            <h2>{users.length}</h2>
          </div>

          <div className="card">
            <h3>Admins</h3>
            <h2>
              {users.filter((u) => u.role === "ADMIN").length}
            </h2>
          </div>

          <div className="card">
            <h3>Donors</h3>
            <h2>
              {users.filter((u) => u.role === "DONOR").length}
            </h2>
          </div>

          <div className="card">
            <h3>NGOs</h3>
            <h2>
              {users.filter((u) => u.role === "NGO").length}
            </h2>
          </div>

        </div>

        <br />

        <h2>Registered Users</h2>

        <table border="1" cellPadding="10" width="100%">

          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>City</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.city}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminDashboard;