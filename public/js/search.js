function searchProducts(){

const input = document
.getElementById("search-input")
.value
.toLowerCase();

if(!window.allProducts) return;

const filtered = window.allProducts.filter(product =>

product.name.toLowerCase().includes(input) ||
product.description.toLowerCase().includes(input) ||
product.category.toLowerCase().includes(input)

);

renderProducts(filtered);

}