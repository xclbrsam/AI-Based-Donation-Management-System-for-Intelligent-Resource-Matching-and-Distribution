const form =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        try {

            const response = await fetch(
                "/api/login/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        username: username,

                        password: password

                    })

                }
            );


            const result =
                await response.json();


            if (response.ok) {

                // Store JWT

                localStorage.setItem(
                    "access_token",
                    result.tokens.access
                );


                localStorage.setItem(
                    "refresh_token",
                    result.tokens.refresh
                );


                message.style.color =
                    "green";


                message.textContent =
                    "Login successful!";


                // ----------------------------------
                // ROLE BASED REDIRECTION
                // ----------------------------------

                if (result.user.role === "Donor") {

                    window.location.href =
                        "/donor-dashboard/";

                }

                else if (result.user.role === "NGO") {

                    window.location.href =
                        "/ngo-dashboard/";

                }

            }

            else {

                message.style.color =
                    "red";


                message.textContent =
                    result.message ||
                    "Login failed.";

            }

        }

        catch (error) {

            console.error(error);


            message.style.color =
                "red";


            message.textContent =
                "Unable to connect to server.";

        }

    }
);