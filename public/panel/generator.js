let productCount = 0

function addProduct(){

productCount++

const container = document.getElementById("products")

const div = document.createElement("div")
div.className = "product"

div.innerHTML = `

<h3>Producto ${productCount}</h3>

<input class="name" placeholder="Nombre producto">

<input class="price" type="number" placeholder="Precio">

<select class="category">
<option>sudaderas</option>
<option>gorras</option>
<option>playeras</option>
<option>tenis</option>
<option>perfumes</option>
<option>spa</option>
<option>otros</option>
</select>

<input class="stock" type="number" placeholder="Stock">

<input class="image" placeholder="imagen.jpg">

<textarea class="description" placeholder="Descripción"></textarea>

<label>
<input type="checkbox" class="featured">
Producto destacado
</label>

`

container.appendChild(div)

}

function sendJSON(){

const store = {

id: document.getElementById("store_id").value,
name: document.getElementById("store_name").value,
whatsapp: document.getElementById("store_whatsapp").value,
currency:"MXN",
logo:"/assets/logos/"+document.getElementById("store_logo").value,
active:true

}

const products = []

document.querySelectorAll(".product").forEach((p,i)=>{

products.push({

id: Date.now()+i,
store: store.id,
name: p.querySelector(".name").value,
price: Number(p.querySelector(".price").value),
category: p.querySelector(".category").value,
stock: Number(p.querySelector(".stock").value),
image: "/assets/products/"+store.id+"/"+p.querySelector(".image").value,
description: p.querySelector(".description").value,
featured: p.querySelector(".featured").checked,
active:true

})

})

const data = {

stores:[store],
products:products

}

const json = JSON.stringify(data,null,2)

const numeroAdmin = "524494389825"

const mensaje = encodeURIComponent(json)

window.open(`https://wa.me/${numeroAdmin}?text=${mensaje}`)

}