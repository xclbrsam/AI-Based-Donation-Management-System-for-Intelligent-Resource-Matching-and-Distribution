import { Navigate } from "react-router-dom";


function ProtectedRoute({
    children,
    allowedRole,
}) {

    const token =
        localStorage.getItem(
            "access_token"
        );


    const user =
        JSON.parse(
            localStorage.getItem("user") || "{}"
        );


    // =========================================
    // NOT LOGGED IN
    // =========================================

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // =========================================
    // WRONG ROLE
    // =========================================

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        if (user.role === "Donor") {

            return (
                <Navigate
                    to="/donor-dashboard"
                    replace
                />
            );

        }


        if (user.role === "NGO") {

            return (
                <Navigate
                    to="/ngo-dashboard"
                    replace
                />
            );

        }


        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return children;

}


export default ProtectedRoute;