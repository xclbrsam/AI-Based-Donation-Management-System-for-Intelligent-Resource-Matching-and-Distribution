import { useEffect, useState } from "react";
import api from "../services/api";

function NgoDonations() {
  const [donations, setDonations] = useState([]);

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
      console.log(error);
    }
  };

  // Accept Donation
  const acceptDonation = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await api.put(
        `/donations/${id}/accept/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Donation Accepted Successfully");
      fetchDonations();
    } catch (error) {
      console.log(error);
      alert("Unable to Accept Donation");
    }
  };

  // Complete Donation
  const completeDonation = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await api.put(
        `/donations/${id}/complete/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Donation Completed Successfully");
      fetchDonations();
    } catch (error) {
      console.log(error);
      alert("Unable to Complete Donation");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>NGO Donations</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.item_name}</td>
                <td>{donation.category}</td>
                <td>{donation.quantity}</td>
                <td>{donation.location}</td>
                <td>{donation.status}</td>

                <td>
                  {donation.status === "AVAILABLE" && (
                    <button
                      onClick={() => acceptDonation(donation.id)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>
                  )}

                  {donation.status === "ACCEPTED" && (
                    <button
                      onClick={() => completeDonation(donation.id)}
                      style={{
                        backgroundColor: "orange",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Complete
                    </button>
                  )}

                  {donation.status === "COMPLETED" && (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ✅ Completed
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No Donations Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NgoDonations;