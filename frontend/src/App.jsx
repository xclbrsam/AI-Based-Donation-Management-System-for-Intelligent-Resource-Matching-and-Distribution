import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import RegisterChoice from "./Pages/RegisterChoice/RegisterChoice";

import DonorRegister from "./Pages/Donor/DonorRegister";
import DonorDashboard from "./Pages/Donor/DonorDashboard";
import DonateItem from "./Pages/Donor/DonateItem";
import MyDonations from "./Pages/Donor/MyDonations";
import EditDonation from "./Pages/Donor/EditDonation";

import NGORegister from "./Pages/NGO/NGORegister";
import NGODashboard from "./Pages/NGO/NGODashboard";
import NGOProfile from "./Pages/NGO/NGOProfile";
import NGOWorkspacePage from "./Pages/NGO/NGOWorkspacePage";
import ExploreNGOs from "./Pages/NGO/ExploreNGOs";
import NGODetails from "./Pages/NGO/NGODetails";

import DonorProfile from "./Pages/Donor/DonorProfile";
import MyActivity from "./Pages/Donor/MyActivity";
import DonorNotifications from "./Pages/Donor/DonorNotifications";
import DonorSettings from "./Pages/Donor/DonorSettings";
import DonorLayout from "./components/DonorLayout/DonorLayout";
import NGOLayout from "./components/NGOLayout/NGOLayout";
import VoiceAssistant from "./components/voice/VoiceAssistant";


// =====================================================
// GET CURRENT USER TYPE
// =====================================================

const getUserType = () => {
  return String(
    localStorage.getItem("user_type") || ""
  )
    .trim()
    .toLowerCase();
};


// =====================================================
// CHECK LOGIN
// =====================================================

const isLoggedIn = () => {
  return Boolean(
    localStorage.getItem("access")
  );
};


// =====================================================
// DONOR PROTECTED ROUTE
// =====================================================

function DonorRoute({ children }) {

  if (!isLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const userType = getUserType();

  // NGO cannot access donor pages
  if (userType === "ngo") {
    return (
      <Navigate
        to="/ngo-dashboard"
        replace
      />
    );
  }

  // Invalid user type
  if (userType !== "donor") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// NGO PROTECTED ROUTE
// =====================================================

function NGORoute({ children }) {

  if (!isLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const userType = getUserType();

  // Donor cannot access NGO pages
  if (userType === "donor") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // Invalid user type
  if (userType !== "ngo") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// APP
// =====================================================

function App() {
  const location = useLocation();
  const donorRoute = [
    "/dashboard",
    "/donate-item",
    "/my-donations",
    "/my-activity",
    "/notifications",
    "/profile",
    "/settings",
  ].some((path) => location.pathname === path || location.pathname.startsWith("/edit-donation/"));
  const ngoRoute = location.pathname.startsWith("/ngo-");

  return (
    <>
      {/* =================================================
          GLOBAL NAVBAR
          Contains ThemeToggle
      ================================================= */}

      {!donorRoute && !ngoRoute && <Navbar />}


      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<RegisterChoice />}
        />
        <Route
          path="/explore-ngos"
          element={<ExploreNGOs />}
        />
        <Route
          path="/ngo-details/:id"
          element={<NGODetails />}
        />



        {/* =================================================
            DONOR REGISTER
        ================================================= */}

        <Route
          path="/register/donor"
          element={<DonorRegister />}
        />


        {/* =================================================
            NGO REGISTER
        ================================================= */}

        <Route
          path="/register/ngo"
          element={<NGORegister />}
        />
        


        {/* =================================================
            DONOR DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={
            <DonorRoute>
              <DonorLayout><DonorDashboard /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            DONATE ITEM
        ================================================= */}

        <Route
          path="/donate-item"
          element={
            <DonorRoute>
              <DonorLayout><DonateItem /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            EDIT DONATION
        ================================================= */}

        <Route
          path="/edit-donation/:id"
          element={
            <DonorRoute>
              <DonorLayout><EditDonation /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            MY DONATIONS
        ================================================= */}

        <Route
          path="/my-donations"
          element={
            <DonorRoute>
              <DonorLayout><MyDonations /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            DONOR PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={
            <DonorRoute>
              <DonorLayout><DonorProfile /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            DONOR ACTIVITY
        ================================================= */}

        <Route
          path="/my-activity"
          element={
            <DonorRoute>
              <DonorLayout><MyActivity /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            DONOR NOTIFICATIONS
        ================================================= */}

        <Route
          path="/notifications"
          element={
            <DonorRoute>
              <DonorLayout><DonorNotifications /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            DONOR SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={
            <DonorRoute>
              <DonorLayout><DonorSettings /></DonorLayout>
            </DonorRoute>
          }
        />


        {/* =================================================
            NGO DASHBOARD
        ================================================= */}

        <Route
          path="/ngo-dashboard"
          element={
            <NGORoute>
              <NGOLayout><NGODashboard /></NGOLayout>
            </NGORoute>
          }
        />


        {/* =================================================
            NGO PROFILE
        ================================================= */}

        <Route
          path="/ngo-profile"
          element={
            <NGORoute>
              <NGOLayout><NGOProfile /></NGOLayout>
            </NGORoute>
          }
        />


        <Route path="/ngo-donations" element={<NGORoute><NGOLayout><NGOWorkspacePage type="donations" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-requirements" element={<NGORoute><NGOLayout><NGOWorkspacePage type="requirements" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-allocations" element={<NGORoute><NGOLayout><NGOWorkspacePage type="allocations" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-pickups" element={<NGORoute><NGOLayout><NGOWorkspacePage type="pickups" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-analytics" element={<NGORoute><NGOLayout><NGOWorkspacePage type="analytics" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-impact" element={<NGORoute><NGOLayout><NGOWorkspacePage type="impact" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-notifications" element={<NGORoute><NGOLayout><NGOWorkspacePage type="notifications" /></NGOLayout></NGORoute>} />
        <Route path="/ngo-settings" element={<NGORoute><NGOLayout><NGOWorkspacePage type="settings" /></NGOLayout></NGORoute>} />

        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      <VoiceAssistant />

    </>
  );
}

export default App;