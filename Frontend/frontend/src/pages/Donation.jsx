import { useState } from "react";

import {
    ArrowLeft,
    Check,
    CheckCircle,
    ChevronRight,
    HeartHandshake,
    ImagePlus,
    LoaderCircle,
    ScanSearch,
    Upload,
    X,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import api from "../api/axios";

import "../styles/Donation.css";


function Donation() {

    // =====================================================
    // LOGIN CHECK
    // =====================================================

    const token =
        localStorage.getItem("access_token");

    const isLoggedIn =
        !!token;


    // =====================================================
    // USER INFORMATION
    // =====================================================

    let storedUser = {};

    try {

        storedUser = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

    } catch (error) {

        storedUser = {};

    }


    // =====================================================
    // STEP
    // =====================================================

    /*
        STEP 1
        Upload image

        STEP 2
        AI detection + donor verification

        STEP 3
        Verified donation details
    */

    const [step, setStep] =
        useState(1);


    // =====================================================
    // IMAGE STATES
    // =====================================================

    const [image, setImage] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");


    // =====================================================
    // AI STATES
    // =====================================================

    const [scanning, setScanning] =
        useState(false);

    const [verified, setVerified] =
        useState(false);


    /*
        Gemini can detect MULTIPLE items.

        Example:

        [
            {
                item: "Blanket",
                category: "Household",
                quantity: 3,
                confidence: 0.95
            },
            {
                item: "Book",
                category: "Books",
                quantity: 2,
                confidence: 0.91
            }
        ]
    */

    const [detectedItems, setDetectedItems] =
        useState([]);


    // =====================================================
    // ADDITIONAL DONATION INFORMATION
    // =====================================================

    const [description, setDescription] =
        useState("");


    // =====================================================
    // UI STATES
    // =====================================================

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);


    // =====================================================
    // LOGIN PROTECTION
    // =====================================================

    if (!isLoggedIn) {

        return (

            <div className="donation-login-page">

                <div className="donation-login-card">

                    <div className="donation-login-icon">

                        <HeartHandshake
                            size={32}
                        />

                    </div>


                    <h1>
                        Login Required
                    </h1>


                    <p>

                        Please login to your
                        KindLink account before
                        making a donation.

                    </p>


                    <div className="donation-login-actions">

                        <Link
                            to="/login"
                            className="donation-primary-btn"
                        >

                            Login to Donate

                        </Link>


                        <Link
                            to="/register"
                            className="donation-secondary-btn"
                        >

                            Create Account

                        </Link>

                    </div>


                    <Link
                        to="/"
                        className="donation-back-link"
                    >

                        <ArrowLeft
                            size={15}
                        />

                        Back to Home

                    </Link>

                </div>

            </div>

        );

    }


    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    const handleImageChange = (event) => {

        const selectedFile =
            event.target.files?.[0];


        if (!selectedFile) {

            return;

        }


        setError("");

        setSuccess(false);

        setVerified(false);


        // =================================================
        // CHECK IMAGE TYPE
        // =================================================

        if (
            !selectedFile.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Please select a valid image file."
            );

            return;

        }


        // =================================================
        // CHECK IMAGE SIZE
        // =================================================

        const maxSize =
            5 * 1024 * 1024;


        if (
            selectedFile.size >
            maxSize
        ) {

            setError(
                "Image size should be less than 5 MB."
            );

            return;

        }


        // =================================================
        // SET IMAGE
        // =================================================

        setImage(
            selectedFile
        );


        // =================================================
        // CREATE PREVIEW
        // =================================================

        const previewURL =
            URL.createObjectURL(
                selectedFile
            );


        setImagePreview(
            previewURL
        );


        // =================================================
        // RESET PREVIOUS AI RESULTS
        // =================================================

        setDetectedItems([]);

        setDescription("");

        setStep(1);

    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {

        setImage(null);

        setImagePreview("");

        setDetectedItems([]);

        setDescription("");

        setVerified(false);

        setSuccess(false);

        setError("");

        setStep(1);

    };


    // =====================================================
    // AI IMAGE SCAN
    // =====================================================

    const scanImage = async () => {

        // -------------------------------------------------
        // CHECK IMAGE
        // -------------------------------------------------

        if (!image) {

            setError(
                "Please upload an image first."
            );

            return;

        }


        // -------------------------------------------------
        // CHECK TOKEN
        // -------------------------------------------------

        const accessToken =
            localStorage.getItem(
                "access_token"
            );


        if (!accessToken) {

            setError(
                "Your login session has expired. Please login again."
            );

            return;

        }


        setError("");

        setSuccess(false);

        setScanning(true);


        try {

            // =================================================
            // CREATE FORMDATA
            // =================================================

            const formData =
                new FormData();


            formData.append(
                "image",
                image
            );


            // =================================================
            // SEND IMAGE TO DJANGO
            // =================================================

            const response =
                await api.post(
                    "/donations/scan/",
                    formData,
                    {
                        headers: {

                            Authorization:
                                `Bearer ${accessToken}`,

                        },
                    }
                );


            // =================================================
            // DEBUG RESPONSE
            // =================================================

            console.log(
                "Gemini AI Scan Response:",
                response.data
            );


            const result =
                response.data;


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (
                !result.success
            ) {

                setError(
                    result.message ||
                    result.error ||
                    "No recognizable donation item was detected."
                );

                return;

            }


            // =================================================
            // GET MULTIPLE DETECTED ITEMS
            // =================================================

            const items =
                result.items || [];


            if (
                items.length === 0
            ) {

                setError(
                    "No donation items were detected in the image."
                );

                return;

            }


            // =================================================
            // FORMAT GEMINI ITEMS
            // =================================================

            const formattedItems =
                items.map(
                    (item, index) => {

                        let confidence =
                            Number(
                                item.confidence
                            ) || 0;


                        /*
                            Gemini may return:

                            0.95

                            OR

                            95

                            Convert both to percentage.
                        */

                        if (
                            confidence <= 1
                        ) {

                            confidence =
                                confidence * 100;

                        }


                        confidence =
                            Math.min(
                                100,
                                Math.max(
                                    0,
                                    confidence
                                )
                            );


                        return {

                            id:
                                `${Date.now()}-${index}`,

                            item:
                                item.item || "",

                            category:
                                item.category ||
                                "Other",

                            quantity:
                                Math.max(
                                    1,
                                    Number(
                                        item.quantity
                                    ) || 1
                                ),

                            confidence:
                                confidence

                        };

                    }
                );


            // =================================================
            // STORE DETECTED ITEMS
            // =================================================

            setDetectedItems(
                formattedItems
            );


            // =================================================
            // MOVE TO STEP 2
            // =================================================

            setStep(2);


        } catch (error) {

            console.error(
                "AI scan error:",
                error
            );


            // =================================================
            // UNAUTHORIZED
            // =================================================

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your login session has expired. Please login again."
                );

                return;

            }


            // =================================================
            // BACKEND ERROR
            // =================================================

            if (
                error.response?.data?.message
            ) {

                setError(
                    error.response.data.message
                );

                return;

            }


            if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

                return;

            }


            // =================================================
            // NETWORK ERROR
            // =================================================

            if (
                error.message ===
                "Network Error"
            ) {

                setError(
                    "Unable to connect to the server. Make sure Django is running."
                );

                return;

            }


            // =================================================
            // GENERAL ERROR
            // =================================================

            setError(
                "Unable to scan the image. Please try again."
            );

        } finally {

            setScanning(false);

        }

    };


    // =====================================================
    // UPDATE DETECTED ITEM
    // =====================================================

    const updateDetectedItem = (
        id,
        field,
        value
    ) => {

        setDetectedItems(
            (items) =>

                items.map(
                    (item) => {

                        if (
                            item.id !== id
                        ) {

                            return item;

                        }


                        return {

                            ...item,

                            [field]:
                                value

                        };

                    }
                )
        );

    };


    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const updateQuantity = (
        id,
        change
    ) => {

        setDetectedItems(
            (items) =>

                items.map(
                    (item) => {

                        if (
                            item.id !== id
                        ) {

                            return item;

                        }


                        return {

                            ...item,

                            quantity:
                                Math.max(
                                    1,
                                    Number(
                                        item.quantity
                                    ) + change
                                )

                        };

                    }
                )
        );

    };


    // =====================================================
    // REMOVE DETECTED ITEM
    // =====================================================

    const removeDetectedItem = (
        id
    ) => {

        setDetectedItems(
            (items) =>
                items.filter(
                    (item) =>
                        item.id !== id
                )
        );

    };


    // =====================================================
    // VERIFY AI RESULT
    // =====================================================

    const verifyResult = () => {

        setError("");


        // =================================================
        // CHECK ITEMS
        // =================================================

        if (
            detectedItems.length === 0
        ) {

            setError(
                "At least one donation item is required."
            );

            return;

        }


        // =================================================
        // VALIDATE EACH ITEM
        // =================================================

        for (
            const item of detectedItems
        ) {

            // ---------------------------------------------
            // ITEM NAME
            // ---------------------------------------------

            if (
                !item.item ||
                !item.item.trim()
            ) {

                setError(
                    "Every detected item must have a name."
                );

                return;

            }


            // ---------------------------------------------
            // CATEGORY
            // ---------------------------------------------

            if (
                !item.category
            ) {

                setError(
                    `Please select a category for ${item.item}.`
                );

                return;

            }


            // ---------------------------------------------
            // QUANTITY
            // ---------------------------------------------

            if (
                Number(
                    item.quantity
                ) < 1
            ) {

                setError(
                    `Quantity for ${item.item} must be at least 1.`
                );

                return;

            }

        }


        // =================================================
        // DONOR APPROVED AI RESULT
        // =================================================

        setVerified(true);


        // =================================================
        // MOVE TO STEP 3
        // =================================================

        setStep(3);

    };


    // =====================================================
    // GO BACK TO AI VERIFICATION
    // =====================================================

    const editAIResult = () => {

        setError("");

        setVerified(false);

        setSuccess(false);

        setStep(2);

    };


    // =====================================================
    // FINAL SUBMIT
    // =====================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");

        setSuccess(false);


        // =================================================
        // VERIFY FIRST
        // =================================================

        if (
            !verified
        ) {

            setError(
                "Please verify the AI detected items first."
            );

            setStep(2);

            return;

        }


        /*
         * =================================================
         *
         * IMPORTANT
         *
         * Final Donation API has not been created yet.
         *
         * Therefore we are NOT saving the donation
         * to the database yet.
         *
         * The verified data currently contains:
         *
         * - item
         * - category
         * - quantity
         * - AI confidence
         *
         * =================================================
         */


        console.log(
            "Verified donation:",
            {
                items:
                    detectedItems,

                description:
                    description
            }
        );


        setSuccess(true);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="donation-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="donation-header">


                {/* LOGO */}

                <Link
                    to="/"
                    className="donation-logo"
                >

                    <div className="donation-logo-icon">

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


                {/* USER */}

                <div className="donation-user">


                    <div className="donation-user-avatar">

                        {
                            storedUser.username
                                ?.charAt(0)
                                ?.toUpperCase() || "U"
                        }

                    </div>


                    <div>

                        <strong>

                            {
                                storedUser.username ||
                                "Donor"
                            }

                        </strong>


                        <small>
                            Donor
                        </small>

                    </div>


                    <Link
                        to="/profile"
                        className="donation-profile-link"
                    >

                        Profile

                    </Link>

                </div>

            </header>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="donation-main">


                {/* BACK TO HOME */}

                <Link
                    to="/"
                    className="donation-back"
                >

                    <ArrowLeft
                        size={15}
                    />

                    Back to Home

                </Link>


                {/* =================================================
                    PAGE HEADING
                ================================================= */}

                <div className="donation-heading">

                    <span>
                        AI-POWERED DONATION
                    </span>


                    <h1>
                        Donate an Item
                    </h1>


                    <p>

                        Upload your item and let our
                        AI identify everything in the
                        image before you verify and
                        continue with your donation.

                    </p>

                </div>


                {/* =================================================
                    PROGRESS
                ================================================= */}

                <div className="donation-progress">


                    {/* STEP 1 */}

                    <div
                        className={
                            step >= 1
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            1
                        </span>


                        <div>

                            <strong>
                                Upload
                            </strong>


                            <small>
                                Add image
                            </small>

                        </div>

                    </div>


                    <div className="progress-line"></div>


                    {/* STEP 2 */}

                    <div
                        className={
                            step >= 2
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            2
                        </span>


                        <div>

                            <strong>
                                Verify
                            </strong>


                            <small>
                                Check AI result
                            </small>

                        </div>

                    </div>


                    <div className="progress-line"></div>


                    {/* STEP 3 */}

                    <div
                        className={
                            step >= 3
                                ? "progress-step active"
                                : "progress-step"
                        }
                    >

                        <span>
                            3
                        </span>


                        <div>

                            <strong>
                                Continue
                            </strong>


                            <small>
                                Donation details
                            </small>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {
                    error && (

                        <div className="donation-error">

                            {error}

                        </div>

                    )
                }


                {/* =================================================
                    STEP 1 — UPLOAD
                ================================================= */}

                {
                    step === 1 && (

                        <section className="donation-card">


                            {/* HEADER */}

                            <div className="donation-card-heading">

                                <div>

                                    <span>
                                        STEP 01
                                    </span>


                                    <h2>
                                        Upload Item Image
                                    </h2>


                                    <p>

                                        Upload a clear image
                                        showing the items
                                        you want to donate.

                                    </p>

                                </div>


                                <ScanSearch
                                    size={22}
                                />

                            </div>


                            {/* =================================================
                                NO IMAGE
                            ================================================= */}

                            {
                                !imagePreview ? (

                                    <label
                                        htmlFor="item-image"
                                        className="image-upload-area"
                                    >

                                        <input
                                            id="item-image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={
                                                handleImageChange
                                            }
                                            hidden
                                        />


                                        <div className="upload-icon">

                                            <ImagePlus
                                                size={30}
                                            />

                                        </div>


                                        <h3>
                                            Upload an item image
                                        </h3>


                                        <p>

                                            Choose a clear
                                            photo showing
                                            the donation
                                            items properly.

                                        </p>


                                        <span className="upload-info">

                                            JPG, JPEG, PNG or WEBP
                                            • Maximum 5 MB

                                        </span>


                                        <div className="upload-button">

                                            <Upload
                                                size={15}
                                            />

                                            Choose Image

                                        </div>

                                    </label>

                                ) : (

                                    /* =================================================
                                       IMAGE PREVIEW
                                    ================================================= */

                                    <div className="image-preview-container">


                                        <img
                                            src={imagePreview}
                                            alt="Donation item preview"
                                            className="donation-image-preview"
                                        />


                                        <button
                                            type="button"
                                            className="remove-image"
                                            onClick={
                                                removeImage
                                            }
                                        >

                                            <X
                                                size={17}
                                            />

                                        </button>


                                        <div className="image-name">

                                            {
                                                image?.name
                                            }

                                        </div>

                                    </div>

                                )
                            }


                            {/* =================================================
                                SCAN BUTTON
                            ================================================= */}

                            {
                                image && (

                                    <button
                                        type="button"
                                        className="scan-button"
                                        onClick={
                                            scanImage
                                        }
                                        disabled={
                                            scanning
                                        }
                                    >

                                        {
                                            scanning ? (

                                                <>

                                                    <LoaderCircle
                                                        size={18}
                                                        className="spin"
                                                    />

                                                    AI is analyzing...

                                                </>

                                            ) : (

                                                <>

                                                    <ScanSearch
                                                        size={18}
                                                    />

                                                    Analyze Image with AI

                                                </>

                                            )
                                        }

                                    </button>

                                )
                            }

                        </section>

                    )
                }


                {/* =================================================
                    STEP 2 — AI VERIFICATION
                ================================================= */}

                {
                    step === 2 && (

                        <section className="donation-card">


                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="ai-result-header">

                                <div>

                                    <span>
                                        STEP 02
                                    </span>


                                    <h2>
                                        Verify AI Detection
                                    </h2>


                                    <p>

                                        Review every item detected
                                        by AI and correct anything
                                        that isn't accurate.

                                    </p>

                                </div>


                                <div className="ai-badge">

                                    <CheckCircle
                                        size={16}
                                    />

                                    AI Analysis Complete

                                </div>

                            </div>


                            {/* =================================================
                                AI RESULT
                            ================================================= */}

                            <div className="ai-result-layout">


                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div className="ai-image-container">

                                    <img
                                        src={imagePreview}
                                        alt="AI scanned donation"
                                    />

                                </div>


                                {/* =================================================
                                    DETECTED ITEMS
                                ================================================= */}

                                <div className="ai-detection">


                                    <div className="detected-items-heading">

                                        <h3>
                                            Detected Items
                                        </h3>


                                        <p>
                                            Gemini identified
                                            the following items
                                            in your image.
                                        </p>

                                    </div>


                                    {
                                        detectedItems.map(
                                            (item) => (

                                                <div
                                                    className="detected-item-card"
                                                    key={item.id}
                                                >


                                                    {/* =================================
                                                        ITEM NAME
                                                    ================================= */}

                                                    <div className="donation-field">

                                                        <label>
                                                            Detected Item
                                                        </label>


                                                        <input
                                                            type="text"
                                                            value={
                                                                item.item
                                                            }
                                                            onChange={
                                                                (event) =>
                                                                    updateDetectedItem(
                                                                        item.id,
                                                                        "item",
                                                                        event.target.value
                                                                    )
                                                            }
                                                            placeholder="Detected item"
                                                        />

                                                    </div>


                                                    {/* =================================
                                                        CATEGORY
                                                    ================================= */}

                                                    <div className="donation-field">

                                                        <label>
                                                            Category
                                                        </label>


                                                        <select
                                                            value={
                                                                item.category
                                                            }
                                                            onChange={
                                                                (event) =>
                                                                    updateDetectedItem(
                                                                        item.id,
                                                                        "category",
                                                                        event.target.value
                                                                    )
                                                            }
                                                        >

                                                            <option value="">
                                                                Select category
                                                            </option>


                                                            <option value="Clothing">
                                                                Clothing
                                                            </option>


                                                            <option value="Food">
                                                                Food
                                                            </option>


                                                            <option value="Books">
                                                                Books
                                                            </option>


                                                            <option value="Education">
                                                                Education
                                                            </option>


                                                            <option value="Electronics">
                                                                Electronics
                                                            </option>


                                                            <option value="Furniture">
                                                                Furniture
                                                            </option>


                                                            <option value="Medical">
                                                                Medical Supplies
                                                            </option>


                                                            <option value="Household">
                                                                Household Items
                                                            </option>


                                                            <option value="Toys">
                                                                Toys
                                                            </option>


                                                            <option value="Other">
                                                                Other
                                                            </option>

                                                        </select>

                                                    </div>


                                                    {/* =================================
                                                        QUANTITY
                                                    ================================= */}

                                                    <div className="quantity-row">

                                                        <label>
                                                            Quantity
                                                        </label>


                                                        <div className="quantity-control">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        -1
                                                                    )
                                                                }
                                                            >

                                                                −

                                                            </button>


                                                            <span>

                                                                {
                                                                    item.quantity
                                                                }

                                                            </span>


                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        1
                                                                    )
                                                                }
                                                            >

                                                                +

                                                            </button>

                                                        </div>

                                                    </div>


                                                    {/* =================================
                                                        AI CONFIDENCE
                                                    ================================= */}

                                                    <div className="confidence-card">

                                                        <div>

                                                            <span>
                                                                AI CONFIDENCE
                                                            </span>


                                                            <strong>

                                                                {
                                                                    Math.round(
                                                                        item.confidence
                                                                    )
                                                                }%

                                                            </strong>

                                                        </div>


                                                        <div className="confidence-bar">

                                                            <div
                                                                style={{
                                                                    width:
                                                                        `${item.confidence}%`
                                                                }}
                                                            />

                                                        </div>

                                                    </div>


                                                    {/* =================================
                                                        REMOVE ITEM
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        className="remove-detected-item"
                                                        onClick={() =>
                                                            removeDetectedItem(
                                                                item.id
                                                            )
                                                        }
                                                    >

                                                        <X
                                                            size={15}
                                                        />

                                                        Remove Item

                                                    </button>

                                                </div>

                                            )
                                        )
                                    }


                                </div>

                            </div>


                            {/* =================================================
                                VERIFICATION NOTICE
                            ================================================= */}

                            <div className="verification-notice">

                                <Check
                                    size={18}
                                />


                                <div>

                                    <strong>
                                        Please verify these results
                                    </strong>


                                    <p>

                                        AI suggestions are
                                        not final. Review
                                        the detected item,
                                        category and quantity
                                        before continuing.

                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <div className="verification-actions">


                                <button
                                    type="button"
                                    className="back-step-button"
                                    onClick={() => {

                                        setError("");

                                        setStep(1);

                                    }}
                                >

                                    <ArrowLeft
                                        size={15}
                                    />

                                    Back

                                </button>


                                <button
                                    type="button"
                                    className="confirm-button"
                                    onClick={
                                        verifyResult
                                    }
                                >

                                    <Check
                                        size={17}
                                    />

                                    Confirm AI Result


                                    <ChevronRight
                                        size={16}
                                    />

                                </button>

                            </div>

                        </section>

                    )
                }


                {/* =================================================
                    STEP 3 — DONATION DETAILS
                ================================================= */}

                {
                    step === 3 && (

                        <form
                            className="donation-card"
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="donation-card-heading">

                                <div>

                                    <span>
                                        STEP 03
                                    </span>


                                    <h2>
                                        Donation Details
                                    </h2>


                                    <p>

                                        Your donation items
                                        have been verified.
                                        Add any additional
                                        information.

                                    </p>

                                </div>


                                <CheckCircle
                                    size={22}
                                    color="#2b9a57"
                                />

                            </div>


                            {/* =================================================
                                VERIFIED ITEMS
                            ================================================= */}

                            <div className="verified-items">

                                <span>
                                    VERIFIED DONATION ITEMS
                                </span>


                                {
                                    detectedItems.map(
                                        (item) => (

                                            <div
                                                className="verified-item"
                                                key={item.id}
                                            >


                                                <div className="verified-item-image">

                                                    <img
                                                        src={imagePreview}
                                                        alt={
                                                            item.item
                                                        }
                                                    />

                                                </div>


                                                <div className="verified-item-information">

                                                    <h3>
                                                        {
                                                            item.item
                                                        }
                                                    </h3>


                                                    <p>

                                                        {
                                                            item.category
                                                        }

                                                        {" • "}

                                                        Quantity:
                                                        {" "}

                                                        {
                                                            item.quantity
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )
                                }


                                <button
                                    type="button"
                                    onClick={
                                        editAIResult
                                    }
                                    className="edit-result-button"
                                >

                                    Edit AI Results

                                </button>

                            </div>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <div className="donation-field">

                                <label>
                                    Additional Description
                                </label>


                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={
                                        (event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Add quantity details, size, color, condition or any other useful information..."
                                    rows="5"
                                />

                            </div>


                            {/* =================================================
                                SUCCESS
                            ================================================= */}

                            {
                                success && (

                                    <div className="donation-success">

                                        <CheckCircle
                                            size={22}
                                        />


                                        <div>

                                            <strong>
                                                Donation verified successfully!
                                            </strong>


                                            <p>

                                                Your verified donation
                                                is ready for the NGO
                                                matching stage.

                                            </p>

                                        </div>

                                    </div>

                                )
                            }


                            {/* =================================================
                                FINAL BUTTON
                            ================================================= */}

                            {
                                !success && (

                                    <div className="donation-submit-area">

                                        <p>

                                            Your verified donation
                                            items will be matched
                                            with NGOs that need them.

                                        </p>


                                        <button
                                            type="submit"
                                            className="donation-submit"
                                        >

                                            <HeartHandshake
                                                size={18}
                                            />

                                            Find Matching NGOs

                                        </button>

                                    </div>

                                )
                            }

                        </form>

                    )
                }


            </main>

        </div>

    );

}


export default Donation;