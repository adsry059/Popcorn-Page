// cart.js

const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getTotalItems() {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = getTotalItems();
  }
}

function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="cart-product">
        <img src="${item.image}" alt="${item.name}">
        <span>${item.name}</span>
      </td>
      <td>RM${item.price.toFixed(2)}</td>
      <td>
        <button class="qty-btn" data-index="${index}" data-delta="-1">−</button>
        ${item.quantity}
        <button class="qty-btn" data-index="${index}" data-delta="1">+</button>
      </td>
      <td>RM${subtotal.toFixed(2)}</td>
    `;

    cartList.appendChild(tr);
  });

  const totalCell = document.getElementById("cart-total");
  totalCell.textContent = `RM${total.toFixed(2)}`;

  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const delta = parseInt(btn.dataset.delta);
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    });
  });

  updateCartCount();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
});
