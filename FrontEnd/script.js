let travaux = []
const token = window.localStorage.getItem("token");
const editionMod = document.querySelector(".edition-mod");
const addMod = document.querySelector(".add-mod")
const login = document.querySelector("header nav a");
const filtersButton = document.querySelector(".filters")

if (token) {
    editionMod.classList.add("visible")
    addMod.classList.add("visible")
    filtersButton.classList.add("cache")
    login.textContent = "Logout"
} else {
    editionMod.classList.remove("visible")
    addMod.classList.remove("visible")
    filtersButton.classList.remove("cache")
}

login.addEventListener("click", function (event) {
    if (token) {
    event.preventDefault()
    window.localStorage.removeItem("token")
    window.location.href = "index.html"
    }
});



async function recupererTravaux () {
    
    const reponse = await fetch("http://localhost:5678/api/works")
    travaux = await reponse.json()
};

function afficherTravaux(listeTravaux) {
    const gallery = document.querySelector(".gallery")

    for(let i = 0; i < listeTravaux.length; i++){
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const figcaption = document.createElement ("figcaption")

    figcaption.innerText = listeTravaux[i].title
    image.setAttribute("src", listeTravaux[i].imageUrl)

    figure.appendChild(image)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
    }
};

async function recupererButton() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    const categorie = await reponse.json()

    const filters = document.querySelector(".filters")

    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"

    buttonAll.addEventListener("click", function () {
        const gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""
        afficherTravaux(travaux)
    });

    filters.appendChild(buttonAll)

    for(let i=0; i<categorie.length; i++) {
        const button = document.createElement("button")

        button.innerText = categorie[i].name

        button.setAttribute("data-category-id", categorie[i].id)

        button.addEventListener("click", function(event) {
            const categorieId = event.target.dataset.categoryId
            const travauxFiltrees = travaux.filter(function(travail) {
            return travail.categoryId === Number(categorieId)
        });

        const gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""

        afficherTravaux(travauxFiltrees)
        })

        filters.appendChild(button)
    };
}

async function initialiser() {
    await recupererTravaux()
    afficherTravaux(travaux)
    recupererButton()
}

initialiser()

