let travaux = []
let categories = []


const token = window.localStorage.getItem("token");

const filtersButton = document.querySelector(".filters");

//mode edtition//
const editionMod = document.querySelector(".edition-mod");
const addMod = document.querySelector(".add-mod");
const login = document.querySelector("header nav a");

// modal générale //
const modifyButton = document.querySelector(".modifier");
const modal = document.querySelector(".modal");
const closeButtons = document.querySelectorAll(".close");
const backButton = document.querySelector(".back");

//gestion des affichages intra-modal//
const accessForm = document.querySelector(".switch-add-photo");
const affichageGallery = document.querySelector(".modal-gallery")
const affichageForm = document.querySelector(".modal-form")

// formulaire de la modal //
const modalForm = document.querySelector(".js-form");
const fileModalContent = document.querySelector(".add-photo-content")
const fileModalContentElement = fileModalContent.querySelectorAll ("i, label, p")
const fileModal = document.querySelector("#add-photo-file")
const titleModal = document.querySelector("#title")
const selectModal = document.querySelector(".js-form select")

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

async function recupererCategorie() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    const categories = await reponse.json()

    return categories
}

async function createFilters() {

    categories = await recupererCategorie()

    const filters = document.querySelector(".filters")

    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"

    buttonAll.addEventListener("click", function () {
        const gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""
        afficherTravaux(travaux)
    });

    filters.appendChild(buttonAll)

    for(let i=0; i<categories.length; i++) {
        const button = document.createElement("button")

        button.innerText = categories[i].name

        button.setAttribute("data-category-id", categories[i].id)

        button.addEventListener("click", function(event) {
            const categoriesId = event.target.dataset.categoryId
            const travauxFiltrees = travaux.filter(function(travail) {
            return travail.categoryId === Number(categoriesId)
        });

        const gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""

        afficherTravaux(travauxFiltrees)
        })

        filters.appendChild(button)
    };
};


function afficherTravauxModal(listeTravaux) {
    const galleryContent = document.querySelector(".gallery-content")

    for(let i = 0; i < listeTravaux.length; i++){
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const deleteImg = document.createElement("button")

    image.setAttribute("src", listeTravaux[i].imageUrl)
    deleteImg.dataset.id = listeTravaux[i].id;

    deleteImg.addEventListener("click", async (event) => {

            const reponse = await fetch(`http://localhost:5678/api/works/${deleteImg.dataset.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (reponse.ok) {
            event.target.parentElement.remove()
            const travauxFiltrees = travaux.filter(function(travail) {
                return travail.id !== Number(deleteImg.dataset.id)

               
            });
             travaux = travauxFiltrees

            const gallery = document.querySelector(".gallery")
            gallery.innerHTML = ""
            afficherTravaux(travaux)
        }
        
    });

    figure.appendChild(image)
    figure.appendChild(deleteImg)
    galleryContent.appendChild(figure)
    }
};

// Partie gestion changement / ouverture / fermeture //

modifyButton.addEventListener("click", () => {
    modal.classList.add("visible")
});

function fermerModal() {
    modal.classList.remove("visible");
    affichageForm.classList.remove("visible");
    affichageGallery.classList.remove("cache");
}

modal.addEventListener("click", event => {
    if (event.target === modal) {
        fermerModal()
    };
});

closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
        fermerModal()
    });
});

accessForm.addEventListener("click", () => {
    affichageGallery.classList.add("cache")
    affichageForm.classList.add("visible")
});

backButton.addEventListener("click", () => {
    affichageForm.classList.remove("visible")
    affichageGallery.classList.remove("cache")
});

fileModal.addEventListener("change", (event) => {
    const fichier = event.target.files[0]
    const imageURL = URL.createObjectURL(fichier);
    console.log(imageURL);
    const image = document.createElement("img")
    image.src = imageURL

    fileModalContent.appendChild(image);   
    
    fileModalContentElement.forEach((contentElement) => {
        contentElement.classList.add("cache")
    });
});

async function createCategories() {
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option")

        option.setAttribute("value", categories[i].id)
        option.innerText = categories[i].name
        
        selectModal.appendChild(option)
    }
};

modalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileModal.files[0]
    const title = titleModal.value;
    const categorie = selectModal.value

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categorie);

    const reponse = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`
    },
        body: formData
    });

    if(reponse.ok){
        const newWork = await reponse.json();

        travaux.push(newWork);

        afficherTravaux([newWork]);
        afficherTravauxModal([newWork]);
    } 
});

async function initialiser() {
    await recupererTravaux()
    afficherTravaux(travaux)
    await createFilters()
    afficherTravauxModal(travaux)
    await createCategories()
}

initialiser()

