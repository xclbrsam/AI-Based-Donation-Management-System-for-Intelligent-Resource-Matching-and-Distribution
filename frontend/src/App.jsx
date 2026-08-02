import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import DonorDashboard from "./pages/DonorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";

import Donate from "./pages/Donate";
import Donations from "./pages/Donations";
import Users from "./pages/users";
import NGOs from "./pages/NGOs";
import Requests from "./pages/requests";
import Reports from "./pages/reports";
import Settings from "./pages/Settings";
import EditDonation from "./pages/EditDonation";
import NgoDonations from "./pages/NgoDonations";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<DonorDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/ngo-dashboard" element={<NgoDashboard />} />

      <Route path="/donate" element={<Donate />} />
      <Route path="/donations" element={<Donations />} />
<Route
  path="/edit-donation/:id"
  element={<EditDonation />}
/>
      <Route path="/users" element={<Users />} />
      <Route path="/ngos" element={<NGOs />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/ngo-donations" element={<NgoDonations />} />
    </Routes>
  );
}

export default App;