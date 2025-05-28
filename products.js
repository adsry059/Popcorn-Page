let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = `(${cart.reduce((total, item) => total + item.quantity, 0)})`;
  }
}

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
}

// Read category from URL
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

// Display filtered products
function filterProductsByCategory(category) {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = ""; // Clear previous
  const filtered = category
    ? allProducts.filter(p => p.category === category)
    : allProducts;

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>RM${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      const category = getCategoryFromURL();
      filterProductsByCategory(category);
      updateCartCount();
    });
});
