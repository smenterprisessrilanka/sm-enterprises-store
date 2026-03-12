const cart = JSON.parse(localStorage.getItem("cart")) || [];
const shippingCost = parseInt(localStorage.getItem("shippingCost")) || 0;
const shippingArea = localStorage.getItem("shippingArea") || "kalutara";

const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

renderCheckoutItems();

function getShippingAreaLabel(area) {
  if (area === "kalutara") return "Kalutara District";
  if (area === "colombo") return "Colombo District";
  if (area === "gampaha") return "Gampaha District (Except Ja-Ela)";
  return "Ja-Ela and Other Districts";
}

function renderCheckoutItems() {
  checkoutItems.innerHTML = "";
  let itemsTotal = 0;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
    checkoutTotal.innerText = "Total: Rs. 0";
    return;
  }

  cart.forEach(item => {
    const quantity = item.quantity || 1;
    const subtotal = item.price * quantity;
    itemsTotal += subtotal;

    checkoutItems.innerHTML += `
      <div class="checkout-card">
        <img src="${item.image}" alt="${item.name}" class="checkout-image" />

        <div class="checkout-details">
          <h3>${item.name}</h3>
          <p>Price: Rs. ${item.price}</p>
          <p>Quantity: ${quantity}</p>
          <p>Subtotal: Rs. ${subtotal}</p>
        </div>
      </div>
    `;
  });

  checkoutItems.innerHTML += `
    <div class="checkout-card">
      <div class="checkout-details">
        <p><strong>Selected Shipping Area:</strong> ${getShippingAreaLabel(shippingArea)}</p>
        <p><strong>Shipping Fee:</strong> Rs. ${shippingCost}</p>
      </div>
    </div>
  `;

  const finalTotal = itemsTotal + shippingCost;
  checkoutTotal.innerText = "Total: Rs. " + finalTotal;
}

function sendOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;

  if (!name || !phone || !address || !payment) {
    alert("Please fill all fields");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let itemsTotal = 0;
  let message = "New Order%0A%0A";

  message += `Name: ${name}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Address: ${address}%0A`;
  message += `Payment Method: ${payment}%0A`;
  message += `Shipping Area: ${getShippingAreaLabel(shippingArea)}%0A`;
  message += `Shipping Fee: Rs. ${shippingCost}%0A%0A`;

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const subtotal = item.price * quantity;
    itemsTotal += subtotal;

    message += `${index + 1}. ${item.name} x ${quantity} - Rs. ${subtotal}%0A`;
  });

  const finalTotal = itemsTotal + shippingCost;

  message += `%0AItems Total: Rs. ${itemsTotal}`;
  message += `%0AFinal Total: Rs. ${finalTotal}`;

  const phoneNumber = "94762794698";
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
}
