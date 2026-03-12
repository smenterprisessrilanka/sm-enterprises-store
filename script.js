let allProducts = [];

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

fetch("products.json")
  .then(response => response.json())
  .then(products => {
    allProducts = products;
    displayProducts(allProducts);
    updateCartCount();

    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");

    if (searchInput) {
      searchInput.addEventListener("input", filterProducts);
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", filterProducts);
    }
  })
  .catch(error => {
    console.error("Error loading products:", error);
  });

function displayProducts(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<p>No products found.</p>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <img src="${product.image}" alt="${product.name}">
      </a>

      <h3>
        <a href="product.html?id=${product.id}" class="product-link-text">
          ${product.name}
        </a>
      </h3>

      <p>Rs. ${product.price}</p>

      <button type="button">Add to Cart</button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => {
      addToCart(product);
    });

    container.appendChild(card);
  });
}

function filterProducts() {
  const searchText = document.getElementById("search-input").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("category-filter").value;

  const filtered = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

function addToCart(product) {
  let cart = getCart();

  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
  alert(product.name + " added to cart");
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  cartCount.textContent = totalItems;

  if (totalItems === 0) {
    cartCount.style.display = "none";
  } else {
    cartCount.style.display = "flex";
  }
}
