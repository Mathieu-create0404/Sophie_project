const email = document.querySelector("#e-mail");
const motDePasse = document.querySelector("#mot-de-passe");
const formulaire = document.querySelector("#login-form");
const messageErreur = document.querySelector("#message-error")
   
formulaire.addEventListener("submit", async function(event) {
    event.preventDefault()

    const emailValue = email.value 
    const motDePasseValue = motDePasse.value

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailValue,
            password: motDePasseValue
        })
    });
    const donnéesUtilisateur = await reponse.json()

    if (reponse.ok) {
        window.localStorage.setItem("token", donnéesUtilisateur.token)
        window.location.href = "index.html"
    } else {
        messageErreur.textContent = "Identifiant ou mot de passe incorrect."
        };
});

