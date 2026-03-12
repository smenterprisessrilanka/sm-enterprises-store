const productContainer = document.getElementById("product-details");

const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

fetch("products.json")
  .then(response => response.json())
  .then(products => {
    const product = products.find(item => item.id === productId);

    if (!product) {
      productContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    productContainer.innerHTML = `
      <div class="product-details-card">
        <div class="product-details-image-box">
          <img src="${product.image}" alt="${product.name}" class="product-details-image">
        </div>

        <div class="product-details-info">
          <h2>${product.name}</h2>
          <p class="product-details-price">Rs. ${product.price}</p>
          <p class="product-details-description">${product.description}</p>
          <button type="button" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;

    window.currentProduct = product;
  })
  .catch(error => {
    console.error("Error loading product:", error);
    productContainer.innerHTML = "<p>Failed to load product.</p>";
  });

function addToCart(id) {
  if (!window.currentProduct || window.currentProduct.id !== id) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingProduct = cart.find(item => item.id === window.currentProduct.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    cart.push({ ...window.currentProduct, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(window.currentProduct.name + " added to cart");
}