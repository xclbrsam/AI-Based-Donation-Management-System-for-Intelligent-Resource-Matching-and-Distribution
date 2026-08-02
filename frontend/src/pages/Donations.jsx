import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Donations() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

      setDonations(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch donations.");
    } finally {
      setLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access");

      await api.delete(`/donations/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Donation Deleted Successfully");
      fetchDonations();
    } catch (error) {
      console.error(error);
      alert("Unable to delete donation.");
    }
  };

  const filteredDonations = donations.filter((donation) => {
    return (
      donation.item_name
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (statusFilter === "" || donation.status === statusFilter)
    );
  });

  return (
    <div className="donations-container">
      <div className="header">
        <h1>My Donations</h1>

        <button
          className="add-btn"
          onClick={() => navigate("/donate")}
        >
          + Add Donation
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by Item Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No Donations Found
                </td>
              </tr>
            ) : (
              filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.id}</td>
                  <td>{donation.item_name}</td>
                  <td>{donation.category}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.location}</td>
                  <td>{donation.status}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/edit-donation/${donation.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteDonation(donation.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Donations;