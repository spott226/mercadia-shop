function toggleCart() {
  const cart = document.getElementById("cart-panel");
  if (!cart) return;

  if (cart.style.display === "block") {
    cart.style.display = "none";
  } else {
    cart.style.display = "block";
    if (typeof renderCart === "function") {
      renderCart();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const cartButton = document.getElementById("cart-button");
  const closeCartButton = document.getElementById("close-cart-button");
  const chatbotButton = document.getElementById("chatbot-button");

  if (cartButton) {
    cartButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleCart();
    });
  }

  if (closeCartButton) {
    closeCartButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleCart();
    });
  }

  if (chatbotButton && typeof toggleBot === "function") {
    chatbotButton.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleBot();
    });
  }
});

document.addEventListener("click", function (e) {
  const cart = document.getElementById("cart-panel");
  const cartButton = document.getElementById("cart-button");

  if (
    cart &&
    cart.style.display === "block" &&
    !cart.contains(e.target) &&
    cartButton &&
    !cartButton.contains(e.target)
  ) {
    cart.style.display = "none";
  }
});