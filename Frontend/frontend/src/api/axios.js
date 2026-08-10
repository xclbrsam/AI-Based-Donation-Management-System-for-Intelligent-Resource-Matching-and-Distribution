import axios from "axios";


const api = axios.create({

    baseURL: "http://127.0.0.1:8000/api",

    headers: {
        Accept: "application/json",
    },

});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "access_token"
            );


        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );

        console.log(
            "ACCESS TOKEN EXISTS:",
            !!token
        );


        // =============================================
        // JWT
        // =============================================

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        // =============================================
        // FORM DATA
        // =============================================

        if (
            config.data instanceof FormData
        ) {

            /*
             * IMPORTANT:
             *
             * Don't force application/json.
             *
             * Browser/Axios will create:
             *
             * multipart/form-data;
             * boundary=...
             */

            delete config.headers[
                "Content-Type"
            ];

        }

        else {

            config.headers[
                "Content-Type"
            ] = "application/json";

        }


        return config;

    },

    (error) => {

        return Promise.reject(
            error
        );

    }

);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response?.status === 401
        ) {

            console.log(
                "JWT AUTHENTICATION FAILED"
            );

            console.log(
                "URL:",
                error.config?.url
            );

        }


        return Promise.reject(
            error
        );

    }

);


export default api;