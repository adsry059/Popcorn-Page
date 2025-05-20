fetch("products.json")
    .then(res => res.json())
    .then(products => {
        renderProducts(products); 
    })
    .catch(err => console.error("Failed to load products:", err)); 

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cartCount");
const clearCartBtn = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getTotalItems() {
    if (!Array.isArray(cart)) return 0; // Prevent crash if cart is not an array
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  

function updateCartCount() {
  if (cartCount) {
    cartCount.textContent = getTotalItems();
  }
}

function addToCart(product) {
  const index = cart.findIndex(item => item.name === product.name);
  if (index !== -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateCartCount();
}

function renderProducts(products) {
  if (!productList) return;

  productList.innerHTML = ''; // Clear previous content

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart-btn">
        <span>$${product.price.toFixed(2)}</span> <span>+</span>
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      addToCart(product);
    });

    productList.appendChild(card);
  });
}

function renderCart() {
  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.quantity} – $${(item.price * item.quantity).toFixed(2)}
      <button class="qty-btn" data-index="${index}" data-delta="1">+</button>
      <button class="qty-btn" data-index="${index}" data-delta="-1">–</button>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  const totalItem = document.createElement("li");
  totalItem.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  cartList.appendChild(totalItem);

  cartList.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      const delta = parseInt(btn.getAttribute("data-delta"));
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    });
  });

  cartList.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      cart.splice(index, 1);
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

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (productList) {
    fetch("products.json")
      .then(res => res.json())
      .then(data => renderProducts(data))
      .catch(err => console.error("Failed to load products:", err));
  }

  if (cartList) {
    renderCart();
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
});
