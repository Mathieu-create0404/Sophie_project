async function recupererTravaux () {
    
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()

    const gallery = document.querySelector(".gallery")

    for(let i = 0; i < travaux.length; i++){
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const figcaption = document.createElement ("figcaption")

    figcaption.innerText = travaux[i].title
    image.setAttribute("src", travaux[i].imageUrl)

    figure.appendChild(image)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
    }
}

recupererTravaux()

async function recupererButton() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    const categorie = await reponse.json()

    const filters = document.querySelector(".filters")

    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"
    filters.appendChild(buttonAll)

    for(let i=0; i<categorie.length; i++) {
        const button = document.createElement("button")

        button.innerText = categorie[i].name

        filters.appendChild(button)
    }

}

recupererButton()