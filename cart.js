let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  if (!cartList || !cartTotal) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>RM${item.price.toFixed(2)}</td>
      <td>
        <button data-index="${index}" data-delta="-1">-</button>
        ${item.quantity}
        <button data-index="${index}" data-delta="1">+</button>
      </td>
      <td>RM${subtotal.toFixed(2)}</td>
    `;
    cartList.appendChild(row);
  });

  cartTotal.textContent = `RM${total.toFixed(2)}`;

  // Reattach event listeners to buttons
  document.querySelectorAll("button[data-index]").forEach(btn => {
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
}

// Clear cart
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

// On load
document.addEventListener("DOMContentLoaded", renderCart);
