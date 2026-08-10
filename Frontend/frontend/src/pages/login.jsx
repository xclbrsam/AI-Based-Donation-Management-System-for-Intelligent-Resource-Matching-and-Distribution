import { useState } from "react";

import {
    Eye,
    EyeOff,
    HeartHandshake,
    ArrowLeft,
    User,
    Building2,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import "../styles/Auth.css";


function Login() {

    const navigate =
        useNavigate();


    // =====================================================
    // ACCOUNT TYPE
    // =====================================================

    const [accountType, setAccountType] =
        useState("user");


    // =====================================================
    // FORM STATES
    // =====================================================

    const [showPassword, setShowPassword] =
        useState(false);


    const [username, setUsername] =
        useState("");


    const [password, setPassword] =
        useState("");


    // =====================================================
    // UI STATES
    // =====================================================

    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {

        e.preventDefault();


        setError("");


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !username.trim() ||
            !password
        ) {

            setError(
                "Username and password are required."
            );

            return;

        }


        setLoading(true);


        try {

            // =============================================
            // LOGIN API
            // =============================================

            const response =
                await api.post(
                    "/login/",
                    {
                        username:
                            username.trim(),

                        password:
                            password,
                    }
                );


            const data =
                response.data;


            console.log(
                "LOGIN RESPONSE:",
                data
            );


            // =============================================
            // CHECK ACCESS TOKEN
            // =============================================

            if (!data.access) {

                setError(
                    "Login succeeded but no access token was returned."
                );

                return;

            }


            // =============================================
            // CHECK USER
            // =============================================

            if (!data.user) {

                setError(
                    "Login succeeded but user information was not returned."
                );

                return;

            }


            // =============================================
            // GET ROLE
            // =============================================

            const role =
                data.user.role;


            if (
                role !== "Donor" &&
                role !== "NGO"
            ) {

                setError(
                    "Invalid account role returned by the server."
                );

                return;

            }


            // =============================================
            // CHECK SELECTED ACCOUNT TYPE
            // =============================================

            const selectedRole =
                accountType === "user"
                    ? "Donor"
                    : "NGO";


            /*
             * IMPORTANT
             *
             * The role stored in Django is the actual
             * account role.
             *
             * The user cannot change it from the
             * login page.
             */


            if (
                role !== selectedRole
            ) {

                if (
                    role === "Donor"
                ) {

                    setError(
                        "This account is registered as a Donor. Please select Donor to continue."
                    );

                } else {

                    setError(
                        "This account is registered as an NGO. Please select NGO to continue."
                    );

                }


                return;

            }


            // =============================================
            // SAVE ACCESS TOKEN
            // =============================================

            localStorage.setItem(
                "access_token",
                data.access
            );


            // =============================================
            // SAVE REFRESH TOKEN
            // =============================================

            if (data.refresh) {

                localStorage.setItem(
                    "refresh_token",
                    data.refresh
                );

            }


            // =============================================
            // SAVE USER
            // =============================================

            localStorage.setItem(
                "user",
                JSON.stringify(
                    data.user
                )
            );


            // =============================================
            // SAVE ROLE
            // =============================================

            localStorage.setItem(
                "role",
                role
            );


            // =============================================
            // REDIRECT BASED ON REAL ROLE
            // =============================================

            if (
                role === "Donor"
            ) {

                navigate(
                    "/donor-dashboard",
                    {
                        replace: true,
                    }
                );

            }


            else if (
                role === "NGO"
            ) {

                navigate(
                    "/ngo-dashboard",
                    {
                        replace: true,
                    }
                );

            }

        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );


            // =============================================
            // BACKEND RESPONSE
            // =============================================

            if (
                error.response
            ) {

                const responseData =
                    error.response.data;


                console.log(
                    "LOGIN ERROR RESPONSE:",
                    responseData
                );


                // Django may return:
                // detail
                // message
                // error

                const message =
                    responseData?.detail ||
                    responseData?.message ||
                    responseData?.error;


                if (message) {

                    setError(
                        typeof message === "string"
                            ? message
                            : "Login failed."
                    );

                }

                else {

                    setError(
                        "Login failed. Please check your username and password."
                    );

                }

            }


            // =============================================
            // NETWORK ERROR
            // =============================================

            else if (
                error.request
            ) {

                setError(
                    "Unable to connect to the server. Make sure Django is running."
                );

            }


            // =============================================
            // UNKNOWN ERROR
            // =============================================

            else {

                setError(
                    "Something went wrong. Please try again."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // ACCOUNT TYPE CHANGE
    // =====================================================

    const changeAccountType = (
        type
    ) => {

        setAccountType(
            type
        );

        setError("");

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="auth-page">


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="auth-left">


                <Link
                    to="/"
                    className="auth-logo"
                >

                    <div className="auth-logo-icon">

                        <HeartHandshake
                            size={25}
                        />

                    </div>


                    <div>

                        <h2>
                            KindLink
                        </h2>


                        <span>
                            AI Donation Platform
                        </span>

                    </div>

                </Link>


                {/* QUOTE */}

                <div className="auth-quote">

                    <div className="quote-mark">
                        "
                    </div>


                    <h1>

                        Give with purpose.

                        <br />

                        <span>
                            Create real impact.
                        </span>

                    </h1>


                    <p>

                        Connect your generosity
                        with people and communities
                        who need it most.

                    </p>

                </div>


                {/* BOTTOM */}

                <div className="auth-left-bottom">

                    <HeartHandshake
                        size={20}
                    />


                    <span>

                        Connecting generosity
                        with real needs.

                    </span>

                </div>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="auth-right">


                {/* BACK HOME */}

                <Link
                    to="/"
                    className="back-home"
                >

                    <ArrowLeft
                        size={17}
                    />

                    Back to Home

                </Link>


                <div className="login-container">


                    {/* MOBILE LOGO */}

                    <div className="mobile-logo">

                        <div className="auth-logo-icon">

                            <HeartHandshake
                                size={23}
                            />

                        </div>


                        <h2>
                            KindLink
                        </h2>

                    </div>


                    {/* HEADING */}

                    <div className="login-heading">

                        <span className="auth-label">

                            WELCOME BACK

                        </span>


                        <h1>

                            Sign in to your account

                        </h1>


                        <p>

                            Continue your journey
                            of making a difference.

                        </p>

                    </div>


                    {/* =================================================
                        ACCOUNT TYPE
                    ================================================= */}

                    <div className="account-selector">


                        {/* DONOR */}

                        <button
                            type="button"
                            className={
                                accountType === "user"
                                    ? "account-option active"
                                    : "account-option"
                            }
                            onClick={() =>
                                changeAccountType(
                                    "user"
                                )
                            }
                        >

                            <span className="account-icon">

                                <User
                                    size={17}
                                />

                            </span>


                            <div>

                                <strong>
                                    Donor
                                </strong>


                                <small>
                                    Donate items
                                </small>

                            </div>

                        </button>


                        {/* NGO */}

                        <button
                            type="button"
                            className={
                                accountType === "ngo"
                                    ? "account-option active"
                                    : "account-option"
                            }
                            onClick={() =>
                                changeAccountType(
                                    "ngo"
                                )
                            }
                        >

                            <span className="account-icon">

                                <Building2
                                    size={17}
                                />

                            </span>


                            <div>

                                <strong>
                                    NGO
                                </strong>


                                <small>
                                    Manage needs
                                </small>

                            </div>

                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {
                        error && (

                            <div className="auth-error">

                                {error}

                            </div>

                        )
                    }


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <form
                        className="auth-form"
                        onSubmit={
                            handleLogin
                        }
                    >


                        {/* USERNAME */}

                        <div className="form-group">

                            <label
                                htmlFor="username"
                            >
                                Username
                            </label>


                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your username"
                                autoComplete="username"
                                disabled={
                                    loading
                                }
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">


                            <div className="password-label">

                                <label
                                    htmlFor="password"
                                >
                                    Password
                                </label>


                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() =>
                                        alert(
                                            "Password reset will be added later."
                                        )
                                    }
                                >

                                    Forgot password?

                                </button>

                            </div>


                            <div className="password-input">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={
                                        loading
                                    }
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    {
                                        showPassword ? (

                                            <EyeOff
                                                size={19}
                                            />

                                        ) : (

                                            <Eye
                                                size={19}
                                            />

                                        )
                                    }

                                </button>

                            </div>

                        </div>


                        {/* REMEMBER */}

                        <div className="remember-row">

                            <label className="remember">

                                <input
                                    type="checkbox"
                                />


                                <span>
                                    Remember me
                                </span>

                            </label>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={
                                loading
                            }
                        >

                            {
                                loading
                                    ? "Signing In..."
                                    : `Sign In as ${
                                        accountType === "user"
                                            ? "Donor"
                                            : "NGO"
                                    }`
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="register-prompt">

                        <span>
                            Don't have an account?
                        </span>


                        <Link
                            to="/register"
                        >
                            Create an account
                        </Link>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default Login;