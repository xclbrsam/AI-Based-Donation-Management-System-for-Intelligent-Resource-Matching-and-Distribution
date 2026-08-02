import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const token = localStorage.getItem("access");

        const response = await api.get("profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchProfile();

  }, []);

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (

    <div className="dashboard">

      <h1>Welcome {user.username} 👋</h1>

      <h3>{user.email}</h3>

      <h3>{user.role}</h3>

      {user.role === "ADMIN" && (
        <h2>🛡️ Admin Dashboard</h2>
      )}

      {user.role === "DONOR" && (
        <h2>❤️ Donor Dashboard</h2>
      )}

      {user.role === "NGO" && (
        <h2>🏢 NGO Dashboard</h2>
      )}

    </div>

  );
}

export default Dashboard;