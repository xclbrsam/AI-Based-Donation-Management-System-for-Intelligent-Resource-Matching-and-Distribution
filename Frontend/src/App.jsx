import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import RegisterChoice from "./Pages/RegisterChoice/RegisterChoice";

import DonorRegister from "./Pages/Donor/DonorRegister";
import NGORegister from "./Pages/NGO/NGORegister";

import DonateItem from "./Pages/Donor/DonateItem";
import MyDonations from "./Pages/Donor/MyDonations";

import NGODashboard from "./Pages/NGO/NGODashboard";
import Profile from "./Pages/Profile/Profile";
import NGOProfile from "./Pages/NGO/NGOProfile";

function App() {
  return (
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
          REGISTER CHOICE
      ================================================= */}

      <Route
        path="/register"
        element={<RegisterChoice />}
      />


      {/* =================================================
          DONOR REGISTRATION
      ================================================= */}

      <Route
        path="/register/donor"
        element={<DonorRegister />}
      />


      {/* =================================================
          NGO REGISTRATION
      ================================================= */}

      <Route
        path="/register/ngo"
        element={<NGORegister />}
      />


      {/* =================================================
          DONATE ITEM
      ================================================= */}

     <Route
  path="/donate-item"
  element={<DonateItem />}
/>

      {/* =================================================
          MY DONATIONS
      ================================================= */}

      <Route
        path="/my-donations"
        element={<MyDonations />}
      />


      {/* =================================================
          DONOR DASHBOARD
      ================================================= */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />


      {/* =================================================
          DONOR PROFILE
      ================================================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* =================================================
          NGO DASHBOARD
      ================================================= */}

      <Route
        path="/ngo-dashboard"
        element={<NGODashboard />}
      />


      {/* =================================================
          NGO PROFILE
      ================================================= */}

      <Route
        path="/ngo-profile"
        element={<NGOProfile />}
      />

    </Routes>
  );
}

export default App;