const email = document.querySelector("#e-mail");
const password = document.querySelector("#mot-de-passe");
const form = document.querySelector("#login-form");
const errorMessage = document.querySelector("#message-error");

   
form.addEventListener("submit", async function(event) {
    event.preventDefault()

    const emailValue = email.value 
    const passwordValue = password.value

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue
        })
    });
    const userData = await reponse.json()

    if (reponse.ok) {
        window.localStorage.setItem("token", userData.token)
        window.location.href = "index.html"
    } else {
        errorMessage.textContent = "Identifiant ou mot de passe incorrect."
        };
});



