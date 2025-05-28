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

// Pagination-related
let currentPage = 1;
const productsPerPage = 25;
let allProducts = []; // To store all loaded products

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

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <button class="add-to-cart-btn">
        <span>RM ${product.price.toFixed(2)}</span> <span>+</span>
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      addToCart(product);
    });

    productList.appendChild(card);
  });

const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      let filtered = allProducts;

      if (query !== "") {
        filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          (product.category && product.category.toLowerCase().includes(query))
        );
      } else if (selectedCategory && selectedCategory !== "All") {
        filtered = allProducts.filter(p => p.category === selectedCategory);
      }

      currentPage = 1;
      renderProducts(filtered);
    });
  }

  renderPagination(products); // Add pagination buttons
}

function renderPagination(products) {
  let pagination = document.getElementById("pagination");

  // Create pagination container if it doesn't exist
  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.className = "pagination";
    productList.after(pagination);
  }

  pagination.innerHTML = "";

  const totalPages = Math.ceil(products.length / productsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts(products);
    });
    pagination.appendChild(btn);
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

  // Add event listeners
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

function filterProductsByCategory(category) {
  selectedCategory = category;

  const filteredProducts = (category === "All")
    ? allProducts
    : allProducts.filter(p => p.category === category);

  currentPage = 1; // reset to page 1 when category changes
  renderProducts(filteredProducts);
}

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "All";
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (productList) {
    fetch("products.json")
      .then(res => res.json())
      .then(data => {
        allProducts = data;
        const categoryFromURL = getCategoryFromURL();
        filterProductsByCategory(categoryFromURL);
      })
      .catch(err => console.error("Failed to load products:", err));
  }

  if (cartList) {
    renderCart();
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }
});
