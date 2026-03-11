// UI CONTROLS

document.addEventListener("DOMContentLoaded", () => {

const cartButton = document.getElementById("cart-button");
const closeCartButton = document.getElementById("close-cart-button");
const cartPanel = document.getElementById("cart-panel");

const chatbotButton = document.getElementById("chatbot-button");
const chatbotBox = document.getElementById("chatbot-box");


// ABRIR / CERRAR CARRITO
if(cartButton){

cartButton.addEventListener("click",(e)=>{
e.stopPropagation();

if(cartPanel.style.display === "block"){
cartPanel.style.display = "none";
}else{
cartPanel.style.display = "block";
}

});

}


// BOTON CERRAR CARRITO
if(closeCartButton){

closeCartButton.addEventListener("click",(e)=>{
e.stopPropagation();
cartPanel.style.display = "none";
});

}


// CERRAR CARRITO AL HACER CLICK FUERA
document.addEventListener("click",(e)=>{

if(
cartPanel &&
cartPanel.style.display === "block" &&
!cartPanel.contains(e.target) &&
!cartButton.contains(e.target)
){
cartPanel.style.display = "none";
}

});



// CHATBOT
if(chatbotButton){

chatbotButton.addEventListener("click",(e)=>{
e.stopPropagation();

if(chatbotBox.style.display === "block"){
chatbotBox.style.display = "none";
}else{
chatbotBox.style.display = "block";
}

});

}

});
