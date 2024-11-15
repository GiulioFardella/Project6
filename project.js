const API_URL = "https://striveschool-api.herokuapp.com/api/product"

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3MjBiZjhhZDEyOTAwMTU4NzZjNmQiLCJpYXQiOjE3MzE2NzcyMjYsImV4cCI6MTczMjg4NjgyNn0.6AWNYF3SjA0tqUKZbloe8z8ZCT10syW42gPo6WKGJLk"

const addressBar = new URLSearchParams(window.location.search)
const productId = addressBar.get("productId")

const form = document.getElementById("product-form")
const deleteBtn = document.getElementById("delete-btn")
const cardContainer = document.getElementById("card-container")

const showLoading = () => {
  const loading = document.createElement("div")
  loading.id = "loading"
  loading.className = "spinner-border text-primary "
  loading.role = "status"
  loading.innerHTML = '<span class="visually-hidden">Caricamento...</span>'
  document.body.appendChild(loading)
}

const hideLoading = () => {
  const loading = document.getElementById("loading")
  if (loading) loading.remove()
}

const createProductCard = (product) => {
  const card = document.createElement("div")
  card.className = "card m-3"
  card.style.width = "18rem"
  card.innerHTML = `
    <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">${product.description}</p>
      <p class="card-text fw-bold">Prezzo: €${product.price.toFixed(2)}</p>
    </div>
  `
  return card
}

if (productId) {
  showLoading()
  fetch(API_URL + "/" + productId,{
    method: 'PUT',
    body: JSON.stringify()
  }
  )
    .then(res => res.json())
    .then(product => {
      hideLoading()
      document.getElementById("name").value = product.name
      document.getElementById("description").value = product.description
      document.getElementById("price").value = product.price
      document.getElementById("imageUrl").value = product.imageUrl
      deleteBtn.classList.remove("d-none")
    })
    .catch(err => {
      hideLoading()
      alert("Errore nel caricamento del prodotto")
    })
}
class item {
    constructor(_name,_description,_brand,_imageUrl,_price){
        this.name=_name
        this.description=_description
        this.brand=_brand
        this.imageUrl=_imageUrl
        this.price=_price
    }
}

form.addEventListener("submit", (e) => {
  e.preventDefault()
  const product = {
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    price: parseFloat(document.getElementById("price").value),
    imageUrl: document.getElementById("imageUrl").value.trim()
  }
  if (!product.name || !product.description || !product.price || product.price <= 0 || !product.imageUrl) {
    return alert("Tutti i campi sono obbligatori e il prezzo deve essere maggiore di zero!")
  }
  const method = productId ? "PUT" : "POST"
  const endpoint = productId ? API_URL + productId : API_URL
  showLoading()
  fetch(endpoint, {
    method: method,
    body: JSON.stringify(product),
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      hideLoading()
      if (res.ok) {
        alert("Prodotto salvato con successo!")
        window.location.assign("./index.html")
      } else {
        throw new Error("Errore nel salvataggio del prodotto")
      }
    })
    .catch(err => {
      hideLoading()
      alert(err.message)
    })
})

form.addEventListener("reset", (e) => {
  if (!confirm("Sei sicuro di voler resettare il form?")) e.preventDefault()
})

deleteBtn.addEventListener("click", () => {
  if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
    showLoading()
    fetch(API_URL + productId, {
      method: "DELETE",
      headers: { Authorization: TOKEN }
    })
      .then(res => {
        hideLoading()
        if (res.ok) {
          alert("Prodotto eliminato con successo!")
          window.location.assign("./index.html")
        } else {
          throw new Error("Errore durante l'eliminazione")
        }
      })
      .catch(err => {
        hideLoading()
        alert(err.message)
      })
  }
})
