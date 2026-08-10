import { Link, useNavigate } from "react-router-dom";

import {
    HeartHandshake,
    User,
    Plus,
    LogOut,
    History,
    Settings,
} from "lucide-react";

import "../styles/DonorDashboard.css";


function DonorDashboard() {

    const navigate =
        useNavigate();


    const user = JSON.parse(
        localStorage.getItem(
            "user"
        ) || "{}"
    );


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate(
            "/login"
        );

    };


    return (

        <div className="donor-dashboard">


            {/* =====================================
                NAVBAR
            ===================================== */}

            <header className="donor-navbar">


                <Link
                    to="/"
                    className="donor-brand"
                >

                    <div className="brand-icon">

                        <HeartHandshake
                            size={22}
                        />

                    </div>


                    <div>

                        <strong>
                            KindLink
                        </strong>

                        <small>
                            AI Donation Platform
                        </small>

                    </div>

                </Link>


                {/* RIGHT SIDE */}

                <div className="donor-nav-right">


                    <Link
                        to="/profile"
                        className="profile-nav-button"
                    >

                        <div className="nav-avatar">

                            {
                                (
                                    user.username ||
                                    "D"
                                )
                                .charAt(0)
                                .toUpperCase()
                            }

                        </div>


                        <div className="nav-user-info">

                            <strong>

                                {
                                    user.username ||
                                    "Donor"
                                }

                            </strong>


                            <small>
                                Donor
                            </small>

                        </div>

                    </Link>


                    <button
                        className="logout-button"
                        onClick={
                            logout
                        }
                    >

                        <LogOut
                            size={17}
                        />

                        Logout

                    </button>

                </div>

            </header>


            {/* =====================================
                MAIN
            ===================================== */}

            <main className="donor-dashboard-main">


                {/* WELCOME */}

                <section className="donor-welcome">

                    <div>

                        <span>
                            DONOR DASHBOARD
                        </span>


                        <h1>

                            Welcome back,{" "}

                            {
                                user.username ||
                                "Donor"
                            }

                            👋

                        </h1>


                        <p>

                            Turn things you no longer
                            need into meaningful help
                            for someone who does.

                        </p>

                    </div>


                    <Link
                        to="/donation"
                        className="main-donate-button"
                    >

                        <Plus
                            size={18}
                        />

                        Donate an Item

                    </Link>

                </section>


                {/* =====================================
                    QUICK ACTIONS
                ===================================== */}

                <section className="dashboard-section">

                    <div className="section-title">

                        <span>
                            QUICK ACTIONS
                        </span>

                        <h2>
                            What would you like to do?
                        </h2>

                    </div>


                    <div className="dashboard-cards">


                        {/* DONATE */}

                        <Link
                            to="/donation"
                            className="dashboard-card"
                        >

                            <div className="card-icon">

                                <HeartHandshake
                                    size={25}
                                />

                            </div>


                            <h3>
                                Donate an Item
                            </h3>


                            <p>

                                Upload an item and
                                let our AI identify
                                it before donation.

                            </p>


                            <span>
                                Start Donation →
                            </span>

                        </Link>


                        {/* PROFILE */}

                        <Link
                            to="/profile"
                            className="dashboard-card"
                        >

                            <div className="card-icon">

                                <User
                                    size={25}
                                />

                            </div>


                            <h3>
                                My Profile
                            </h3>


                            <p>

                                View and update your
                                personal information
                                and preferences.

                            </p>


                            <span>
                                View Profile →
                            </span>

                        </Link>


                        {/* HISTORY */}

                        <div
                            className="dashboard-card"
                        >

                            <div className="card-icon">

                                <History
                                    size={25}
                                />

                            </div>


                            <h3>
                                Donation History
                            </h3>


                            <p>

                                View your previous
                                donations and their
                                current status.

                            </p>


                            <span>
                                Coming Soon
                            </span>

                        </div>


                        {/* SETTINGS */}

                        <div
                            className="dashboard-card"
                        >

                            <div className="card-icon">

                                <Settings
                                    size={25}
                                />

                            </div>


                            <h3>
                                Preferences
                            </h3>


                            <p>

                                Manage your account
                                preferences.

                            </p>


                            <span>
                                Coming Soon
                            </span>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    PROFILE SUMMARY
                ===================================== */}

                <section className="profile-summary">


                    <div className="profile-summary-left">


                        <div className="large-avatar">

                            {
                                (
                                    user.username ||
                                    "D"
                                )
                                .charAt(0)
                                .toUpperCase()
                            }

                        </div>


                        <div>

                            <span>
                                YOUR ACCOUNT
                            </span>


                            <h2>

                                {
                                    user.username ||
                                    "Donor"
                                }

                            </h2>


                            <p>

                                {
                                    user.email ||
                                    "Email not available"
                                }

                            </p>

                        </div>

                    </div>


                    <Link
                        to="/profile"
                        className="view-profile-button"
                    >

                        <User
                            size={16}
                        />

                        View Full Profile

                    </Link>

                </section>

            </main>

        </div>

    );

}


export default DonorDashboard;