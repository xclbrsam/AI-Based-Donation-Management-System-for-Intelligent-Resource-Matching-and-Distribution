import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import RegisterChoice from "./pages/RegisterChoice/RegisterChoice";

// =====================================================
// DONOR PAGES
// =====================================================

import DonorRegister from "./pages/Donor/DonorRegister";
import DonorDashboard from "./pages/Donor/DonorDashboard";
import DonateItem from "./pages/Donor/DonateItem";
import MyDonations from "./pages/Donor/MyDonations";
import EditDonation from "./pages/Donor/EditDonation";
import DonorProfile from "./pages/Donor/DonorProfile";
import MyActivity from "./pages/Donor/MyActivity";
import DonorNotifications from "./pages/Donor/DonorNotifications";
import DonorSettings from "./pages/Donor/DonorSettings";
import RankingPage from "./pages/Ranking/RankingPage";
import { RankingProvider } from "./context/RankingContext";

// =====================================================
// NGO PAGES
// =====================================================

import NGORegister from "./pages/NGO/NGORegister";
import NGODashboard from "./pages/NGO/NGODashboard";
import NGOProfile from "./pages/NGO/NGOProfile";
import NGOWorkspacePage from "./pages/NGO/NGOWorkspacePage";
import ExploreNGOs from "./pages/NGO/ExploreNGOs";
import NGODetails from "./pages/NGO/NGODetails";

// =====================================================
// LAYOUTS
// =====================================================

import DonorLayout from "./components/DonorLayout/DonorLayout";
import NGOLayout from "./components/NGOLayout/NGOLayout";
import AdminLayout from "./components/AdminLayout/AdminLayout";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminNGOs from "./pages/Admin/AdminNGOs";
import AdminDonors from "./pages/Admin/AdminDonors";
import AdminDonations from "./pages/Admin/AdminDonations";
import AdminRanking from "./pages/Admin/AdminRanking";
import AdminRequirements from "./pages/Admin/AdminRequirements";
import AdminAllocations from "./pages/Admin/AdminAllocations";
import AdminPickups from "./pages/Admin/AdminPickups";
import AdminNotifications from "./pages/Admin/AdminNotifications";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminSettings from "./pages/Admin/AdminSettings";


// =====================================================
// USER TYPE
// =====================================================

const getUserType = () => {

    return String(
        localStorage.getItem("user_type") || ""
    )
        .trim()
        .toLowerCase();

};


// =====================================================
// LOGIN CHECK
// =====================================================

const isLoggedIn = () => {

    return Boolean(
        localStorage.getItem("access")
    );

};


// =====================================================
// DONOR ROUTE
// =====================================================

function DonorRoute({ children }) {

    const userType = getUserType();

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (userType === "ngo") {

        return (
            <Navigate
                to="/ngo-dashboard"
                replace
            />
        );

    }


    if (userType === "admin") {

        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );

    }


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
// NGO ROUTE
// =====================================================

function NGORoute({ children }) {

    const userType = getUserType();

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (userType === "donor") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    if (userType === "admin") {

        return (
            <Navigate
                to="/admin-dashboard"
                replace
            />
        );

    }


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
// ADMIN ROUTE
// =====================================================

function AdminRoute({ children }) {

    const userType = getUserType();

    if (!isLoggedIn()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (userType === "donor") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    if (userType === "ngo") {

        return (
            <Navigate
                to="/ngo-dashboard"
                replace
            />
        );

    }


    if (userType !== "admin") {

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


    // =================================================
    // HIDE GLOBAL NAVBAR
    // =================================================

    const donorRoute =
        [
            "/dashboard",
            "/donate-item",
            "/my-donations",
            "/my-activity",
            "/explore-ngos",
            "/notifications",
            "/profile",
            "/settings",
            "/ranking",
        ].some(
            (path) =>
                location.pathname === path
        )
        ||
        location.pathname.startsWith(
            "/edit-donation/"
        );


    const ngoRoute =
        location.pathname.startsWith(
            "/ngo-"
        );


    const adminRoute =
        location.pathname.startsWith(
            "/admin-"
        );


    return (

        <RankingProvider>

            {!donorRoute &&
                !ngoRoute &&
                !adminRoute &&
                <Navbar />
            }


            <Routes>


                {/* =================================================
                    PUBLIC
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
                    element={<RegisterChoice />}
                />

                <Route
                    path="/explore-ngos"
                    element={
                        <DonorRoute>
                            <DonorLayout>
                                <ExploreNGOs />
                            </DonorLayout>
                        </DonorRoute>
                    }
                />

                <Route
                    path="/ngo-details/:id"
                    element={<NGODetails />}
                />


                {/* =================================================
                    REGISTRATION
                ================================================= */}

                <Route
                    path="/register/donor"
                    element={<DonorRegister />}
                />

                <Route
                    path="/register/ngo"
                    element={<NGORegister />}
                />


                {/* =================================================
                    DONOR
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <DonorDashboard />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/donate-item"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <DonateItem />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/edit-donation/:id"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <EditDonation />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/my-donations"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <MyDonations />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <DonorProfile />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/my-activity"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <MyActivity />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <DonorNotifications />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <DonorRoute>

                            <DonorLayout>
                                <DonorSettings />
                            </DonorLayout>

                        </DonorRoute>
                    }
                />

                <Route
                    path="/ranking"
                    element={
                        <DonorRoute>
                            <DonorLayout>
                                <RankingPage showCurrentRank />
                            </DonorLayout>
                        </DonorRoute>
                    }
                />


                {/* =================================================
                    NGO
                ================================================= */}

                <Route
                    path="/ngo-dashboard"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGODashboard />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-profile"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOProfile />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-donations"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="donations"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-requirements"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="requirements"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-allocations"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="allocations"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-pickups"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="pickups"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-analytics"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="analytics"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-impact"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="impact"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-notifications"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="notifications"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-settings"
                    element={
                        <NGORoute>

                            <NGOLayout>
                                <NGOWorkspacePage
                                    type="settings"
                                />
                            </NGOLayout>

                        </NGORoute>
                    }
                />

                <Route
                    path="/ngo-ranking"
                    element={
                        <NGORoute>
                            <NGOLayout>
                                <RankingPage />
                            </NGOLayout>
                        </NGORoute>
                    }
                />


                {/* =================================================
                    ADMIN
                ================================================= */}

                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminDashboard />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-ngos"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminNGOs />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-donors"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminDonors />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-donations"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminDonations />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-requirements"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminRequirements />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-allocations"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminAllocations />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-pickups"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminPickups />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-notifications"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminNotifications />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-analytics"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminAnalytics />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin-settings"
                    element={
                        <AdminRoute>

                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>

                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin-ranking"
                    element={
                        <AdminRoute>
                            <AdminLayout>
                                <AdminRanking />
                            </AdminLayout>
                        </AdminRoute>
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

        </RankingProvider>

    );
}

export default App;
