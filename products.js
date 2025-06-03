// products.js

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cartCount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = 1;
const productsPerPage = 25;
let allProducts = [];
let selectedCategory = "All";

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

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function renderProducts(products) {
  if (!productList) return;

  productList.innerHTML = '';
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginated = products.slice(startIndex, startIndex + productsPerPage);

  paginated.forEach(product => {
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

  renderPagination(products);
}

function renderPagination(products) {
  let pagination = document.getElementById("pagination");

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

function filterProductsByCategory(category) {
  selectedCategory = category;

  const filtered = (category === "All")
    ? allProducts
    : allProducts.filter(p => p.category === category);

  currentPage = 1;
  renderProducts(filtered);
}

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "All";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const searchInput = document.getElementById("searchInput");

  searchInput?.addEventListener("input", debounce(() => {
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
  }, 300));

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
});
