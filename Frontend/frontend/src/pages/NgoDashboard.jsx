import { useState } from "react";

import {
    HeartHandshake,
    LayoutDashboard,
    Package,
    ClipboardList,
    UserCircle,
    LogOut,
    Search,
    Bell,
    ChevronRight,
    MapPin,
    Clock3,
    CheckCircle2,
    ArrowUpRight,
    Building2,
    Shirt,
    Laptop,
    BookOpen,
    Utensils,
    Sofa,
    X,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import "../styles/NgoDashboard.css";


function NgoDashboard() {

    const navigate = useNavigate();


    // =====================================================
    // USER
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


    // =====================================================
    // STATES
    // =====================================================

    const [activeSection, setActiveSection] =
        useState("dashboard");


    const [search, setSearch] =
        useState("");


    const [showNotifications, setShowNotifications] =
        useState(false);


    // =====================================================
    // DEMO DONATIONS
    // =====================================================

    const [donations] = useState([

        {
            id: 1,

            item: "Winter Clothes",

            category: "Clothing",

            description:
                "Clean winter clothes suitable for adults.",

            location:
                "Pune, Maharashtra",

            time:
                "2 hours ago",

            quantity:
                "12 items",

            icon:
                "clothing",

            status:
                "Available",

        },

        {
            id: 2,

            item: "Laptop",

            category: "Electronics",

            description:
                "Working laptop suitable for educational use.",

            location:
                "Mumbai, Maharashtra",

            time:
                "5 hours ago",

            quantity:
                "1 item",

            icon:
                "laptop",

            status:
                "Available",

        },

        {
            id: 3,

            item: "Books",

            category: "Education",

            description:
                "School and college books in good condition.",

            location:
                "Nashik, Maharashtra",

            time:
                "Yesterday",

            quantity:
                "35 items",

            icon:
                "books",

            status:
                "Available",

        },

        {
            id: 4,

            item: "Food Supplies",

            category: "Food",

            description:
                "Packaged food supplies with good shelf life.",

            location:
                "Pune, Maharashtra",

            time:
                "Yesterday",

            quantity:
                "8 boxes",

            icon:
                "food",

            status:
                "Available",

        },

        {
            id: 5,

            item: "Study Table",

            category:
                "Furniture",

            description:
                "Wooden study table in usable condition.",

            location:
                "Satara, Maharashtra",

            time:
                "2 days ago",

            quantity:
                "1 item",

            icon:
                "furniture",

            status:
                "Available",

        },

    ]);


    // =====================================================
    // RECENT REQUESTS
    // =====================================================

    const requests = [

        {
            id: 1,

            item:
                "School Books",

            donor:
                "Anonymous Donor",

            date:
                "10 Aug 2026",

            status:
                "Pending",

        },

        {
            id: 2,

            item:
                "Laptops",

            donor:
                "Community Donor",

            date:
                "09 Aug 2026",

            status:
                "Approved",

        },

        {
            id: 3,

            item:
                "Winter Clothes",

            donor:
                "Anonymous Donor",

            date:
                "08 Aug 2026",

            status:
                "Completed",

        },

    ];


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
            "/login",
            {
                replace: true,
            }
        );

    };


    // =====================================================
    // FILTER DONATIONS
    // =====================================================

    const filteredDonations =
        donations.filter(
            (donation) => {

                const searchText =
                    search
                        .toLowerCase()
                        .trim();


                if (!searchText) {

                    return true;

                }


                return (

                    donation.item
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    donation.category
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    donation.location
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                );

            }
        );


    // =====================================================
    // ICON
    // =====================================================

    const getDonationIcon = (
        type
    ) => {

        switch (type) {

            case "clothing":

                return (
                    <Shirt
                        size={24}
                    />
                );


            case "laptop":

                return (
                    <Laptop
                        size={24}
                    />
                );


            case "books":

                return (
                    <BookOpen
                        size={24}
                    />
                );


            case "food":

                return (
                    <Utensils
                        size={24}
                    />
                );


            case "furniture":

                return (
                    <Sofa
                        size={24}
                    />
                );


            default:

                return (
                    <Package
                        size={24}
                    />
                );

        }

    };


    // =====================================================
    // USERNAME
    // =====================================================

    const username =
        user?.username ||
        "NGO";


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="ngo-dashboard-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="ngo-sidebar">


                {/* LOGO */}

                <Link
                    to="/"
                    className="ngo-brand"
                >

                    <div className="ngo-brand-icon">

                        <HeartHandshake
                            size={21}
                        />

                    </div>


                    <div>

                        <strong>
                            KindLink
                        </strong>

                        <span>
                            NGO Portal
                        </span>

                    </div>

                </Link>


                {/* NAVIGATION */}

                <div className="ngo-nav-section">

                    <span className="ngo-nav-label">
                        WORKSPACE
                    </span>


                    <button
                        className={
                            activeSection === "dashboard"
                                ? "ngo-nav-item active"
                                : "ngo-nav-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "dashboard"
                            )
                        }
                    >

                        <LayoutDashboard
                            size={18}
                        />

                        Dashboard

                    </button>


                    <button
                        className={
                            activeSection === "donations"
                                ? "ngo-nav-item active"
                                : "ngo-nav-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "donations"
                            )
                        }
                    >

                        <Package
                            size={18}
                        />

                        Available Donations

                        <span className="nav-count">
                            5
                        </span>

                    </button>


                    <button
                        className={
                            activeSection === "requests"
                                ? "ngo-nav-item active"
                                : "ngo-nav-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "requests"
                            )
                        }
                    >

                        <ClipboardList
                            size={18}
                        />

                        My Requests

                        <span className="nav-count">
                            3
                        </span>

                    </button>

                </div>


                {/* ACCOUNT */}

                <div className="ngo-nav-section">

                    <span className="ngo-nav-label">
                        ACCOUNT
                    </span>


                    <Link
                        to="/profile"
                        className="ngo-nav-item"
                    >

                        <UserCircle
                            size={18}
                        />

                        NGO Profile

                    </Link>

                </div>


                {/* SIDEBAR BOTTOM */}

                <div className="ngo-sidebar-bottom">


                    <div className="ngo-help-card">

                        <HeartHandshake
                            size={20}
                        />

                        <strong>
                            Make an impact
                        </strong>

                        <p>
                            Connect useful donations
                            with people who need them.
                        </p>

                    </div>


                    <button
                        className="ngo-logout"
                        onClick={
                            handleLogout
                        }
                    >

                        <LogOut
                            size={17}
                        />

                        Sign Out

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="ngo-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <header className="ngo-header">


                    <div>

                        <span className="ngo-page-label">
                            NGO WORKSPACE
                        </span>

                        <h1>
                            Good evening, {username}.
                        </h1>

                        <p>
                            Here is what's happening
                            with your organization's
                            donation activity.
                        </p>

                    </div>


                    <div className="ngo-header-actions">


                        {/* SEARCH */}

                        <div className="ngo-search">

                            <Search
                                size={16}
                            />

                            <input
                                type="text"
                                placeholder="Search donations..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {
                                search && (

                                    <button
                                        onClick={() =>
                                            setSearch("")
                                        }
                                    >

                                        <X
                                            size={14}
                                        />

                                    </button>

                                )
                            }

                        </div>


                        {/* NOTIFICATION */}

                        <button
                            className="ngo-notification"
                            onClick={() =>
                                setShowNotifications(
                                    !showNotifications
                                )
                            }
                        >

                            <Bell
                                size={18}
                            />

                            <span></span>

                        </button>


                        {/* PROFILE */}

                        <Link
                            to="/profile"
                            className="ngo-user"
                        >

                            <div className="ngo-avatar">

                                {
                                    username
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>


                            <div>

                                <strong>
                                    {username}
                                </strong>

                                <span>
                                    NGO Account
                                </span>

                            </div>

                        </Link>

                    </div>


                    {/* NOTIFICATION PANEL */}

                    {
                        showNotifications && (

                            <div className="ngo-notification-panel">

                                <div className="notification-header">

                                    <strong>
                                        Notifications
                                    </strong>

                                    <button
                                        onClick={() =>
                                            setShowNotifications(
                                                false
                                            )
                                        }
                                    >

                                        <X
                                            size={15}
                                        />

                                    </button>

                                </div>


                                <div className="notification-item">

                                    <div>
                                        <CheckCircle2
                                            size={17}
                                        />
                                    </div>

                                    <p>

                                        New laptop donation
                                        is available.

                                        <span>
                                            2 hours ago
                                        </span>

                                    </p>

                                </div>


                                <div className="notification-item">

                                    <div>
                                        <HeartHandshake
                                            size={17}
                                        />
                                    </div>

                                    <p>

                                        Your donation request
                                        was approved.

                                        <span>
                                            Yesterday
                                        </span>

                                    </p>

                                </div>

                            </div>

                        )
                    }

                </header>


                {/* =================================================
                    DASHBOARD CONTENT
                ================================================= */}

                {
                    activeSection === "dashboard" && (

                        <>


                            {/* =================================================
                                STATISTICS
                            ================================================= */}

                            <section className="ngo-stats">


                                <div className="ngo-stat-card">

                                    <div className="ngo-stat-icon pink">

                                        <Package
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <span>
                                            Available Donations
                                        </span>

                                        <strong>
                                            24
                                        </strong>

                                        <small className="positive">
                                            +8 this week
                                        </small>

                                    </div>


                                    <ArrowUpRight
                                        size={17}
                                        className="stat-arrow"
                                    />

                                </div>


                                <div className="ngo-stat-card">

                                    <div className="ngo-stat-icon dark">

                                        <ClipboardList
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <span>
                                            Active Requests
                                        </span>

                                        <strong>
                                            8
                                        </strong>

                                        <small>
                                            3 pending
                                        </small>

                                    </div>


                                    <ArrowUpRight
                                        size={17}
                                        className="stat-arrow"
                                    />

                                </div>


                                <div className="ngo-stat-card">

                                    <div className="ngo-stat-icon green">

                                        <CheckCircle2
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <span>
                                            Completed
                                        </span>

                                        <strong>
                                            47
                                        </strong>

                                        <small className="positive">
                                            +12 this month
                                        </small>

                                    </div>


                                    <ArrowUpRight
                                        size={17}
                                        className="stat-arrow"
                                    />

                                </div>


                                <div className="ngo-stat-card">

                                    <div className="ngo-stat-icon purple">

                                        <HeartHandshake
                                            size={20}
                                        />

                                    </div>


                                    <div>

                                        <span>
                                            People Helped
                                        </span>

                                        <strong>
                                            186
                                        </strong>

                                        <small className="positive">
                                            +24 this month
                                        </small>

                                    </div>


                                    <ArrowUpRight
                                        size={17}
                                        className="stat-arrow"
                                    />

                                </div>

                            </section>


                            {/* =================================================
                                SECTION HEADER
                            ================================================= */}

                            <div className="ngo-section-title">

                                <div>

                                    <span>
                                        DONATION NETWORK
                                    </span>

                                    <h2>
                                        Donations you may need
                                    </h2>

                                </div>


                                <button
                                    className="view-all-btn"
                                    onClick={() =>
                                        setActiveSection(
                                            "donations"
                                        )
                                    }
                                >

                                    View all

                                    <ChevronRight
                                        size={15}
                                    />

                                </button>

                            </div>


                            {/* =================================================
                                DONATION CARDS
                            ================================================= */}

                            <section className="ngo-donation-grid">

                                {
                                    filteredDonations
                                        .slice(0, 4)
                                        .map(
                                            (donation) => (

                                                <div
                                                    className="ngo-donation-card"
                                                    key={
                                                        donation.id
                                                    }
                                                >


                                                    <div className="donation-card-top">

                                                        <div className="donation-item-icon">

                                                            {
                                                                getDonationIcon(
                                                                    donation.icon
                                                                )
                                                            }

                                                        </div>


                                                        <span className="available-badge">

                                                            <span></span>

                                                            Available

                                                        </span>

                                                    </div>


                                                    <h3>
                                                        {
                                                            donation.item
                                                        }
                                                    </h3>


                                                    <span className="donation-category">

                                                        {
                                                            donation.category
                                                        }

                                                    </span>


                                                    <p>
                                                        {
                                                            donation.description
                                                        }
                                                    </p>


                                                    <div className="donation-meta">

                                                        <span>

                                                            <MapPin
                                                                size={13}
                                                            />

                                                            {
                                                                donation.location
                                                            }

                                                        </span>


                                                        <span>

                                                            <Clock3
                                                                size={13}
                                                            />

                                                            {
                                                                donation.time
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="donation-card-footer">

                                                        <strong>
                                                            {
                                                                donation.quantity
                                                            }
                                                        </strong>


                                                        <button>

                                                            View Donation

                                                            <ArrowUpRight
                                                                size={14}
                                                            />

                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )
                                }


                                {
                                    filteredDonations.length === 0 && (

                                        <div className="ngo-empty">

                                            <Package
                                                size={35}
                                            />

                                            <h3>
                                                No donations found
                                            </h3>

                                            <p>
                                                Try searching
                                                for another item.
                                            </p>

                                        </div>

                                    )
                                }

                            </section>


                            {/* =================================================
                                LOWER SECTION
                            ================================================= */}

                            <section className="ngo-lower-grid">


                                {/* REQUESTS */}

                                <div className="ngo-panel">


                                    <div className="ngo-panel-header">

                                        <div>

                                            <span>
                                                ACTIVITY
                                            </span>

                                            <h2>
                                                Recent Requests
                                            </h2>

                                        </div>


                                        <button
                                            onClick={() =>
                                                setActiveSection(
                                                    "requests"
                                                )
                                            }
                                        >

                                            View all

                                        </button>

                                    </div>


                                    <div className="request-list">

                                        {
                                            requests.map(
                                                (
                                                    request
                                                ) => (

                                                    <div
                                                        className="request-row"
                                                        key={
                                                            request.id
                                                        }
                                                    >

                                                        <div className="request-icon">

                                                            <ClipboardList
                                                                size={17}
                                                            />

                                                        </div>


                                                        <div className="request-info">

                                                            <strong>
                                                                {
                                                                    request.item
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    request.donor
                                                                }
                                                            </span>

                                                        </div>


                                                        <div className="request-date">

                                                            {
                                                                request.date
                                                            }

                                                        </div>


                                                        <span
                                                            className={
                                                                `request-status ${
                                                                    request.status
                                                                        .toLowerCase()
                                                                }`
                                                            }
                                                        >

                                                            {
                                                                request.status
                                                            }

                                                        </span>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                </div>


                                {/* ORGANIZATION CARD */}

                                <div className="ngo-organization-card">

                                    <div className="organization-decoration">

                                        <HeartHandshake
                                            size={100}
                                        />

                                    </div>


                                    <div className="organization-content">

                                        <div className="organization-icon">

                                            <Building2
                                                size={21}
                                            />

                                        </div>


                                        <span>
                                            YOUR ORGANIZATION
                                        </span>


                                        <h2>
                                            Make every donation
                                            count.
                                        </h2>


                                        <p>

                                            Keep your NGO profile
                                            updated so donors and
                                            communities can better
                                            understand your work.

                                        </p>


                                        <Link
                                            to="/profile"
                                            className="organization-btn"
                                        >

                                            Manage Profile

                                            <ArrowRightIcon />

                                        </Link>

                                    </div>

                                </div>

                            </section>

                        </>

                    )
                }


                {/* =================================================
                    ALL DONATIONS
                ================================================= */}

                {
                    activeSection === "donations" && (

                        <section className="ngo-full-section">

                            <div className="ngo-section-title">

                                <div>

                                    <span>
                                        DONATION NETWORK
                                    </span>

                                    <h2>
                                        Available Donations
                                    </h2>

                                </div>

                            </div>


                            <section className="ngo-donation-grid">

                                {
                                    filteredDonations.map(
                                        (
                                            donation
                                        ) => (

                                            <div
                                                className="ngo-donation-card"
                                                key={
                                                    donation.id
                                                }
                                            >

                                                <div className="donation-card-top">

                                                    <div className="donation-item-icon">

                                                        {
                                                            getDonationIcon(
                                                                donation.icon
                                                            )
                                                        }

                                                    </div>


                                                    <span className="available-badge">

                                                        <span></span>

                                                        Available

                                                    </span>

                                                </div>


                                                <h3>
                                                    {
                                                        donation.item
                                                    }
                                                </h3>


                                                <span className="donation-category">

                                                    {
                                                        donation.category
                                                    }

                                                </span>


                                                <p>
                                                    {
                                                        donation.description
                                                    }
                                                </p>


                                                <div className="donation-meta">

                                                    <span>

                                                        <MapPin
                                                            size={13}
                                                        />

                                                        {
                                                            donation.location
                                                        }

                                                    </span>

                                                    <span>

                                                        <Clock3
                                                            size={13}
                                                        />

                                                        {
                                                            donation.time
                                                        }

                                                    </span>

                                                </div>


                                                <div className="donation-card-footer">

                                                    <strong>
                                                        {
                                                            donation.quantity
                                                        }
                                                    </strong>


                                                    <button>

                                                        Request

                                                        <ArrowUpRight
                                                            size={14}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        )
                                    )
                                }

                            </section>

                        </section>

                    )
                }


                {/* =================================================
                    REQUESTS
                ================================================= */}

                {
                    activeSection === "requests" && (

                        <section className="ngo-full-section">

                            <div className="ngo-section-title">

                                <div>

                                    <span>
                                        DONATION ACTIVITY
                                    </span>

                                    <h2>
                                        My Requests
                                    </h2>

                                </div>

                            </div>


                            <div className="ngo-panel">

                                <div className="request-list">

                                    {
                                        requests.map(
                                            (
                                                request
                                            ) => (

                                                <div
                                                    className="request-row"
                                                    key={
                                                        request.id
                                                    }
                                                >

                                                    <div className="request-icon">

                                                        <ClipboardList
                                                            size={17}
                                                        />

                                                    </div>


                                                    <div className="request-info">

                                                        <strong>
                                                            {
                                                                request.item
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                request.donor
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="request-date">

                                                        {
                                                            request.date
                                                        }

                                                    </div>


                                                    <span
                                                        className={
                                                            `request-status ${
                                                                request.status
                                                                    .toLowerCase()
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            request.status
                                                        }

                                                    </span>

                                                </div>

                                            )
                                        )
                                    }

                                </div>

                            </div>

                        </section>

                    )
                }

            </main>

        </div>

    );

}


/* =========================================================
   SMALL ARROW COMPONENT
========================================================= */

function ArrowRightIcon() {

    return (

        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >

            <path
                d="M5 12h14"
            />

            <path
                d="m13 6 6 6-6 6"
            />

        </svg>

    );

}


export default NgoDashboard;