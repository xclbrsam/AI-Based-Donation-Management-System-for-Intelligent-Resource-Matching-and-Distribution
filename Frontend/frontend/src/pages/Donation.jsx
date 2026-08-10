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
        AI detection + user verification

        STEP 3
        Additional donation details
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


    const [aiResult, setAiResult] =
        useState({

            item: "",

            category: "",

            confidence: 0,

        });


    // =====================================================
    // USER-EDITABLE ITEM INFORMATION
    // =====================================================

    const [itemName, setItemName] =
        useState("");


    const [category, setCategory] =
        useState("");


    const [condition, setCondition] =
        useState("");


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
        // RESET AI RESULT
        // =================================================

        setAiResult({

            item: "",

            category: "",

            confidence: 0,

        });


        setItemName("");

        setCategory("");

        setCondition("");

        setDescription("");

        setStep(1);

    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {

        setImage(null);

        setImagePreview("");

        setAiResult({

            item: "",

            category: "",

            confidence: 0,

        });

        setItemName("");

        setCategory("");

        setCondition("");

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
        // Check image
        // -------------------------------------------------

        if (!image) {

            setError(
                "Please upload an image first."
            );

            return;

        }


        // -------------------------------------------------
        // Check token
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

            // =============================================
            // CREATE FORMDATA
            // =============================================

            const formData =
                new FormData();


            formData.append(
                "image",
                image
            );


            // =============================================
            // SEND IMAGE TO DJANGO AI API
            // =============================================

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


            // =============================================
            // DEBUG RESPONSE
            // =============================================

            console.log(
                "AI Scan Response:",
                response.data
            );


            const result =
                response.data;


            // =============================================
            // CHECK RESPONSE
            // =============================================

            if (
                !result.success
            ) {

                setError(
                    result.message ||
                    result.error ||
                    "No recognizable item was detected."
                );

                return;

            }


            // =============================================
            // STORE AI RESULT
            // =============================================

            setAiResult({

                item:
                    result.item || "",

                category:
                    result.category || "Other",

                confidence:
                    Number(
                        result.confidence || 0
                    ),

            });


            // =============================================
            // PUT AI RESULT INTO EDITABLE FIELDS
            // =============================================

            setItemName(
                result.item || ""
            );


            setCategory(
                result.category || "Other"
            );


            /*
                IMPORTANT:

                AI is NOT setting condition.

                The user must verify the
                physical condition manually.
            */

            setCondition("");


            // =============================================
            // MOVE TO VERIFICATION
            // =============================================

            setStep(2);


        } catch (error) {

            console.error(
                "AI scan error:",
                error
            );


            // =============================================
            // UNAUTHORIZED
            // =============================================

            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your login session has expired. Please login again."
                );

                return;

            }


            // =============================================
            // BACKEND ERROR
            // =============================================

            if (
                error.response?.data?.error
            ) {

                setError(
                    error.response.data.error
                );

                return;

            }


            // =============================================
            // NETWORK ERROR
            // =============================================

            if (
                error.message ===
                "Network Error"
            ) {

                setError(
                    "Unable to connect to the server. Make sure Django is running."
                );

                return;

            }


            // =============================================
            // GENERAL ERROR
            // =============================================

            setError(
                "Unable to scan the image. Please try again."
            );

        } finally {

            setScanning(false);

        }

    };


    // =====================================================
    // VERIFY AI RESULT
    // =====================================================

    const verifyResult = () => {

        setError("");


        // -------------------------------------------------
        // ITEM
        // -------------------------------------------------

        if (
            !itemName.trim()
        ) {

            setError(
                "Please enter the item name."
            );

            return;

        }


        // -------------------------------------------------
        // CATEGORY
        // -------------------------------------------------

        if (!category) {

            setError(
                "Please select a category."
            );

            return;

        }


        // -------------------------------------------------
        // CONDITION
        // -------------------------------------------------

        if (!condition) {

            setError(
                "Please select the item condition."
            );

            return;

        }


        // -------------------------------------------------
        // VERIFIED
        // -------------------------------------------------

        setVerified(true);


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

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        setSuccess(false);


        // -------------------------------------------------
        // VERIFY FIRST
        // -------------------------------------------------

        if (!verified) {

            setError(
                "Please verify the AI detected item first."
            );

            setStep(2);

            return;

        }


        /*
         * =================================================
         *
         * IMPORTANT
         *
         * The final Donation API has not been created yet.
         *
         * Therefore we are NOT sending the donation to
         * Django at this stage.
         *
         * This button currently confirms that the item
         * is ready for the next NGO matching stage.
         *
         * =================================================
         */


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
                        AI identify it before you
                        verify and continue with
                        your donation.

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
                                        of the item you want
                                        to donate.

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
                                            the item properly.

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

                                                    AI is scanning...

                                                </>

                                            ) : (

                                                <>

                                                    <ScanSearch
                                                        size={18}
                                                    />

                                                    Scan Item with AI

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

                                        Review the AI result
                                        and correct anything
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


                                {/* IMAGE */}

                                <div className="ai-image-container">

                                    <img
                                        src={imagePreview}
                                        alt="AI scanned donation"
                                    />

                                </div>


                                {/* DETECTION INFORMATION */}

                                <div className="ai-detection">


                                    {/* CONFIDENCE */}

                                    <div className="confidence-card">

                                        <div>

                                            <span>
                                                AI CONFIDENCE
                                            </span>


                                            <strong>

                                                {
                                                    Number(
                                                        aiResult.confidence
                                                    ).toFixed(2)
                                                }%

                                            </strong>

                                        </div>


                                        <div className="confidence-bar">

                                            <div
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            Math.max(
                                                                Number(
                                                                    aiResult.confidence
                                                                ) || 0,
                                                                0
                                                            ),
                                                            100
                                                        )}%`
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* DETECTED ITEM */}

                                    <div className="donation-field">

                                        <label>
                                            Detected Item
                                        </label>


                                        <input
                                            type="text"
                                            value={itemName}
                                            onChange={(event) =>
                                                setItemName(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Detected item"
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div className="donation-field">

                                        <label>
                                            Category
                                        </label>


                                        <select
                                            value={category}
                                            onChange={(event) =>
                                                setCategory(
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
                                                Books & Education
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


                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* CONDITION */}

                                    <div className="donation-field">

                                        <label>
                                            Item Condition
                                        </label>


                                        <select
                                            value={condition}
                                            onChange={(event) =>
                                                setCondition(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Select condition
                                            </option>


                                            <option value="New">
                                                New
                                            </option>


                                            <option value="Good">
                                                Good
                                            </option>


                                            <option value="Used">
                                                Used
                                            </option>


                                            <option value="Needs Repair">
                                                Needs Repair
                                            </option>

                                        </select>

                                    </div>

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
                                        Please verify this result
                                    </strong>


                                    <p>

                                        AI suggestions are
                                        not final. Review
                                        the detected item,
                                        category and condition
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


                            {/* HEADER */}

                            <div className="donation-card-heading">

                                <div>

                                    <span>
                                        STEP 03
                                    </span>


                                    <h2>
                                        Donation Details
                                    </h2>


                                    <p>

                                        Your item has been
                                        verified. Add any
                                        additional information.

                                    </p>

                                </div>


                                <CheckCircle
                                    size={22}
                                    color="#2b9a57"
                                />

                            </div>


                            {/* =================================================
                                VERIFIED ITEM
                            ================================================= */}

                            <div className="verified-item">


                                <div className="verified-item-image">

                                    <img
                                        src={imagePreview}
                                        alt="Verified donation item"
                                    />

                                </div>


                                <div>

                                    <span>
                                        VERIFIED ITEM
                                    </span>


                                    <h3>
                                        {itemName}
                                    </h3>


                                    <p>

                                        {category}

                                        {" • "}

                                        {condition}

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        editAIResult
                                    }
                                    className="edit-result-button"
                                >

                                    Edit

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
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Add quantity, size, color or any other useful information..."
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
                                                Item verified successfully!
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

                                            Your verified item
                                            will be matched
                                            with NGOs that
                                            need it.

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