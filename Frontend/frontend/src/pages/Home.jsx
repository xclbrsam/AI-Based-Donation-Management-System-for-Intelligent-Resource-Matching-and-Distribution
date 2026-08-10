import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    HeartHandshake,
    ArrowRight,
    User,
    Building2,
    LogOut,
    LayoutDashboard,
    Sparkles,
} from "lucide-react";

import "../styles/Home.css";


function Home() {

    const navigate =
        useNavigate();


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    let user = null;

    try {

        user = JSON.parse(
            localStorage.getItem(
                "user"
            ) || "null"
        );

    } catch (error) {

        user = null;

    }


    const token =
        localStorage.getItem(
            "access_token"
        );


    const isLoggedIn =
        !!token && !!user;


    const role =
        user?.role || null;


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "refresh_token"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "role"
        );


        navigate(
            "/",
            {
                replace: true,
            }
        );

    };


    // =====================================================
    // DASHBOARD NAVIGATION
    // =====================================================

    const goToDashboard = () => {

        if (
            role === "Donor"
        ) {

            navigate(
                "/donor-dashboard"
            );

        }

        else if (
            role === "NGO"
        ) {

            navigate(
                "/ngo-dashboard"
            );

        }

    };


    return (

        <div className="home-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="home-navbar">


                {/* LOGO */}

                <Link
                    to="/"
                    className="home-logo"
                >

                    <div className="home-logo-icon">

                        <HeartHandshake
                            size={22}
                        />

                    </div>


                    <div>

                        <strong>
                            KindLink
                        </strong>

                        <span>
                            AI Donation Platform
                        </span>

                    </div>

                </Link>


                {/* NAVIGATION */}

                <div className="home-nav-links">

                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <a href="#impact">
                        Our Impact
                    </a>

                    <a href="#about">
                        About
                    </a>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="home-nav-actions">


                    {
                        !isLoggedIn && (

                            <>

                                <Link
                                    to="/login"
                                    className="nav-login"
                                >
                                    Login
                                </Link>


                                <Link
                                    to="/register"
                                    className="nav-register"
                                >
                                    Get Started
                                </Link>

                            </>

                        )
                    }


                    {
                        isLoggedIn && (

                            <>

                                {/* DASHBOARD BUTTON */}

                                <button
                                    type="button"
                                    className="nav-dashboard"
                                    onClick={
                                        goToDashboard
                                    }
                                >

                                    <LayoutDashboard
                                        size={16}
                                    />

                                    {
                                        role === "Donor"
                                            ? "Donor Dashboard"
                                            : "NGO Dashboard"
                                    }

                                </button>


                                {/* USER */}

                                <Link
                                    to="/profile"
                                    className="nav-user"
                                >

                                    <div className="nav-user-avatar">

                                        {
                                            (
                                                user?.username ||
                                                "U"
                                            )
                                            .charAt(0)
                                            .toUpperCase()
                                        }

                                    </div>


                                    <span>

                                        {
                                            user?.username ||
                                            "Account"
                                        }

                                    </span>

                                </Link>


                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    className="nav-logout"
                                    onClick={
                                        handleLogout
                                    }
                                    title="Logout"
                                >

                                    <LogOut
                                        size={16}
                                    />

                                </button>

                            </>

                        )
                    }

                </div>

            </nav>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="home-hero">


                {/* LEFT */}

                <div className="hero-content">


                    <div className="hero-badge">

                        <Sparkles
                            size={14}
                        />

                        AI-POWERED DONATION PLATFORM

                    </div>


                    {
                        isLoggedIn ? (

                            <>

                                <h1>

                                    Welcome back,

                                    <span>

                                        {
                                            user?.username ||
                                            "Friend"
                                        }

                                    </span>

                                </h1>


                                <p>

                                    {
                                        role === "Donor"

                                            ? "Ready to turn something you no longer need into meaningful help?"

                                            : "Welcome back to your NGO workspace. Manage your organization's donation needs and impact."

                                    }

                                </p>


                                <div className="hero-actions">


                                    <button
                                        type="button"
                                        className="primary-hero-button"
                                        onClick={
                                            goToDashboard
                                        }
                                    >

                                        <LayoutDashboard
                                            size={18}
                                        />

                                        Go to Dashboard

                                        <ArrowRight
                                            size={17}
                                        />

                                    </button>


                                    {
                                        role === "Donor" && (

                                            <Link
                                                to="/donation"
                                                className="secondary-hero-button"
                                            >

                                                Donate an Item

                                            </Link>

                                        )
                                    }

                                </div>

                            </>

                        ) : (

                            <>

                                <h1>

                                    Give what you have.

                                    <span>
                                        Change what someone needs.
                                    </span>

                                </h1>


                                <p>

                                    KindLink connects generous donors
                                    with NGOs and communities that need
                                    support. Our AI helps identify donated
                                    items and makes giving smarter,
                                    faster and more meaningful.

                                </p>


                                <div className="hero-actions">


                                    <Link
                                        to="/register"
                                        className="primary-hero-button"
                                    >

                                        Start Donating

                                        <ArrowRight
                                            size={17}
                                        />

                                    </Link>


                                    <Link
                                        to="/login"
                                        className="secondary-hero-button"
                                    >

                                        Already a member?

                                    </Link>

                                </div>

                            </>

                        )
                    }


                    {/* TRUST */}

                    <div className="hero-trust">

                        <div>

                            <strong>
                                AI
                            </strong>

                            <span>
                                Item Detection
                            </span>

                        </div>


                        <div>

                            <strong>
                                NGO
                            </strong>

                            <span>
                                Community Network
                            </span>

                        </div>


                        <div>

                            <strong>
                                100%
                            </strong>

                            <span>
                                Purpose Driven
                            </span>

                        </div>

                    </div>

                </div>


                {/* RIGHT VISUAL */}

                <div className="hero-visual">


                    <div className="hero-card-main">


                        <div className="hero-card-top">

                            <span>
                                SMART DONATION
                            </span>


                            <Sparkles
                                size={18}
                            />

                        </div>


                        <div className="hero-heart">

                            <HeartHandshake
                                size={65}
                            />

                        </div>


                        <h3>
                            Every item can make
                            a difference.
                        </h3>


                        <p>

                            AI-powered item recognition
                            helps connect your donations
                            with the right causes.

                        </p>


                        <div className="hero-card-line">

                            <span></span>

                        </div>


                        <div className="hero-card-footer">

                            <span>
                                DONATE WITH PURPOSE
                            </span>

                            <ArrowRight
                                size={15}
                            />

                        </div>

                    </div>


                    {/* FLOATING CARD */}

                    <div className="floating-card">

                        <div className="floating-icon">

                            <HeartHandshake
                                size={18}
                            />

                        </div>


                        <div>

                            <strong>
                                Real Impact
                            </strong>

                            <span>
                                One donation at a time
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section
                className="home-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>
                        Simple giving. Meaningful impact.
                    </h2>

                </div>


                <div className="steps-grid">


                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <User
                            size={24}
                        />

                        <h3>
                            Create an Account
                        </h3>

                        <p>
                            Register as a donor and
                            start your giving journey.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <Sparkles
                            size={24}
                        />

                        <h3>
                            Upload Your Item
                        </h3>

                        <p>
                            Our AI scans your image
                            and identifies the item.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <Building2
                            size={24}
                        />

                        <h3>
                            Connect With NGOs
                        </h3>

                        <p>
                            Your donation can reach
                            organizations that need it.
                        </p>

                    </div>


                    <div className="step-card">

                        <div className="step-number">
                            04
                        </div>

                        <HeartHandshake
                            size={24}
                        />

                        <h3>
                            Create Impact
                        </h3>

                        <p>
                            Turn unused items into
                            meaningful support.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                IMPACT
            ================================================= */}

            <section
                className="impact-section"
                id="impact"
            >

                <div>

                    <span>
                        OUR MISSION
                    </span>

                    <h2>
                        Giving should be simple,
                        transparent and meaningful.
                    </h2>

                    <p>

                        KindLink brings donors, NGOs and
                        intelligent technology together to
                        create a better donation experience.

                    </p>

                </div>


                <div className="impact-stats">


                    <div>

                        <strong>
                            AI
                        </strong>

                        <span>
                            Smart Item Detection
                        </span>

                    </div>


                    <div>

                        <strong>
                            2
                        </strong>

                        <span>
                            Connected Communities
                        </span>

                    </div>


                    <div>

                        <strong>
                            ∞
                        </strong>

                        <span>
                            Possibilities to Help
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section
                className="about-section"
                id="about"
            >

                <div className="about-icon">

                    <HeartHandshake
                        size={30}
                    />

                </div>


                <div>

                    <span>
                        ABOUT KINDLINK
                    </span>

                    <h2>
                        Technology that connects
                        generosity with real needs.
                    </h2>

                    <p>

                        We use AI-powered item recognition
                        to make the donation process easier
                        for donors while helping NGOs find
                        useful resources.

                    </p>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <HeartHandshake
                        size={20}
                    />

                    <strong>
                        KindLink
                    </strong>

                </div>


                <span>
                    AI Donation Platform
                </span>


                <span>
                    © 2026 KindLink
                </span>

            </footer>

        </div>

    );

}


export default Home;