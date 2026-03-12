const productContainer = document.getElementById("product-details");
const relatedContainer = document.getElementById("related-products");

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

function getStockClass(status) {
  if (status === "In Stock") return "in-stock";
  if (status === "Limited Stock") return "limited-stock";
  return "out-of-stock";
}

fetch("products.json")
  .then(response => response.json())
  .then(products => {
    const product = products.find(item => item.id === productId);

    if (!product) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      if (relatedContainer) {
        relatedContainer.innerHTML = "<p>No related products found.</p>";
      }
      return;
    }

    const stockStatus = product.stockStatus || "In Stock";
    const isOutOfStock = stockStatus === "Out of Stock";

    productContainer.innerHTML = `
      <div class="product-details-card">

        <div class="product-details-image-box">
          <img src="${product.image}" alt="${product.name}" class="product-details-image">
        </div>

        <div class="product-details-info">

          <div class="stock-badge ${getStockClass(stockStatus)}">
            ${stockStatus}
          </div>

          <h2>${product.name}</h2>

          <p class="product-details-price">Rs. ${product.price}</p>

          <p class="product-details-description">
            ${product.description}
          </p>

          <button 
            type="button" 
            onclick="addToCart(${product.id})"
            ${isOutOfStock ? "disabled" : ""}
          >
            ${isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>

        </div>

      </div>
    `;

    window.currentProduct = product;

    showRelatedProducts(products, product);
  })
  .catch(error => {
    console.error("Error loading product:", error);
    productContainer.innerHTML = "<p>Failed to load product.</p>";
    if (relatedContainer) {
      relatedContainer.innerHTML = "<p>Failed to load related products.</p>";
    }
  });


function showRelatedProducts(products, currentProduct) {
  if (!relatedContainer) return;

  const relatedProducts = products.filter(item =>
    item.category === currentProduct.category &&
    item.id !== currentProduct.id
  );

  if (relatedProducts.length === 0) {
    relatedContainer.innerHTML = "<p>No related products found.</p>";
    return;
  }

  relatedContainer.innerHTML = "";

  relatedProducts.slice(0, 4).forEach(product => {

    const stockStatus = product.stockStatus || "In Stock";
    const isOutOfStock = stockStatus === "Out of Stock";

    relatedContainer.innerHTML += `
      <div class="product-card">

        <div class="stock-badge ${getStockClass(stockStatus)}">
          ${stockStatus}
        </div>

        <a href="product.html?id=${product.id}" class="product-link">
          <img src="${product.image}" alt="${product.name}">
        </a>

        <h3>
          <a href="product.html?id=${product.id}" class="product-link-text">
            ${product.name}
          </a>
        </h3>

        <p>Rs. ${product.price}</p>

        <button 
          type="button"
          onclick="addRelatedToCart(${product.id})"
          ${isOutOfStock ? "disabled" : ""}
        >
          ${isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>

      </div>
    `;
  });
}


function addToCart(id) {
  if (!window.currentProduct || window.currentProduct.id !== id) return;

  if (window.currentProduct.stockStatus === "Out of Stock") return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(item => item.id === window.currentProduct.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({
      ...window.currentProduct,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(window.currentProduct.name + " added to cart");
}


function addRelatedToCart(id) {
  fetch("products.json")
    .then(response => response.json())
    .then(products => {

      const product = products.find(item => item.id === id);
      if (!product) return;

      if (product.stockStatus === "Out of Stock") return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        cart.push({
          ...product,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart");
    });
}
