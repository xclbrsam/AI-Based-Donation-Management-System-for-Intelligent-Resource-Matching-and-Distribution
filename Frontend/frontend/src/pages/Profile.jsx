import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Building2,
    CheckCircle,
    HeartHandshake,
    LogOut,
    Save,
    User,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import "../styles/Profile.css";


function Profile() {

    const navigate = useNavigate();

    const role =
        localStorage.getItem("role");

    const storedUser =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );


    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {

        const fetchProfile = async () => {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            if (!token) {

                navigate("/login");

                return;

            }


            try {

                const response =
                    await api.get(
                        "/profile/",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                setProfile(
                    response.data.profile
                );

            } catch (error) {

                console.error(
                    "Profile error:",
                    error
                );


                if (
                    error.response?.status === 401
                ) {

                    localStorage.clear();

                    navigate("/login");

                } else {

                    setError(
                        "Unable to load your profile."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        fetchProfile();

    }, [navigate]);


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setProfile(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================
    const handleSave = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const token =
            localStorage.getItem("access_token");

        try {

            let updateData;

            // ====================================
            // DONOR
            // ====================================

            if (role === "Donor") {

                updateData = {

                    address:
                        profile.address || "",

                    city:
                        profile.city || "",

                    state:
                        profile.state || "",

                    pincode:
                        profile.pincode || "",

                    bio:
                        profile.bio || "",

                };

            }

            // ====================================
            // NGO
            // ====================================

            else {

                updateData = {

                    ngo_name:
                        profile.ngo_name || "",

                    registration_number:
                        profile.registration_number || "",

                    address:
                        profile.address || "",

                    city:
                        profile.city || "",

                    state:
                        profile.state || "",

                    pincode:
                        profile.pincode || "",

                    website:
                        profile.website || "",

                    description:
                        profile.description || "",

                };

            }


            // ====================================
            // UPDATE PROFILE
            // ====================================

            const response =
                await api.put(
                    "/profile/",
                    updateData,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            // ====================================
            // USE ACTUAL PROFILE OBJECT
            // ====================================

            setProfile(
                response.data.profile
            );


            setSuccess(
                "Profile updated successfully."
            );


            // ====================================
            // OPTIONAL: VERIFY FROM DATABASE
            // ====================================

            const verifyResponse =
                await api.get(
                    "/profile/",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            setProfile(
                verifyResponse.data.profile
            );


        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );


            if (error.response?.data) {

                const data =
                    error.response.data;

                const messages = [];


                Object.entries(data).forEach(
                    ([field, value]) => {

                        if (
                            Array.isArray(value)
                        ) {

                            messages.push(
                                `${field}: ${value.join(", ")}`
                            );

                        } else {

                            messages.push(
                                `${field}: ${value}`
                            );

                        }

                    }
                );


                setError(
                    messages.length
                        ? messages.join(" | ")
                        : "Unable to update profile."
                );

            } else {

                setError(
                    "Unable to connect to the server."
                );

            }

        } finally {

            setSaving(false);

        }

    };
    // ==========================================
    // LOGOUT
    // ==========================================

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


        navigate("/login");

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="profile-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading your profile...
                </p>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!profile) {

        return (

            <div className="profile-error-page">

                <HeartHandshake size={40} />

                <h2>
                    Unable to load profile
                </h2>

                <p>
                    {error || "Something went wrong."}
                </p>

                <Link
                    to="/"
                    className="profile-home-btn"
                >
                    Back to Home
                </Link>

            </div>

        );

    }


    const isNGO =
        role === "NGO";


    return (

        <div className="profile-page">


            {/* ======================================
          HEADER
      ====================================== */}

            <header className="profile-header">

                <Link
                    to="/"
                    className="profile-logo"
                >

                    <div className="profile-logo-icon">

                        <HeartHandshake
                            size={21}
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


                <nav className="profile-nav">

                    <Link to="/">
                        Home
                    </Link>

                    <span className="profile-nav-active">
                        Profile
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >

                        <LogOut size={15} />

                        Logout

                    </button>

                </nav>

            </header>


            {/* ======================================
          MAIN
      ====================================== */}

            <main className="profile-main">


                <div className="profile-top">

                    <div>

                        <Link
                            to="/"
                            className="profile-back"
                        >

                            <ArrowLeft size={15} />

                            Back

                        </Link>

                        <span className="profile-label">
                            ACCOUNT
                        </span>

                        <h1>
                            Your Profile
                        </h1>

                        <p>
                            Manage your account information
                            and preferences.
                        </p>

                    </div>


                    <div className="profile-role">

                        {isNGO ? (
                            <Building2 size={17} />
                        ) : (
                            <User size={17} />
                        )}

                        <span>
                            {isNGO
                                ? "NGO Account"
                                : "Donor Account"}
                        </span>

                    </div>

                </div>


                {/* ======================================
            PROFILE CARD
        ====================================== */}

                <section className="profile-card">


                    <div className="profile-card-header">

                        <div className="profile-avatar">

                            {isNGO ? (
                                <Building2 size={28} />
                            ) : (
                                <User size={28} />
                            )}

                        </div>


                        <div>

                            <h2>

                                {isNGO
                                    ? profile.ngo_name ||
                                    storedUser.username
                                    : profile.username ||
                                    storedUser.username}

                            </h2>

                            <p>

                                {isNGO
                                    ? "Non-Governmental Organization"
                                    : "Donor"}

                            </p>

                        </div>


                        {isNGO && (

                            <div
                                className={
                                    profile.is_verified
                                        ? "verification verified"
                                        : "verification pending"
                                }
                            >

                                {profile.is_verified ? (
                                    <>
                                        <CheckCircle
                                            size={15}
                                        />

                                        Verified
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            ●
                                        </span>

                                        Verification Pending
                                    </>
                                )}

                            </div>

                        )}

                    </div>


                    <form
                        className="profile-form"
                        onSubmit={handleSave}
                    >


                        {/* ==================================
                BASIC INFORMATION
            ================================== */}

                        <div className="profile-section-title">

                            <h3>
                                {isNGO
                                    ? "Organization Information"
                                    : "Personal Information"}
                            </h3>

                            <span>
                                Your registered account details
                            </span>

                        </div>


                        {/* USERNAME */}

                        <div className="profile-field">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={
                                    profile.username ||
                                    storedUser.username ||
                                    ""
                                }
                                disabled
                            />

                            <small>
                                Username cannot be changed.
                            </small>

                        </div>


                        {/* EMAIL + PHONE */}

                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={
                                        profile.email ||
                                        storedUser.email ||
                                        ""
                                    }
                                    disabled
                                />

                                <small>
                                    Email is linked to your account.
                                </small>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    value={
                                        profile.phone ||
                                        storedUser.phone ||
                                        ""
                                    }
                                    disabled
                                />

                            </div>

                        </div>


                        {/* ==================================
                NGO INFORMATION
            ================================== */}

                        {isNGO && (

                            <>

                                <div className="profile-field">

                                    <label>
                                        NGO / Organization Name
                                    </label>

                                    <input
                                        type="text"
                                        name="ngo_name"
                                        value={
                                            profile.ngo_name || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Organization name"
                                    />

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Registration Number
                                    </label>

                                    <input
                                        type="text"
                                        name="registration_number"
                                        value={
                                            profile.registration_number ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="NGO registration number"
                                    />

                                </div>

                            </>

                        )}


                        {/* ==================================
                LOCATION
            ================================== */}

                        <div className="profile-section-title location-title">

                            <h3>
                                Location
                            </h3>

                            <span>
                                Where you are based
                            </span>

                        </div>


                        <div className="profile-field">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={
                                    profile.address || ""
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your address"
                                rows="3"
                            />

                        </div>


                        <div className="profile-grid">

                            <div className="profile-field">

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        profile.city || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="City"
                                />

                            </div>


                            <div className="profile-field">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        profile.state || ""
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="State"
                                />

                            </div>

                        </div>


                        <div className="profile-field">

                            <label>
                                Pincode
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={
                                    profile.pincode || ""
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Pincode"
                            />

                        </div>


                        {/* ==================================
                NGO ADDITIONAL INFORMATION
            ================================== */}

                        {isNGO && (

                            <>

                                <div className="profile-section-title">

                                    <h3>
                                        Organization Details
                                    </h3>

                                    <span>
                                        Help donors understand your organization.
                                    </span>

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Website
                                    </label>

                                    <input
                                        type="url"
                                        name="website"
                                        value={
                                            profile.website || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://example.org"
                                    />

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            profile.description ||
                                            ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Tell donors about your organization..."
                                        rows="5"
                                    />

                                </div>

                            </>

                        )}


                        {/* ==================================
                DONOR BIO
            ================================== */}

                        {!isNGO && (

                            <>

                                <div className="profile-section-title">

                                    <h3>
                                        About You
                                    </h3>

                                    <span>
                                        Tell us a little about yourself.
                                    </span>

                                </div>


                                <div className="profile-field">

                                    <label>
                                        Bio
                                    </label>

                                    <textarea
                                        name="bio"
                                        value={
                                            profile.bio || ""
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Write something about yourself..."
                                        rows="4"
                                    />

                                </div>

                            </>

                        )}


                        {/* ==================================
                MESSAGES
            ================================== */}

                        {error && (

                            <div className="profile-message error">
                                {error}
                            </div>

                        )}


                        {success && (

                            <div className="profile-message success">
                                {success}
                            </div>

                        )}


                        {/* ==================================
                SAVE
            ================================== */}

                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="save-profile"
                                disabled={saving}
                            >

                                <Save size={17} />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>


                    </form>

                </section>

            </main>

        </div>

    );
}

export default Profile;