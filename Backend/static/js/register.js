const form = document.getElementById("registerForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const data = {

        username: document.getElementById("username").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value,

        phone: document.getElementById("phone").value,

        role: document.getElementById("role").value

    };

    try{

        const response = await fetch("http://127.0.0.1:8000/api/register/",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result = await response.json();

        if(response.ok){

            document.getElementById("message").style.color="green";

          document.getElementById("message").innerHTML="Registration Successful";

           setTimeout(function(){

              window.location.href="/login-page/";
 
             },1500);

            form.reset();

        }

        else{

            document.getElementById("message").style.color="red";

            document.getElementById("message").innerHTML=JSON.stringify(result);

        }

    }

    catch(error){

        document.getElementById("message").style.color="red";

        document.getElementById("message").innerHTML="Server Error";
    }

});