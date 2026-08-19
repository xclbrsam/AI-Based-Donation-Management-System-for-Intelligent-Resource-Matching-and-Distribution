import { Navigate, Routes, Route } from "react-router-dom";

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

import DonorProfile from "./Pages/Donor/DonorProfile";


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

  return (
    <>
      {/* =================================================
          GLOBAL NAVBAR
          Contains ThemeToggle
      ================================================= */}

      <Navbar />


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
              <DonorDashboard />
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
              <DonateItem />
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
              <EditDonation />
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
              <MyDonations />
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
              <DonorProfile />
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
              <NGODashboard />
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
              <NGOProfile />
            </NGORoute>
          }
        />


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

    </>
  );
}

export default App;