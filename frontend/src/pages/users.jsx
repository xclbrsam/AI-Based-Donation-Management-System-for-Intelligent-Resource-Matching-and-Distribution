import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

function Users() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("access");

  const fetchUsers = async () => {
    try {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/delete/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Unable to delete user");
    }
  };

  // Update Role
  const updateRole = async (id, role) => {
    try {
      await api.put(
        `/users/update-role/${id}/`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Role Updated Successfully");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Unable to Update Role");
    }
  };

  return (
    <div className="admin-container">

      <Sidebar />

      <div className="content">

        <div className="topbar">
          <h1>Users</h1>
        </div>

        <div className="table-box">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.username}</td>

                  <td>{user.email}</td>

                  <td>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole(user.id, e.target.value)
                      }
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="DONOR">DONOR</option>
                      <option value="NGO">NGO</option>
                    </select>
                  </td>

                  <td>
                    <button
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Users;