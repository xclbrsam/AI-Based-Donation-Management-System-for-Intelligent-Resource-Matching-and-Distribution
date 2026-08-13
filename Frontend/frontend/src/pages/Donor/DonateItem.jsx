import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./DonateItem.css";

function DonateItem() {
  const navigate = useNavigate();

  // =====================================================
  // LOGGED-IN DONOR
  // =====================================================

  const donorName = localStorage.getItem("user_name");
  const donorEmail = localStorage.getItem("user_email");

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    ngo: "",
    condition: "Good",
    location: "",
    item_image: null,
  });

  // =====================================================
  // AI DETECTION DATA
  // =====================================================

  const [aiItems, setAiItems] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // =====================================================
  // NGO DATA
  // =====================================================

  const [ngos, setNgos] = useState([]);
  const [ngoLoading, setNgoLoading] = useState(true);
  const [ngoError, setNgoError] = useState("");

  // =====================================================
  // DONATION LOADING
  // =====================================================

  const [loading, setLoading] = useState(false);

  // =====================================================
  // IMAGE PREVIEW
  // =====================================================

  const [imagePreview, setImagePreview] = useState(null);

  // =====================================================
  // FETCH APPROVED NGOS
  // =====================================================

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setNgoLoading(true);
        setNgoError("");

        const token = localStorage.getItem("access");

        if (!token) {
          setNgoError("Please login first.");
          return;
        }

        const response = await api.get("ngos/");

        console.log("NGO Response:", response.data);

        if (Array.isArray(response.data)) {
          setNgos(response.data);
        } else {
          setNgoError(
            "Invalid NGO data received from server."
          );
        }
      } catch (error) {
        console.error("NGO FETCH ERROR:", error);

        if (error.response?.status === 401) {
          setNgoError(
            "Your login session has expired. Please login again."
          );
        } else if (error.response?.status === 403) {
          setNgoError(
            "You do not have permission to view NGOs."
          );
        } else if (error.response?.status === 404) {
          setNgoError(
            "NGO API endpoint was not found."
          );
        } else {
          setNgoError(
            "Unable to connect to backend server."
          );
        }
      } finally {
        setNgoLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    if (files) {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // New image = new AI analysis
      setAiItems([]);
      setAiError("");

      if (file) {
        setImagePreview(
          URL.createObjectURL(file)
        );
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // =====================================================
  // NORMALIZE AI CATEGORY
  // =====================================================

  const normalizeCategory = (category) => {
    if (!category) {
      return "Other";
    }

    const value = String(category)
      .trim()
      .toLowerCase();

    const categoryMap = {
      clothing: "Clothing",
      clothes: "Clothing",
      cloth: "Clothing",
      dress: "Clothing",

      books: "Books",
      book: "Books",

      food: "Food",

      electronics: "Electronics",
      electronic: "Electronics",

      furniture: "Furniture",

      medical: "Medical Supplies",
      "medical supplies": "Medical Supplies",

      school: "School Supplies",
      "school supplies": "School Supplies",
      education: "School Supplies",
      stationery: "School Supplies",

      household: "Other",
      toys: "Other",
      toy: "Other",
    };

    return categoryMap[value] || "Other";
  };

  // =====================================================
  // AI IMAGE ANALYSIS
  // =====================================================

  const handleAnalyzeImage = async () => {
    if (!formData.item_image) {
      setAiError(
        "Please upload a donation image first."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");
      setAiItems([]);

      const imageData = new FormData();

      /*
       * IMPORTANT
       *
       * Backend team should accept:
       *
       * POST /api/donations/analyze-image/
       *
       * Field:
       * image
       */

      imageData.append(
        "image",
        formData.item_image
      );

      console.log(
        "Sending image for AI analysis..."
      );

      const response = await api.post(
        "donation/analyze/",
        imageData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "AI RESPONSE:",
        response.data
      );

      const data = response.data;

      // =================================================
      // NORMALIZE AI RESPONSE
      // =================================================

      let detectedItems = [];

      /*
       * Expected response:
       *
       * {
       *   items: [
       *     {
       *       item: "Shirt",
       *       category: "Clothing",
       *       quantity: 3,
       *       confidence: 0.94
       *     }
       *   ]
       * }
       */

      if (
        Array.isArray(data.items)
      ) {
        detectedItems =
          data.items;
      }

      /*
       * Backup for single-item response
       */

      if (
        detectedItems.length === 0 &&
        (
          data.item ||
          data.item_name ||
          data.detected_item
        )
      ) {
        detectedItems = [
          {
            item:
              data.item ||
              data.item_name ||
              data.detected_item,

            category:
              normalizeCategory(
                data.category
              ),

            quantity:
              Number(data.quantity) || 1,

            confidence:
              data.confidence ?? null,
          },
        ];
      }

      // =================================================
      // VALIDATE RESULT
      // =================================================

      if (
        detectedItems.length === 0
      ) {
        setAiError(
          "AI could not detect any donation items from this image."
        );
        return;
      }

      // =================================================
      // CLEAN RESULT
      // =================================================

      const cleanedItems =
        detectedItems.map(
          (item, index) => ({
            id: index,

            item:
              item.item ||
              item.item_name ||
              item.name ||
              "Unknown item",

            category:
              normalizeCategory(
                item.category
              ),

            quantity:
              Number(item.quantity) || 1,

            confidence:
              item.confidence ??
              null,
          })
        );

      setAiItems(
        cleanedItems
      );

      console.log(
        "Detected items:",
        cleanedItems
      );

    } catch (error) {
      console.error(
        "AI ANALYSIS ERROR:",
        error
      );

      console.error(
        "Status:",
        error.response?.status
      );

      console.error(
        "Response:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        setAiError(
          "Your login session has expired. Please login again."
        );
      } else if (
        error.response?.status === 404
      ) {
        setAiError(
          "AI analysis API was not found. Please check with your backend team."
        );
      } else {
        setAiError(
          "Unable to analyze the image. Please try again."
        );
      }
    } finally {
      setAiLoading(false);
    }
  };

  // =====================================================
  // TOTAL QUANTITY
  // =====================================================

  const totalQuantity = aiItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // =====================================================
  // SUBMIT DONATION
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // NGO
    if (!formData.ngo) {
      alert("Please select an NGO.");
      return;
    }

    // IMAGE
    if (!formData.item_image) {
      alert("Please upload an item image.");
      return;
    }

    // AI
    if (aiItems.length === 0) {
      alert(
        "Please analyze the image before submitting the donation."
      );
      return;
    }

    // LOCATION
    if (!formData.location.trim()) {
      alert("Please enter the pickup location.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Backend Donation API still expects:
       *
       * ngo
       * item_name
       * category
       * quantity
       * condition
       * description
       * location
       * item_image
       *
       * We generate these from AI.
       */

      const data = new FormData();

      data.append(
        "ngo",
        formData.ngo
      );

      /*
       * If multiple objects are detected,
       * send the names together.
       */

      const itemName =
        aiItems
          .map((item) => item.item)
          .join(", ");

      const categories = [
        ...new Set(
          aiItems.map((item) =>
            normalizeCategory(
              item.category
            )
          )
        ),
      ];

      /*
       * Backend category is a single-choice field.
       *
       * If all detected items belong to one category,
       * send that category.
       *
       * If multiple different categories are detected,
       * use "Other" instead of sending an invalid value
       * such as "Clothing, Books".
       */
      const category =
        categories.length === 1
          ? categories[0]
          : "Other";

      const quantity =
        totalQuantity;

      /*
       * Generate description automatically.
       */

      const description =
        aiItems
          .map(
            (item) =>
              `${item.item} × ${item.quantity}`
          )
          .join(", ");

      data.append(
        "item_name",
        itemName
      );

      data.append(
        "category",
        category
      );

      data.append(
        "quantity",
        quantity
      );

      data.append(
        "condition",
        formData.condition
      );

      data.append(
        "description",
        description
      );

      data.append(
        "location",
        formData.location
      );

      data.append(
        "item_image",
        formData.item_image
      );

      console.log(
        "Submitting AI-based donation..."
      );

      const response = await api.post(
        "donation/",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Donation Created:",
        response.data
      );

      alert(
        "AI-analyzed donation submitted successfully! 🤖📦"
      );

      navigate(
        "/my-donations"
      );

    } catch (error) {
      console.error(
        "DONATION ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your login session has expired. Please login again."
        );
      } else if (
        error.response?.data
      ) {
        alert(
          JSON.stringify(
            error.response.data
          )
        );
      } else {
        alert(
          "Cannot connect to backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SELECTED NGO
  // =====================================================

  const selectedNGO = ngos.find(
    (ngo) =>
      String(ngo.id) ===
      String(formData.ngo)
  );

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="donate-page">

      {/* =================================================
          HERO
      ================================================= */}

      <div className="donate-hero">

        <div>
          <span className="donate-badge">
            AI POWERED DONATION
          </span>

          <h1>
            Donate smarter.
            <br />
            <span>Create an impact.</span>
          </h1>

          <p>
            Upload a photo and let AI identify
            what you are donating and count the
            items automatically.
          </p>
        </div>

        <div className="hero-heart">
          🤖
        </div>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="donate-form"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            DONOR
        ================================================= */}

        <div className="donate-card donor-card">

          <div className="card-heading">

            <div className="heading-icon">
              👤
            </div>

            <div>
              <span>
                DONOR
              </span>

              <h2>
                Your contribution
              </h2>
            </div>

          </div>

          <div className="donor-information">

            <div className="donor-avatar">
              {donorName
                ? donorName
                    .charAt(0)
                    .toUpperCase()
                : "D"}
            </div>

            <div>
              <strong>
                {donorName ||
                  "Logged-in donor"}
              </strong>

              <span>
                {donorEmail ||
                  "Your donation account"}
              </span>
            </div>

            <div className="verified-label">
              ✓ Logged in
            </div>

          </div>

        </div>


        {/* =================================================
            NGO
        ================================================= */}

        <div className="donate-card">

          <div className="card-heading">

            <div className="heading-icon coral-icon">
              🏢
            </div>

            <div>
              <span>
                DESTINATION
              </span>

              <h2>
                Where should it go?
              </h2>
            </div>

          </div>

          <div className="form-group">

            <label>
              Select an approved NGO
            </label>

            <select
              name="ngo"
              value={formData.ngo}
              onChange={handleChange}
              required
              disabled={
                ngoLoading ||
                ngos.length === 0
              }
            >

              <option value="">
                {ngoLoading
                  ? "Loading approved NGOs..."
                  : ngos.length === 0
                  ? "No approved NGOs available"
                  : "Choose an NGO"}
              </option>

              {ngos.map((ngo) => (
                <option
                  key={ngo.id}
                  value={ngo.id}
                >
                  {ngo.ngo_name}
                </option>
              ))}

            </select>

            {ngoError && (
              <small className="error-message">
                {ngoError}
              </small>
            )}

          </div>

          {selectedNGO && (
            <div className="selected-ngo">

              <div className="selected-ngo-icon">
                🏢
              </div>

              <div>
                <strong>
                  {selectedNGO.ngo_name}
                </strong>

                <span>
                  Approved organization
                </span>
              </div>

              <span className="approved-badge">
                ✓ Approved
              </span>

            </div>
          )}

        </div>


        {/* =================================================
            IMAGE + AI
        ================================================= */}

        <div className="donate-card ai-card">

          <div className="card-heading">

            <div className="heading-icon ai-icon">
              🤖
            </div>

            <div>
              <span>
                AI ITEM DETECTION
              </span>

              <h2>
                Show us what you're donating
              </h2>
            </div>

          </div>


          {/* IMAGE UPLOAD */}

          <label
            htmlFor="item-image"
            className={
              imagePreview
                ? "upload-box has-preview"
                : "upload-box"
            }
          >

            {imagePreview ? (

              <div className="image-preview-wrapper">

                <img
                  src={imagePreview}
                  alt="Donation preview"
                />

                <div className="change-image">
                  Click to change image
                </div>

              </div>

            ) : (

              <div className="upload-content">

                <div className="upload-icon">
                  📷
                </div>

                <strong>
                  Upload a donation photo
                </strong>

                <span>
                  AI will identify and count
                  the items
                </span>

                <small>
                  JPG, JPEG or PNG
                </small>

              </div>

            )}

            <input
              id="item-image"
              type="file"
              name="item_image"
              accept="image/*"
              onChange={handleChange}
            />

          </label>


          {/* ANALYZE BUTTON */}

          <div className="ai-analyze-wrapper">

            <button
              type="button"
              className="ai-analyze-btn"
              onClick={
                handleAnalyzeImage
              }
              disabled={
                !formData.item_image ||
                aiLoading
              }
            >

              {aiLoading ? (
                <span className="ai-loading">
                  <span className="ai-spinner" />
                  AI is analyzing...
                </span>
              ) : (
                <>
                  🤖 Analyze Image
                </>
              )}

            </button>

          </div>


          {/* AI ERROR */}

          {aiError && (
            <div className="ai-error">
              ⚠️ {aiError}
            </div>
          )}


          {/* =================================================
              AI RESULTS
          ================================================= */}

          {aiItems.length > 0 && (

            <div className="ai-result-card">

              <div className="ai-result-header">

                <div className="ai-result-icon">
                  ✨
                </div>

                <div>
                  <span>
                    AI ANALYSIS COMPLETE
                  </span>

                  <h3>
                    Detected Donation Items
                  </h3>
                </div>

              </div>


              {/* TOTAL */}

              <div className="ai-total">

                <div>
                  <span>
                    ITEMS DETECTED
                  </span>

                  <strong>
                    {aiItems.length}
                  </strong>
                </div>

                <div>
                  <span>
                    TOTAL QUANTITY
                  </span>

                  <strong>
                    {totalQuantity}
                  </strong>
                </div>

              </div>


              {/* DETECTED ITEMS */}

              <div className="detected-items">

                {aiItems.map(
                  (item) => {

                    const confidence =
                      item.confidence !==
                      null
                        ? Number(
                            item.confidence
                          ) <= 1
                          ? Number(
                              item.confidence
                            ) * 100
                          : Number(
                              item.confidence
                            )
                        : null;

                    return (
                      <div
                        className="detected-item"
                        key={item.id}
                      >

                        <div className="detected-item-main">

                          <div className="detected-item-icon">
                            📦
                          </div>

                          <div>

                            <h4>
                              {item.item}
                            </h4>

                            <span>
                              {item.category}
                            </span>

                          </div>

                        </div>


                        <div className="detected-quantity">

                          <span>
                            Quantity
                          </span>

                          <strong>
                            × {item.quantity}
                          </strong>

                        </div>


                        {confidence !==
                          null && (

                          <div className="confidence">

                            <div className="confidence-top">

                              <span>
                                Confidence
                              </span>

                              <strong>
                                {confidence.toFixed(
                                  1
                                )}
                                %
                              </strong>

                            </div>

                            <div className="confidence-bar">

                              <div
                                className="confidence-fill"
                                style={{
                                  width: `${Math.min(
                                    confidence,
                                    100
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>

                        )}

                      </div>
                    );
                  }
                )}

              </div>


              <div className="ai-note">
                ✨ These details were detected
                automatically by AI. Please
                review the result before
                submitting your donation.
              </div>

            </div>

          )}

        </div>


        {/* =================================================
            CONDITION + LOCATION
        ================================================= */}

        <div className="donate-card">

          <div className="card-heading">

            <div className="heading-icon coral-icon">
              📋
            </div>

            <div>
              <span>
                DONATION DETAILS
              </span>

              <h2>
                A few details from you
              </h2>
            </div>

          </div>


          <div className="two-column">

            {/* CONDITION */}

            <div className="form-group">

              <label>
                Condition
              </label>

              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >

                <option value="New">
                  New
                </option>

                <option value="Like New">
                  Like New
                </option>

                <option value="Good">
                  Good
                </option>

                <option value="Used">
                  Used
                </option>

              </select>

            </div>


            {/* LOCATION */}

            <div className="form-group">

              <label>
                Pickup / Location
              </label>

              <div className="location-input">

                <span>
                  📍
                </span>

                <input
                  type="text"
                  name="location"
                  placeholder="Example: Vijayawada"
                  value={
                    formData.location
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            FINAL ACTION
        ================================================= */}

        <div className="donate-action">

          <div className="action-message">

            <span>
              ♥
            </span>

            <div>

              <strong>
                Ready to make a difference?
              </strong>

              <p>
                {aiItems.length > 0
                  ? `AI detected ${totalQuantity} item${
                      totalQuantity > 1
                        ? "s"
                        : ""
                    }. Your donation will be sent to the selected NGO for review.`
                  : "Upload and analyze your donation image before submitting."}
              </p>

            </div>

          </div>


          <button
            type="submit"
            className="donate-submit"
            disabled={
              loading ||
              ngoLoading ||
              ngos.length === 0 ||
              aiItems.length === 0
            }
          >

            {loading ? (
              <>
                <span className="donate-spinner" />
                Submitting...
              </>
            ) : (
              <>
                Donate Item
                <span>
                  →
                </span>
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}

export default DonateItem;