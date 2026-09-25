let works = []
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
const galleryDisplay = document.querySelector(".modal-gallery")
const formDisplay = document.querySelector(".modal-form")

// formulaire de la modal //
const modalForm = document.querySelector(".js-form");
const fileModalContent = document.querySelector(".add-photo-content")
const fileModalContentElement = fileModalContent.querySelectorAll ("i, label, p")
const modalFile = document.querySelector("#add-photo-file")
const modalTitle = document.querySelector("#title")
const modalSelect = document.querySelector(".js-form select")
const errorMessage = document.querySelector(".message-erreur")

// gestion du token + page//
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



async function getWorks () {
    
    const response = await fetch("http://localhost:5678/api/works")
    works = await response.json()
};

function displayWorks (worksList) {
    const gallery = document.querySelector(".gallery")

    for(let i = 0; i < worksList.length; i++){
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const figcaption = document.createElement ("figcaption")

    figcaption.innerText = worksList[i].title
    image.setAttribute("src", worksList[i].imageUrl)

    figure.appendChild(image)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
    }
};

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    const categories = await response.json()

    return categories
}

async function createFilters() {

    categories = await getCategories()

    const filters = document.querySelector(".filters")

    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"

    buttonAll.addEventListener("click", function () {

        const button = document.querySelectorAll(".filters button")

        for (let i = 0; i < button.length; i++) {
        button[i].classList.remove("filter-active")
    };

        buttonAll.classList.add("filter-active")

        const gallery = document.querySelector(".gallery")
        gallery.innerHTML = ""

        displayWorks(works)
    });

    filters.appendChild(buttonAll)

    for(let i=0; i<categories.length; i++) {
        const button = document.createElement("button")

        button.innerText = categories[i].name

        button.setAttribute("data-category-id", categories[i].id)

        button.addEventListener("click", function(event) {

            const button = document.querySelectorAll(".filters button")

            for (let i = 0; i < button.length; i++) {
            button[i].classList.remove("filter-active")
            };

            event.target.classList.add("filter-active")
            
            const categoryId = event.target.dataset.categoryId;

            const filteredWorks = works.filter(function(work) {
            return work.categoryId === Number(categoryId);                
            });
            
            const gallery = document.querySelector(".gallery")
            gallery.innerHTML = ""

            displayWorks(filteredWorks)
        });        

        filters.appendChild(button)
    };
};



function displayWorksModal(worksList) {
    const galleryContent = document.querySelector(".gallery-content")

    for(let i = 0; i < worksList.length; i++){
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const deleteButton = document.createElement("button")

    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    image.setAttribute("src", worksList[i].imageUrl)
    deleteButton.dataset.id = worksList[i].id;

    deleteButton.addEventListener("click", async (event) => {

            const response = await fetch(`http://localhost:5678/api/works/${deleteButton.dataset.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            event.target.closest("figure").remove()
            const filteredWorks = works.filter(function(work) {
                return work.id !== Number(deleteButton.dataset.id)               
            });

            works = filteredWorks

            const gallery = document.querySelector(".gallery")
            gallery.innerHTML = ""
            displayWorks(works)
        }
        
    });

    figure.appendChild(image)
    figure.appendChild(deleteButton)
    galleryContent.appendChild(figure)
    }
};



// Partie gestion changement / ouverture / fermeture //
modifyButton.addEventListener("click", () => {
    modal.classList.add("visible")
});

function closeModal() {
    modal.classList.remove("visible");
    formDisplay.classList.remove("visible");
    galleryDisplay.classList.remove("cache");

    modalForm.reset();
    errorMessage.textContent = ""

    const image = fileModalContent.querySelector("img");

    if (image) {
        image.remove()
        fileModalContentElement.forEach((contentElement) => {
        contentElement.classList.remove("cache")
        });
        modalFile.value = ""
    };

    checkForm()
};

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal()
    };
});

closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", () => {
        closeModal()
    });
});

accessForm.addEventListener("click", () => {
    galleryDisplay.classList.add("cache")
    formDisplay.classList.add("visible")
});

backButton.addEventListener("click", () => {
    formDisplay.classList.remove("visible")
    galleryDisplay.classList.remove("cache")
});

modalFile.addEventListener("change", (event) => {
    const file = event.target.files[0]
    const imageURL = URL.createObjectURL(file);
    const image = document.createElement("img")
    image.src = imageURL

    fileModalContent.appendChild(image);   
    
    fileModalContentElement.forEach((contentElement) => {
        contentElement.classList.add("cache")
    });
});



async function createCategories() {

    const emptyOption = document.createElement("option");
    emptyOption.innerText = "";
    emptyOption.value = "";
    modalSelect.appendChild(emptyOption);

    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option")

        option.setAttribute("value", categories[i].id)
        option.innerText = categories[i].name
        
        modalSelect.appendChild(option)
    }
};



//Envoie à l'API nouvelles données via modal //
modalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = modalFile.files[0]
    const title = modalTitle.value;
    const category = modalSelect.value

    if (title === "") {
        errorMessage.textContent = "Veuillez saisir un titre";
    } else if (file === undefined) {
                errorMessage.textContent = "Veuillez sélectionner un fichier";
        } else if (category === "") {
                     errorMessage.textContent = "Veuillez sélectionner une catégorie";
    } else {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", title);
        formData.append("category", category);

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`
        },
            body: formData
        });

        if(response.ok){
            const newWork = await response.json();

            works.push(newWork);

            displayWorks([newWork]);
            displayWorksModal([newWork]);

            modalForm.reset()
            errorMessage.textContent = ""
            checkForm()

            const image = fileModalContent.querySelector("img");

            if (image) {
                image.remove()
                fileModalContentElement.forEach((contentElement) => {
                    contentElement.classList.remove("cache")
                });
                modalFile.value = ""
            }
        } 
    };  
});



// bouton vert quand condition modal remplie//
function checkForm () {

    const submitForm = document.querySelector(".submit-form");

    if (modalTitle.value !== "" && modalFile.files[0] !== undefined && modalSelect.value !== "") {
        submitForm.classList.add("active")
    } else {
        submitForm.classList.remove("active")
    };
};

modalTitle.addEventListener("input", () => {
    checkForm();
    });

modalFile.addEventListener("change", () => {
    checkForm();
});

modalSelect.addEventListener("change", () => {
    checkForm();
});



async function initialize() {
    await getWorks()
    displayWorks(works)
    await createFilters()
    displayWorksModal(works)
    await createCategories()
}

initialize()

