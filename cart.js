const container = document.getElementById("cart-items");

let shippingCost = parseInt(localStorage.getItem("shippingCost")) || 300;

renderCart();

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getShippingCost(area) {
  if (area === "kalutara") return 300;
  if (area === "colombo") return 350;
  if (area === "gampaha") return 350;
  if (area === "south") return 350;
  if (area === "central") return 350;
  return 400;
}

function getShippingLabel(area) {
  if (area === "kalutara") return "Kalutara District";
  if (area === "colombo") return "Colombo District";
  if (area === "gampaha") return "Gampaha District (Except Ja-Ela)";
  if (area === "south") return "Colombo-Mathara Road City";
  if (area === "central") return "Colombo-Kandy Road City";
  return "Ja-Ela and Other Districts";
}

function updateShipping() {
  const area = document.getElementById("shipping-area").value;

  shippingCost = getShippingCost(area);

  localStorage.setItem("shippingArea", area);
  localStorage.setItem("shippingCost", shippingCost);

  renderCart();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  cartCount.textContent = totalItems;
}

function renderCart() {
  const cart = getCart();
  container.innerHTML = "";

  const areaSelect = document.getElementById("shipping-area");
  const savedArea = localStorage.getItem("shippingArea") || "kalutara";

  if (areaSelect) {
    areaSelect.value = savedArea;
  }

  shippingCost = getShippingCost(savedArea);

  localStorage.setItem("shippingArea", savedArea);
  localStorage.setItem("shippingCost", shippingCost);

  let itemsTotal = 0;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart">Your cart is empty.</div>`;
    document.getElementById("summary-items-total").innerText = "Rs. 0";
    document.getElementById("shipping-fee").innerText = "Rs. " + shippingCost;
    document.getElementById("total").innerText = "Rs. " + shippingCost;
    updateCartCount();
    return;
  }

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    itemsTotal += itemTotal;

    container.innerHTML += `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-image" />

        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p class="cart-price">Price: Rs. ${item.price}</p>

          <div class="qty-box">
            <button type="button" onclick="decreaseQuantity(${index})">-</button>
            <span>${quantity}</span>
            <button type="button" onclick="increaseQuantity(${index})">+</button>
          </div>

          <p class="cart-subtotal">Subtotal: Rs. ${itemTotal}</p>
        </div>

        <div class="cart-item-actions">
          <button type="button" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  const finalTotal = itemsTotal + shippingCost;

  document.getElementById("summary-items-total").innerText = "Rs. " + itemsTotal;
  document.getElementById("shipping-fee").innerText = "Rs. " + shippingCost;
  document.getElementById("total").innerText = "Rs. " + finalTotal;

  updateCartCount();
}

function increaseQuantity(index) {
  let cart = getCart();

  if (!cart[index].quantity) {
    cart[index].quantity = 1;
  }

  cart[index].quantity += 1;
  saveCart(cart);
  renderCart();
}

function decreaseQuantity(index) {
  let cart = getCart();

  if (!cart[index].quantity) {
    cart[index].quantity = 1;
  }

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function sendWhatsAppOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const savedArea = localStorage.getItem("shippingArea") || "kalutara";
  const shippingLabel = getShippingLabel(savedArea);
  const shippingCost = getShippingCost(savedArea);

  let message = "Hello, I want to order:%0A%0A";
  let itemsTotal = 0;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    itemsTotal += itemTotal;

    message += `${index + 1}. ${item.name} x ${quantity} - Rs. ${itemTotal}%0A`;
  });

  const finalTotal = itemsTotal + shippingCost;

  message += `%0AShipping Area: ${shippingLabel}`;
  message += `%0AShipping Fee: Rs. ${shippingCost}`;
  message += `%0AItems Total: Rs. ${itemsTotal}`;
  message += `%0AFinal Total: Rs. ${finalTotal}`;

  const phoneNumber = "94762794698";
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
}

function goToCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  window.location.href = "checkout.html";
}
