import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NGODashboard.css";

function NGODashboard() {

  const [donations, setDonations] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [pickups, setPickups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [allocationLoading, setAllocationLoading] = useState(false);
  const [requirementsLoading, setRequirementsLoading] = useState(false);

  const [updatingId, setUpdatingId] = useState(null);
  const [requirementSaving, setRequirementSaving] = useState(false);
  const [editingRequirementId, setEditingRequirementId] = useState(null);

  const [activeTab, setActiveTab] = useState("requests");

  const [requirementForm, setRequirementForm] = useState({
    item_name: "",
    category: "Food",
    required_quantity: "",
    priority: "Medium",
    description: "",
  });

  const navigate = useNavigate();


  // =====================================================
  // FETCH NGO DONATIONS
  // =====================================================

  const fetchDonations = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "ngo/donations/"
      );

      console.log(
        "NGO Donations:",
        response.data
      );

      setDonations(response.data);

    } catch (error) {

      console.error(
        "========== NGO DASHBOARD ERROR =========="
      );

      console.error(error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "========================================="
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FETCH ALLOCATED DONATIONS
  // =====================================================

  const fetchAllocations = async () => {
    try {
      setAllocationLoading(true);

      const response = await api.get("ngo/allocations/");

      console.log("NGO Allocations:", response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results ||
          response.data?.allocations ||
          [];

      setAllocations(data);
    } catch (error) {
      console.error("========== NGO ALLOCATIONS ERROR ==========");
      console.error(error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      setAllocations([]);
    } finally {
      setAllocationLoading(false);
    }
  };


  // =====================================================
  // FETCH NGO PICKUP REQUESTS
  // =====================================================

  const fetchPickups = async () => {
    try {
      const response = await api.get("pickup/ngo/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || response.data?.pickups || [];

      console.log("NGO Pickups:", data);
      setPickups(data);
    } catch (error) {
      console.error("========== NGO PICKUPS ERROR ==========");
      console.error(error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      setPickups([]);
    }
  };


  // =====================================================
  // UPDATE PICKUP STATUS
  // =====================================================

  const updatePickupStatus = async (pickupId, newStatus) => {
    if (!pickupId) {
      alert("Pickup request ID is missing.");
      return;
    }

    try {
      setUpdatingId(`pickup-${pickupId}`);

      await api.patch(
        `pickup/${pickupId}/status/`,
        { status: newStatus }
      );

      await Promise.all([
        fetchPickups(),
        fetchAllocations(),
        fetchDonations(),
      ]);

      alert(`Pickup ${newStatus.toLowerCase()} successfully.`);
    } catch (error) {
      console.error("PICKUP STATUS UPDATE ERROR", error);
      console.error(error.response?.data);

      alert(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Unable to update pickup status."
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // =====================================================
  // FETCH NGO REQUIREMENTS
  // =====================================================

  const fetchRequirements = async () => {
    try {
      setRequirementsLoading(true);

      const response = await api.get(
        "ngo/requirements/"
      );

      console.log(
        "NGO Requirements:",
        response.data
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results ||
          response.data?.requirements ||
          [];

      setRequirements(data);

    } catch (error) {
      console.error(
        "========== NGO REQUIREMENTS ERROR =========="
      );

      console.error(error);
      console.error(
        "Status:",
        error.response?.status
      );
      console.error(
        "Response:",
        error.response?.data
      );

      setRequirements([]);

    } finally {
      setRequirementsLoading(false);
    }
  };


  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {

    fetchDonations();
    fetchAllocations();
    fetchRequirements();
    fetchPickups();

  }, []);


  // =====================================================
  // UPDATE DONATION STATUS
  // =====================================================

  const updateStatus = async (
    donationId,
    newStatus
  ) => {

    try {

      setUpdatingId(donationId);

      const response = await api.patch(
        `donation/${donationId}/status/`,
        {
          status: newStatus,
        }
      );

      console.log(
        "Status Updated:",
        response.data
      );


      // Refresh both donations and requirements.
      // Requirement quantities should change only after the backend
      // confirms an Accepted donation.
      await Promise.all([
        fetchDonations(),
        fetchRequirements(),
        fetchAllocations(),
        fetchPickups(),
      ]);

      alert(
        `Donation ${newStatus.toLowerCase()} successfully.`
      );

    } catch (error) {

      console.error(
        "========== STATUS UPDATE ERROR =========="
      );

      console.error(error);

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "========================================="
      );


      if (error.response?.data) {

        alert(
          JSON.stringify(
            error.response.data
          )
        );

      } else {

        alert(
          "Unable to update donation status."
        );

      }

    } finally {

      setUpdatingId(null);

    }
  };


  // =====================================================
  // NGO REQUIREMENT FORM
  // =====================================================

  const handleRequirementChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setRequirementForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const resetRequirementForm = () => {

    setRequirementForm({
      item_name: "",
      category: "Food",
      required_quantity: "",
      priority: "Medium",
      description: "",
    });

    setEditingRequirementId(null);
  };


  const editRequirement = (requirement) => {

    setEditingRequirementId(
      requirement.id
    );

    setRequirementForm({
      item_name:
        requirement.item_name || "",

      category:
        requirement.category || "Food",

      required_quantity:
        requirement.required_quantity ??
        "",

      priority:
        requirement.priority || "Medium",

      description:
        requirement.description || "",
    });

    setActiveTab("requirements");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const saveRequirement = async (event) => {

    event.preventDefault();

    if (
      !requirementForm.item_name.trim()
    ) {
      alert("Please enter the item name.");
      return;
    }

    if (
      !requirementForm.required_quantity ||
      Number(requirementForm.required_quantity) <= 0
    ) {
      alert(
        "Required quantity must be greater than 0."
      );
      return;
    }

    try {

      setRequirementSaving(true);

      const payload = {
        item_name:
          requirementForm.item_name.trim(),

        category:
          requirementForm.category,

        required_quantity:
          Number(
            requirementForm.required_quantity
          ),

        priority:
          requirementForm.priority,

        description:
          requirementForm.description.trim(),
      };

      if (editingRequirementId) {

        await api.put(
          `ngo/requirements/${editingRequirementId}/`,
          payload
        );

        alert(
          "Requirement updated successfully."
        );

      } else {

        await api.post(
          "ngo/requirements/",
          payload
        );

        alert(
          "Requirement added successfully."
        );
      }

      resetRequirementForm();
      await fetchRequirements();

    } catch (error) {

      console.error(
        "========== REQUIREMENT SAVE ERROR =========="
      );

      console.error(error);
      console.error(
        "Response:",
        error.response?.data
      );

      alert(
        error.response?.data
          ? JSON.stringify(
              error.response.data
            )
          : "Unable to save requirement."
      );

    } finally {

      setRequirementSaving(false);
    }
  };


  const deleteRequirement = async (
    requirementId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this requirement?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `ngo/requirements/${requirementId}/`
      );

      if (
        editingRequirementId ===
        requirementId
      ) {
        resetRequirementForm();
      }

      await fetchRequirements();

      alert(
        "Requirement deleted successfully."
      );

    } catch (error) {

      console.error(
        "========== REQUIREMENT DELETE ERROR =========="
      );

      console.error(error);
      console.error(
        "Response:",
        error.response?.data
      );

      alert(
        error.response?.data
          ? JSON.stringify(
              error.response.data
            )
          : "Unable to delete requirement."
      );
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");

    navigate("/login", { replace: true });
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingCount =
    donations.filter(
      (item) =>
        item.status === "Pending"
    ).length;


  const acceptedCount =
    donations.filter(
      (item) =>
        item.status === "Accepted"
    ).length;


  const rejectedCount =
    donations.filter(
      (item) =>
        item.status === "Rejected"
    ).length;


  const collectedCount =
    donations.filter(
      (item) =>
        item.status === "Collected"
    ).length;


  // =====================================================
  // REQUESTS & HISTORY
  // =====================================================

  const pendingDonations = donations.filter(
    (item) => item.status === "Pending"
  );

  const donationHistory = donations.filter(
    (item) => item.status !== "Pending"
  );

  const displayedDonations =
    activeTab === "requests"
      ? pendingDonations
      : donationHistory;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="ngo-dashboard-loading">

        <h2>
          Loading NGO Dashboard...
        </h2>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="ngo-dashboard">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ngo-dashboard-header">

        <div className="ngo-header-actions">
          <button
            type="button"
            className="ngo-header-action"
            onClick={() => navigate("/ngo-profile")}
          >
            👤 Profile
          </button>

          <button
            type="button"
            className="ngo-header-action ngo-logout-action"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        <span className="ngo-dashboard-badge">
          NGO DASHBOARD
        </span>

        <h1>
          NGO Donation Management
        </h1>

        <p>
          Review incoming donation requests and manage your complete donation history.
        </p>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="ngo-stats">


        <div className="ngo-stat-card">

          <span>
            ⏳
          </span>

          <h3>
            Pending
          </h3>

          <strong>
            {pendingCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            ✅
          </span>

          <h3>
            Accepted
          </h3>

          <strong>
            {acceptedCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            ❌
          </span>

          <h3>
            Rejected
          </h3>

          <strong>
            {rejectedCount}
          </strong>

        </div>


        <div className="ngo-stat-card">

          <span>
            🚚
          </span>

          <h3>
            Collected
          </h3>

          <strong>
            {collectedCount}
          </strong>

        </div>

      </div>


      {/* =================================================
          REQUESTS / HISTORY TABS
      ================================================= */}

      <div className="ngo-tabs">

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "requests" ? "active" : ""
          }`}
          onClick={() => setActiveTab("requests")}
        >
          📥 Donation Requests
          <span className="ngo-tab-count">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "allocations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("allocations")}
        >
          🤝 Allocated Donations
          <span className="ngo-tab-count">
            {allocations.length}
          </span>
        </button>

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "requirements" ? "active" : ""
          }`}
          onClick={() => setActiveTab("requirements")}
        >
          📋 NGO Requirements
          <span className="ngo-tab-count">
            {requirements.length}
          </span>
        </button>

        <button
          type="button"
          className={`ngo-tab ${
            activeTab === "history" ? "active" : ""
          }`}
          onClick={() => setActiveTab("history")}
        >
          📜 Donation History
          <span className="ngo-tab-count">
            {donationHistory.length}
          </span>
        </button>

      </div>


      {/* =================================================
          REQUESTS / HISTORY
      ================================================= */}

      <div className="ngo-donation-section">

        <div className="ngo-section-heading">
          <div>
            <h2>
              {activeTab === "requests"
                ? "Incoming Donation Requests"
                : activeTab === "allocations"
                  ? "Allocated Donations"
                  : activeTab === "requirements"
                    ? "NGO Requirements"
                    : "Donation History"}
            </h2>

            <p>
              {activeTab === "requests"
                ? "Pending donations waiting for your decision."
                : activeTab === "allocations"
                  ? "Donations that have been allocated to your NGO."
                  : activeTab === "requirements"
                    ? "Add, edit and manage the items your NGO currently needs."
                    : "Accepted, rejected and collected donations from your NGO."}
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={() => {
              fetchDonations();
              fetchAllocations();
              fetchRequirements();
              fetchPickups();
            }}
            disabled={
              loading ||
              allocationLoading ||
              requirementsLoading
            }
          >
            🔄 Refresh
          </button>
        </div>


        {activeTab === "requirements" ? (

          <div className="ngo-requirements-panel">

            <form
              className="ngo-requirement-form"
              onSubmit={saveRequirement}
            >

              <div className="ngo-requirement-form-header">
                <div>
                  <span className="ngo-section-label">
                    {editingRequirementId
                      ? "EDIT REQUIREMENT"
                      : "ADD REQUIREMENT"}
                  </span>

                  <h3>
                    {editingRequirementId
                      ? "Update NGO Requirement"
                      : "Create New Requirement"}
                  </h3>
                </div>

                {editingRequirementId && (
                  <button
                    type="button"
                    className="requirement-cancel-button"
                    onClick={resetRequirementForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>


              <div className="ngo-requirement-form-grid">

                <div className="requirement-field">
                  <label>
                    Item Name
                  </label>

                  <input
                    type="text"
                    name="item_name"
                    value={
                      requirementForm.item_name
                    }
                    onChange={
                      handleRequirementChange
                    }
                    placeholder="e.g. Rice"
                    required
                  />
                </div>


                <div className="requirement-field">
                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={
                      requirementForm.category
                    }
                    onChange={
                      handleRequirementChange
                    }
                  >
                    <option value="Clothing">
                      Clothing
                    </option>

                    <option value="Books">
                      Books
                    </option>

                    <option value="Food">
                      Food
                    </option>

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Furniture">
                      Furniture
                    </option>

                    <option value="Medical Supplies">
                      Medical Supplies
                    </option>

                    <option value="School Supplies">
                      School Supplies
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>


                <div className="requirement-field">
                  <label>
                    Required Quantity
                  </label>

                  <input
                    type="number"
                    name="required_quantity"
                    min="1"
                    value={
                      requirementForm.required_quantity
                    }
                    onChange={
                      handleRequirementChange
                    }
                    placeholder="e.g. 10"
                    required
                  />
                </div>


                <div className="requirement-field">
                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      requirementForm.priority
                    }
                    onChange={
                      handleRequirementChange
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                    <option value="Urgent">
                      Urgent
                    </option>
                  </select>
                </div>

              </div>


              <div className="requirement-field">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="3"
                  value={
                    requirementForm.description
                  }
                  onChange={
                    handleRequirementChange
                  }
                  placeholder="Why does your NGO need this item?"
                />
              </div>


              <button
                type="submit"
                className="requirement-save-button"
                disabled={requirementSaving}
              >
                {requirementSaving
                  ? "Saving..."
                  : editingRequirementId
                    ? "✏️ Update Requirement"
                    : "➕ Add Requirement"}
              </button>

            </form>


            <div className="ngo-requirements-list">

              {requirementsLoading ? (

                <div className="no-donations">
                  <div className="no-donations-icon">
                    ⏳
                  </div>

                  <h3>
                    Loading requirements...
                  </h3>

                  <p>
                    Fetching your NGO requirements.
                  </p>
                </div>

              ) : requirements.length === 0 ? (

                <div className="no-donations">

                  <div className="no-donations-icon">
                    📋
                  </div>

                  <h3>
                    No requirements yet
                  </h3>

                  <p>
                    Add the items your NGO currently needs.
                  </p>

                </div>

              ) : (

                requirements.map((requirement) => {

                  const requiredQuantity =
                    Number(
                      requirement.required_quantity || 0
                    );

                  const fulfilledQuantity =
                    Number(
                      requirement.fulfilled_quantity || 0
                    );

                  const calculatedRemaining =
                    Math.max(
                      requiredQuantity -
                        fulfilledQuantity,
                      0
                    );

                  const remainingQuantity =
                    requirement.remaining_quantity ??
                    calculatedRemaining;

                  return (

                    <div
                      className="ngo-requirement-card"
                      key={requirement.id}
                    >

                      <div className="requirement-card-top">

                        <div>
                          <span className="requirement-category">
                            {requirement.category ||
                              "Other"}
                          </span>

                          <h3>
                            {requirement.item_name}
                          </h3>
                        </div>

                        <span
                          className={`requirement-priority priority-${String(
                            requirement.priority ||
                              "Medium"
                          ).toLowerCase()}`}
                        >
                          {requirement.priority ||
                            "Medium"}
                        </span>

                      </div>


                      <div className="requirement-quantities">

                        <div>
                          <span>
                            REQUIRED
                          </span>

                          <strong>
                            {requiredQuantity}
                          </strong>
                        </div>

                        <div>
                          <span>
                            FULFILLED
                          </span>

                          <strong>
                            {fulfilledQuantity}
                          </strong>
                        </div>

                        <div>
                          <span>
                            REMAINING
                          </span>

                          <strong>
                            {remainingQuantity}
                          </strong>
                        </div>

                      </div>


                      <div className="requirement-progress">

                        <div className="requirement-progress-bar">

                          <span
                            style={{
                              width: `${
                                requiredQuantity > 0
                                  ? Math.min(
                                      (
                                        fulfilledQuantity /
                                        requiredQuantity
                                      ) * 100,
                                      100
                                    )
                                  : 0
                              }%`,
                            }}
                          />

                        </div>

                        <small>
                          {requiredQuantity > 0
                            ? Math.round(
                                Math.min(
                                  (
                                    fulfilledQuantity /
                                    requiredQuantity
                                  ) * 100,
                                  100
                                )
                              )
                            : 0}
                          % fulfilled
                        </small>

                      </div>


                      {requirement.description && (

                        <p className="requirement-description">
                          {requirement.description}
                        </p>

                      )}


                      <div className="requirement-status">

                        {requirement.is_fulfilled ||
                        remainingQuantity === 0 ? (
                          <span>
                            ✅ Requirement fulfilled
                          </span>
                        ) : requirement.is_active === false ? (
                          <span>
                            ⏸️ Requirement inactive
                          </span>
                        ) : (
                          <span>
                            🔎 Still needs{" "}
                            {remainingQuantity}
                          </span>
                        )}

                      </div>


                      <div className="requirement-actions">

                        <button
                          type="button"
                          className="requirement-edit-button"
                          onClick={() =>
                            editRequirement(
                              requirement
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="requirement-delete-button"
                          onClick={() =>
                            deleteRequirement(
                              requirement.id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </div>

                  );
                })

              )}

            </div>

          </div>

        ) : activeTab === "allocations" ? (

          allocationLoading ? (
            <div className="no-donations">
              <div className="no-donations-icon">⏳</div>
              <h3>Loading allocated donations...</h3>
              <p>Fetching donations allocated to your NGO.</p>
            </div>
          ) : allocations.length === 0 ? (
            <div className="no-donations">
              <div className="no-donations-icon">🤝</div>
              <h3>No allocated donations yet</h3>
              <p>Donations allocated to your NGO will appear here.</p>
            </div>
          ) : (
            <div className="ngo-donation-list">
              {allocations.map((allocation, index) => {
                const donation = allocation.donation || allocation;
                const allocationId = allocation.id || donation.id || index;
                const itemName = allocation.item_name || donation.item_name || allocation.item || "Donation";
                const category = allocation.category || donation.category || "Not available";
                const allocatedQuantity = allocation.allocated_quantity ?? allocation.quantity ?? allocation.donation_quantity ?? 0;
                const donorName = allocation.donor_name || donation.donor_name || "Not available";
                const donorEmail = allocation.donor_email || donation.donor_email || "Not available";
                const donorPhone = allocation.donor_phone || donation.donor_phone || "Not available";
                const pickup =
                  pickups.find(
                    (item) =>
                      Number(item.allocation_id) === Number(allocation.id) ||
                      Number(item.allocation?.id) === Number(allocation.id) ||
                      Number(item.allocation_id) === Number(allocationId) ||
                      Number(item.allocation?.id) === Number(allocationId)
                  ) ||
                  allocation.pickup ||
                  null;

                const scheduledTime =
                  pickup?.scheduled_time ||
                  allocation.scheduled_time ||
                  null;

                const pickupDate = scheduledTime
                  ? new Date(scheduledTime).toLocaleDateString()
                  : "Not scheduled";

                const pickupTime = scheduledTime
                  ? new Date(scheduledTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not scheduled";

                const pickupStatus =
                  pickup?.status ||
                  allocation.pickup_status ||
                  "Not Scheduled";

                const location =
                  pickup?.pickup_address ||
                  allocation.pickup_address ||
                  allocation.location ||
                  donation.location ||
                  "Not available";
                const status = allocation.status || "Allocated";
                const image = allocation.item_image || donation.item_image;
                const remaining = allocation.remaining_quantity ?? allocation.remaining;

                return (
                  <div className="ngo-donation-card" key={allocationId}>
                    {image && (
                      <img src={image} alt={itemName} className="donation-item-image" />
                    )}

                    <div className="ngo-donation-content">
                      <div className="donation-title-row">
                        <h3>{itemName}</h3>
                        <span className={`status status-${String(status).toLowerCase()}`}>
                          {status}
                        </span>
                      </div>

                      <div className="donation-details">
                        <p><strong>Category:</strong> {category}</p>
                        <p><strong>Allocated Quantity:</strong> {allocatedQuantity}</p>
                        {remaining !== undefined && (
                          <p><strong>Remaining Requirement:</strong> {remaining}</p>
                        )}
                      </div>

                      <div className="pickup-information">
                        <h4>🚚 Pickup Details</h4>
                        <p><strong>📍 Pickup Location:</strong> {location}</p>
                        <p>
                          <strong>📅 Pickup Date:</strong>{" "}
                          {pickupDate
                            ? new Date(pickupDate).toLocaleDateString()
                            : "Not scheduled"}
                        </p>
                        <p><strong>🕐 Pickup Time:</strong> {pickupTime || "Not scheduled"}</p>
                        <p><strong>Status:</strong> {pickupStatus}</p>
                      
                        {pickup && (
                          <div className="pickup-status-actions">

                            {pickup.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  className="accept-button"
                                  disabled={
                                    updatingId === `pickup-${pickup.id}`
                                  }
                                  onClick={() =>
                                    updatePickupStatus(
                                      pickup.id,
                                      "Confirmed"
                                    )
                                  }
                                >
                                  {updatingId === `pickup-${pickup.id}`
                                    ? "Updating..."
                                    : "✅ Confirm Pickup"}
                                </button>

                                <button
                                  type="button"
                                  className="reject-button"
                                  disabled={
                                    updatingId === `pickup-${pickup.id}`
                                  }
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Cancel this pickup request? The donation will remain accepted."
                                      )
                                    ) {
                                      updatePickupStatus(
                                        pickup.id,
                                        "Cancelled"
                                      );
                                    }
                                  }}
                                >
                                  ❌ Cancel Pickup
                                </button>
                              </>
                            )}

                            {pickup.status === "Confirmed" && (
                              <button
                                type="button"
                                className="collect-button"
                                disabled={
                                  updatingId === `pickup-${pickup.id}`
                                }
                                onClick={() =>
                                  updatePickupStatus(
                                    pickup.id,
                                    "Dispatched"
                                  )
                                }
                              >
                                {updatingId === `pickup-${pickup.id}`
                                  ? "Updating..."
                                  : "📦 Mark Dispatched"}
                              </button>
                            )}

                            {pickup.status === "Dispatched" && (
                              <button
                                type="button"
                                className="collect-button"
                                disabled={
                                  updatingId === `pickup-${pickup.id}`
                                }
                                onClick={() =>
                                  updatePickupStatus(
                                    pickup.id,
                                    "Delivered"
                                  )
                                }
                              >
                                {updatingId === `pickup-${pickup.id}`
                                  ? "Updating..."
                                  : "🚚 Mark Delivered"}
                              </button>
                            )}

                            {pickup.status === "Delivered" && (
                              <div className="history-status-message">
                                <span>✅ Pickup delivered successfully.</span>
                              </div>
                            )}

                            {pickup.status === "Cancelled" && (
                              <div className="history-status-message">
                                <span>
                                  ❌ Pickup cancelled. The accepted donation
                                  remains accepted.
                                </span>
                              </div>
                            )}

                          </div>
                        )}

                        {!pickup && (
                          <div className="history-status-message">
                            <span>⏳ Pickup has not been scheduled yet.</span>
                          </div>
                        )}

                      </div>

                      {donation.status === "Pending" && (
                        <div className="history-status-message">
                          <span>
                            ⏳ Pending approval. This donation does not
                            fulfill the NGO requirement until accepted.
                          </span>
                        </div>
                      )}

                      <div className="donor-information">
                        <h4>👤 Donor Information</h4>
                        <p><strong>Name:</strong> {donorName}</p>
                        <p><strong>Email:</strong> {donorEmail}</p>
                        <p><strong>Phone:</strong> {donorPhone}</p>
                      </div>

                      <div className="history-status-message">
                        <span>🤝 This donation has been allocated to your NGO.</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )

        ) : (

          displayedDonations.length === 0 ? (
            <div className="no-donations">
              <div className="no-donations-icon">📦</div>
              <h3>
                {activeTab === "requests"
                  ? "No pending donation requests"
                  : "No donation history yet"}
              </h3>
              <p>
                {activeTab === "requests"
                  ? "New donations sent to your NGO will appear here."
                  : "Accepted, rejected and collected donations will appear here."}
              </p>
            </div>
          ) : (
            <div className="ngo-donation-list">
              {displayedDonations.map((donation) => (
                <div className="ngo-donation-card" key={donation.id}>
                  {donation.item_image && (
                    <img src={donation.item_image} alt={donation.item_name} className="donation-item-image" />
                  )}

                  <div className="ngo-donation-content">
                    <div className="donation-title-row">
                      <h3>{donation.item_name}</h3>
                      <span className={`status status-${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </div>

                    <div className="donation-details">
                      <p><strong>Category:</strong> {donation.category}</p>
                      <p><strong>Quantity:</strong> {donation.quantity}</p>
                      <p><strong>Condition:</strong> {donation.condition}</p>
                      <p><strong>Location:</strong> {donation.location || "Not available"}</p>
                      <p><strong>Description:</strong> {donation.description || "Not available"}</p>
                      <p><strong>Donation Date:</strong> {donation.donation_date ? new Date(donation.donation_date).toLocaleString() : "Not available"}</p>
                    </div>

                    <div className="pickup-information">
                      {(() => {
                        const donationAllocations = Array.isArray(
                          donation.allocated_ngos
                        )
                          ? donation.allocated_ngos
                          : [];

                        const allocationWithPickup =
                          donationAllocations.find(
                            (allocation) =>
                              allocation?.pickup?.scheduled_time ||
                              allocation?.pickup?.status
                          );

                        const pickup =
                          pickups.find(
                            (item) =>
                              Number(item.donation_id) === Number(donation.id) ||
                              Number(item.donation?.id) === Number(donation.id) ||
                              Number(item.allocation?.donation_id) === Number(donation.id) ||
                              Number(item.allocation?.donation?.id) === Number(donation.id)
                          ) ||
                          allocationWithPickup?.pickup ||
                          null;

                        const scheduledTime = pickup?.scheduled_time || null;

                        return (
                          <>
                            <h4>🚚 Pickup Details</h4>
                            <p>
                              <strong>📍 Location:</strong>{" "}
                              {pickup?.pickup_address ||
                                donation.location ||
                                "Not available"}
                            </p>
                            <p>
                              <strong>📅 Pickup Date:</strong>{" "}
                              {scheduledTime
                                ? new Date(scheduledTime).toLocaleDateString()
                                : "Not scheduled"}
                            </p>
                            <p>
                              <strong>🕐 Pickup Time:</strong>{" "}
                              {scheduledTime
                                ? new Date(scheduledTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Not scheduled"}
                            </p>
                            <p>
                              <strong>📦 Pickup Status:</strong>{" "}
                              {pickup?.status || "Not Scheduled"}
                            </p>
                            {pickup && pickup.status === "Pending" && (
                              <div className="pickup-status-actions">
                                <button
                                  type="button"
                                  className="accept-button"
                                  disabled={
                                    updatingId === `pickup-${pickup.id}`
                                  }
                                  onClick={() =>
                                    updatePickupStatus(
                                      pickup.id,
                                      "Confirmed"
                                    )
                                  }
                                >
                                  {updatingId === `pickup-${pickup.id}`
                                    ? "Updating..."
                                    : "✅ Confirm Pickup"}
                                </button>

                                <button
                                  type="button"
                                  className="reject-button"
                                  disabled={
                                    updatingId === `pickup-${pickup.id}`
                                  }
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Cancel this pickup request? The donation will remain accepted."
                                      )
                                    ) {
                                      updatePickupStatus(
                                        pickup.id,
                                        "Cancelled"
                                      );
                                    }
                                  }}
                                >
                                  ❌ Cancel Pickup
                                </button>
                              </div>
                            )}

                            {pickup && pickup.status === "Confirmed" && (
                              <button
                                type="button"
                                className="collect-button"
                                disabled={
                                  updatingId === `pickup-${pickup.id}`
                                }
                                onClick={() =>
                                  updatePickupStatus(
                                    pickup.id,
                                    "Dispatched"
                                  )
                                }
                              >
                                📦 Mark Dispatched
                              </button>
                            )}

                            {pickup && pickup.status === "Dispatched" && (
                              <button
                                type="button"
                                className="collect-button"
                                disabled={
                                  updatingId === `pickup-${pickup.id}`
                                }
                                onClick={() =>
                                  updatePickupStatus(
                                    pickup.id,
                                    "Delivered"
                                  )
                                }
                              >
                                🚚 Mark Delivered
                              </button>
                            )}

                          </>
                        );
                      })()}
                    </div>

                    <div className="donor-information">
                      <h4>👤 Donor Information</h4>
                      <p><strong>Name:</strong> {donation.donor_name || "Not available"}</p>
                      <p><strong>Email:</strong> {donation.donor_email || "Not available"}</p>
                      <p><strong>Phone:</strong> {donation.donor_phone || "Not available"}</p>
                      <p><strong>NGO:</strong> {donation.ngo_name || "Not available"}</p>
                    </div>

                    {donation.status === "Pending" && (
                      <div className="donation-actions">
                        <button className="accept-button" disabled={updatingId === donation.id} onClick={() => updateStatus(donation.id, "Accepted")}>
                          {updatingId === donation.id ? "Updating..." : "✅ Accept"}
                        </button>
                        <button
                          className="reject-button"
                          disabled={updatingId === donation.id}
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Reject this donation? The NGO requirement will not be fulfilled by a rejected donation."
                            );

                            if (confirmed) {
                              updateStatus(
                                donation.id,
                                "Rejected"
                              );
                            }
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}

                    {donation.status === "Accepted" && (
                      <>
                        <div className="donation-actions">
                          <button
                            className="collect-button"
                            disabled={
                              updatingId === donation.id
                            }
                            onClick={() =>
                              updateStatus(
                                donation.id,
                                "Collected"
                              )
                            }
                          >
                            🚚 Mark as Collected
                          </button>
                        </div>

                        <div className="history-status-message">
                          <span>
                            🔒 Accepted donation. Donor cannot delete it.
                          </span>
                        </div>
                      </>
                    )}

                    {activeTab === "history" && (
                      <div className="history-status-message">
                        {donation.status === "Accepted" && <span>✅ Donation accepted by your NGO.</span>}
                        {donation.status === "Rejected" && <span>❌ Donation was rejected.</span>}
                        {donation.status === "Collected" && <span>🚚 Donation has been collected.</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>

    </div>
  );
}

export default NGODashboard;