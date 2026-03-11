let botStep = 0
let selectedCategory = null

function toggleBot(){

const box = document.getElementById("chatbot-box")

box.style.display =
box.style.display === "block" ? "none" : "block"

if(botStep === 0){
botStart()
}

}

function botStart(){

botStep = 1

const box = document.getElementById("chatbot-box")

box.innerHTML = `
<p>👋 Hola ¿quieres ayuda con tu compra?</p>

<button onclick="botCategorias()">
Ver productos
</button>

<button onclick="botWhatsDirect()">
Hablar por WhatsApp
</button>
`

}

function botCategorias(){

botStep = 2

const categories = [...new Set(window.allProducts.map(p => p.category))]

let buttons = ""

categories.forEach(cat=>{
buttons += `<button onclick="botProductos('${cat}')">${cat}</button>`
})

document.getElementById("chatbot-box").innerHTML = `
<p>¿Qué tipo de producto buscas?</p>

${buttons}

<button onclick="botStart()">⬅ volver</button>
`

}

function botProductos(category){

selectedCategory = category

const products = window.allProducts.filter(p => p.category === category)

let buttons = ""

products.forEach(p=>{
buttons += `
<button onclick="botComprar(${p.id})">
${p.name} - $${p.price}
</button>
`
})

document.getElementById("chatbot-box").innerHTML = `
<p>Estos productos encontré:</p>

${buttons}

<button onclick="botCategorias()">⬅ volver</button>
`

}

function botComprar(id){

const product = window.allProducts.find(p => p.id === id)

const message =
`Hola quiero comprar este producto:%0A${product.name}%0A$${product.price}`

window.open(
`https://wa.me/${storeWhats}?text=${message}`,
"_blank"
)

}

function botWhatsDirect(){

window.open(
`https://wa.me/${storeWhats}`,
"_blank"
)

}