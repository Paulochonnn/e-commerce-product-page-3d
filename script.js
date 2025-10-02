// State
let quantity = 0;
let cart = [];

// Elements
const quantityDisplay = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decreaseQty');
const increaseBtn = document.getElementById('increaseQty');
const addToCartBtn = document.getElementById('addToCart');
const cartIcon = document.getElementById('cartIcon');
const cartDropdown = document.getElementById('cartDropdown');
const cartContent = document.getElementById('cartContent');
const cartCount = document.getElementById('cartCount');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

// Product data
const product = {
  name: 'Fall Limited Edition Sneakers',
  price: 125.00,
  image: './images/sneakers.png'
};

// Quantity controls
decreaseBtn.addEventListener('click', () => {
  if (quantity > 0) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});

increaseBtn.addEventListener('click', () => {
  quantity++;
  quantityDisplay.textContent = quantity;
});

// Add to cart
addToCartBtn.addEventListener('click', () => {
  if (quantity > 0) {
    const existingItemIndex = cart.findIndex(item => item.name === product.name);
    if (existingItemIndex >= 0) {
      // Si le produit est déjà dans le panier, on augmente la quantité
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Sinon on l'ajoute
      cart.push({ ...product, quantity });
    }

    // Réinitialiser la quantité sélectionnée
    quantity = 0;
    quantityDisplay.textContent = quantity;

    // Mettre à jour le panier visuellement
    updateCart();
  }
});

// Toggle cart dropdown
cartIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  cartDropdown.classList.toggle('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
    cartDropdown.classList.remove('active');
  }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// Update cart display
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.add('active');
  } else {
    cartCount.classList.remove('active');
  }

  if (cart.length === 0) {
    cartContent.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
  } else {
    const item = cart[0];
    const total = (item.price * item.quantity).toFixed(2);
    
cartContent.innerHTML = `
  <div>
    <div class="cart-item">
      <div class="cart-item-image" style="background-image: url('${item.image}');"></div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">
          <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
          <span class="cart-item-total">$${total}</span>
        </div>
      </div>
      <button class="cart-item-delete" onclick="removeFromCart()">
        <svg width="14" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 2.625V1.75C0 1.334.334 1 .75 1h3.5l.294-.584A.741.741 0 0 1 5.213 0h3.571a.75.75 0 0 1 .672.416L9.75 1h3.5c.416 0 .75.334.75.75v.875a.376.376 0 0 1-.375.375H.375A.376.376 0 0 1 0 2.625Zm13 1.75V14.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 1 14.5V4.375C1 4.169 1.169 4 1.375 4h11.25c.206 0 .375.169.375.375ZM4.5 6.5c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Zm3 0c0-.275-.225-.5-.5-.5s-.5.225-.5.5v7c0 .275.225.5.5.5s.5-.225.5-.5v-7Z" fill="#C3CAD9"/>
        </svg>
      </button>
    </div>
    <button class="checkout-btn">Checkout</button>
  </div>
`;

    
  }
}

// Remove from cart
function removeFromCart() {
  cart = [];
  updateCart();
}

// Initial cart state
updateCart();