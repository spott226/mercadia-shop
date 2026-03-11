function toggleCart() {

const cart = document.getElementById("cart-panel");
if (!cart) return;

if (cart.style.display === "block") {

cart.style.display = "none";

} else {

cart.style.display = "block";

if (typeof updateCartUI === "function") {
updateCartUI();
}

}

}
