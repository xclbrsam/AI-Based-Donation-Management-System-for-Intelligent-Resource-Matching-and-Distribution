import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Donation from "./pages/Donation.jsx";

import DonorDashboard from "./pages/DonorDashboard.jsx";
import NgoDashboard from "./pages/NgoDashboard.jsx";


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem("user") || "null"
        );

    } catch (error) {

        return null;

    }

}


// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({
    children,
    allowedRole = null,
}) {

    const token =
        localStorage.getItem(
            "access_token"
        );

    const user =
        getCurrentUser();


    // =================================================
    // NOT LOGGED IN
    // =================================================

    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =================================================
    // ROLE PROTECTION
    // =================================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        // Donor trying to access NGO page

        if (
            user.role === "Donor"
        ) {

            return (
                <Navigate
                    to="/donor-dashboard"
                    replace
                />
            );

        }


        // NGO trying to access Donor page

        if (
            user.role === "NGO"
        ) {

            return (
                <Navigate
                    to="/ngo-dashboard"
                    replace
                />
            );

        }


        // Unknown role

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
// PROFILE ROUTE
// =====================================================

function ProfileRoute() {

    const token =
        localStorage.getItem(
            "access_token"
        );

    const user =
        getCurrentUser();


    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return <Profile />;

}


// =====================================================
// APP
// =====================================================

function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================================
                    PROFILE
                    Both Donor and NGO can access their profile.
                ================================================= */}

                <Route
                    path="/profile"
                    element={
                        <ProfileRoute />
                    }
                />


                {/* =================================================
                    DONOR DASHBOARD
                ================================================= */}

                <Route
                    path="/donor-dashboard"
                    element={

                        <ProtectedRoute
                            allowedRole="Donor"
                        >

                            <DonorDashboard />

                        </ProtectedRoute>

                    }
                />


                {/* =================================================
                    NGO DASHBOARD
                ================================================= */}

                <Route
                    path="/ngo-dashboard"
                    element={

                        <ProtectedRoute
                            allowedRole="NGO"
                        >

                            <NgoDashboard />

                        </ProtectedRoute>

                    }
                />


                {/* =================================================
                    DONATION
                    ONLY DONORS CAN ACCESS
                ================================================= */}

                <Route
                    path="/donation"
                    element={

                        <ProtectedRoute
                            allowedRole="Donor"
                        >

                            <Donation />

                        </ProtectedRoute>

                    }
                />


                {/* =================================================
                    UNKNOWN URL
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

        </BrowserRouter>

    );

}


export default App;