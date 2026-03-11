function toggleCart(){

const cartPanel = document.getElementById("cart-panel");

if(!cartPanel) return;

if(cartPanel.style.display === "block"){
cartPanel.style.display = "none";
}else{
cartPanel.style.display = "block";

if(typeof updateCartUI === "function"){
updateCartUI();
}

}

}


document.addEventListener("DOMContentLoaded",()=>{

const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart-button");

if(cartButton){

cartButton.addEventListener("click",(e)=>{
e.stopPropagation();
toggleCart();
});

}

if(closeCartButton){

closeCartButton.addEventListener("click",(e)=>{
e.stopPropagation();
toggleCart();
});

}

});


// cerrar carrito si se hace click fuera
document.addEventListener("click",(e)=>{

const cartPanel = document.getElementById("cart-panel");
const cartButton = document.getElementById("cart-button");

if(
cartPanel &&
cartPanel.style.display === "block" &&
!cartPanel.contains(e.target) &&
cartButton &&
!cartButton.contains(e.target)
){

cartPanel.style.display = "none";

}

});


window.toggleCart = toggleCart;
