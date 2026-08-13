import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

  // Successful response
  (response) => {
    return response;
  },


  // Error response
  async (error) => {

    const originalRequest = error.config;


    // -------------------------------------------------
    // Only handle 401 once
    // -------------------------------------------------

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;


      const refresh =
        localStorage.getItem("refresh");


      // No refresh token
      if (!refresh) {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_type");

        window.location.href = "/login";

        return Promise.reject(error);
      }


      try {

        // ---------------------------------------------
        // Ask backend for new access token
        // ---------------------------------------------

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refresh,
          }
        );


        const newAccess =
          response.data.access;


        // ---------------------------------------------
        // Save new access token
        // ---------------------------------------------

        localStorage.setItem(
          "access",
          newAccess
        );


        // ---------------------------------------------
        // Retry original request
        // ---------------------------------------------

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;


        return api(originalRequest);


      } catch (refreshError) {

        console.error(
          "Refresh token failed:",
          refreshError
        );


        // ---------------------------------------------
        // Refresh token also expired
        // ---------------------------------------------

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user_type");

        window.location.href = "/login";


        return Promise.reject(
          refreshError
        );
      }
    }


    return Promise.reject(error);
  }
);


export default api;