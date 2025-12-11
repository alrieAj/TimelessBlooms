document.addEventListener('DOMContentLoaded', function () {
  const carouselContainer = document.querySelector('.carousel-container');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');
  let currentSlide = 0;

  function updateSlidePosition() {
    const offset = -currentSlide * 100; // Move the carousel by the width of one slide
    carouselContainer.style.transform = `translateX(${offset}%)`;
  }

  function moveToNextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidePosition();
  }

  function moveToPrevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  // Auto-slide every 3 seconds
  setInterval(moveToNextSlide, 2000);

  // Manual contro
  if (prevButton && nextButton) {
    prevButton.addEventListener('click', moveToPrevSlide);
    nextButton.addEventListener('click', moveToNextSlide);
  }

  // Init
  updateSlidePosition();
});


document.addEventListener('DOMContentLoaded', function() {
  const flowerCards = document.querySelectorAll('.flower-card');

  // Intersection Observer callback
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the animation classes when the element is in the viewport
        entry.target.classList.add('in-view');
      } else {
        // Reset the animation when the element leaves the viewport (if needed)
        entry.target.classList.remove('in-view');
      }
    });
  };

  // Create an IntersectionObserver instance
  const observer = new IntersectionObserver(observerCallback, {
    root: null, // Use the viewport as the root
    threshold: 0.5 // Trigger when 50% of the element is visible
  });

  // Observe each flower card
  flowerCards.forEach(card => observer.observe(card));
});


document.addEventListener('DOMContentLoaded', function () {
  // Lightbox functionality
  const images = document.querySelectorAll('.card img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.close-btn') : null;

  if (lightbox && lightboxImg && closeBtn) {
    images.forEach(img => {
      img.addEventListener('click', function () {
        lightboxImg.src = this.src;
        lightbox.style.display = 'flex';
      });
    });

    closeBtn.addEventListener('click', function () {
      lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
      }
    });
  }

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartCount = document.getElementById('cart-count');

  if (cartCount) {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function () {
        const productCard = this.closest('.card');
        const img = productCard.querySelector('img');
        const flowerName = productCard.querySelector('h3').textContent;
        const price = parseFloat(
          productCard.querySelector('p').textContent.replace('₱', '').replace(/,/g, '').trim()
        );

        if (img && flowerName && price) {
          const confirmBox = document.createElement('div');
          confirmBox.classList.add('confirm-box');
          confirmBox.innerHTML = `
            <div class="confirm-content">
              <img src="${img.src}" alt="${flowerName}">
              <p>Do you want to add <strong>${flowerName}</strong> to the cart?</p>
              <div class="confirm-buttons">
                <button class="confirm-yes">Yes</button>
                <button class="confirm-no">No</button>
              </div>
            </div>
          `;
          document.body.appendChild(confirmBox);

          confirmBox.querySelector('.confirm-no').onclick = () => {
            document.body.removeChild(confirmBox);
          };

          confirmBox.querySelector('.confirm-yes').onclick = () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart.push({
              imgSrc: img.src,
              name: flowerName,
              price: price
            });

            localStorage.setItem('cart', JSON.stringify(cart));

            let count = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = count + 1;

            document.body.removeChild(confirmBox);
          };
        }
      });
    });
  }

  const cartItemsContainer = document.getElementById('cart-items');
  const totalAmountElement = document.getElementById('total-amount');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  
  if (cartItemsContainer && totalAmountElement) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const renderCart = () => {
      cartItemsContainer.innerHTML = '';
      let totalAmount = 0;
  
      if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        cartItemsContainer.style.display = 'none';
        totalAmountElement.textContent = '0.00';
        return;
      }
  
      cartItemsContainer.style.display = 'block';
      if (emptyCartMessage) emptyCartMessage.style.display = 'none';
  
      cart.forEach((item, index) => {
        const pricePerPiece = parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        const itemTotal = pricePerPiece * quantity;
        totalAmount += itemTotal;
  
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
          <img src="${item.imgSrc}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₱${pricePerPiece.toFixed(2)} x 
              <button class="qty-btn decrease" data-index="${index}">-</button>
              <span class="quantity">${quantity}</span>
              <button class="qty-btn increase" data-index="${index}">+</button>
              = ₱${itemTotal.toFixed(2)}
            </div>
            <button class="remove-item remove-btn" data-index="${index}">🌸 Remove</button>
          </div>
        `;
  
        cartItemsContainer.appendChild(cartItem);
      });
  
      totalAmountElement.textContent = `${totalAmount.toFixed(2)}`;
  
      // Remove item
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
        });
      });
  
      // Increase quantity
      document.querySelectorAll('.qty-btn.increase').forEach(button => {
        button.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          cart[index].quantity = (cart[index].quantity || 1) + 1;
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
        });
      });
  
      // Decrease quantity
      document.querySelectorAll('.qty-btn.decrease').forEach(button => {
        button.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          if ((cart[index].quantity || 1) > 1) {
            cart[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
          }
        });
      });
    };
  
    renderCart();
  }
  

  // Checkout button
  const checkoutButton = document.getElementById('checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
      window.location.href = 'checkout.html';
    });
  }
});
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('shipping-form');
  const cartItems = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');

 // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1000';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create lightbox message
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox-message';
  lightbox.textContent = 'Place order successfully! ✅';
  lightbox.style.backgroundColor = '#fff';
  lightbox.style.padding = '20px 40px';
  lightbox.style.borderRadius = '10px';
  lightbox.style.boxShadow = '0 0 20px rgb(243, 108, 227)';
  lightbox.style.fontSize = '18px';
  lightbox.style.textAlign = 'center';

  overlay.appendChild(lightbox);
  document.body.appendChild(overlay);

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show lightbox
    overlay.style.display = 'flex';

    // Clear cart
    // Clear cart
    localStorage.removeItem('cart');

    // Redirect after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 2000);
  });

  // Display cart items
  const cart = JSON.parse(localStorage.getItem('flowerCart')) || [];

  if (cart.length > 0) {
    let total = 0;
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const div = document.createElement('div');
      div.textContent = `${item.name} - ₱${item.price.toFixed(2)}`;
      cartItems.appendChild(div);
      total += item.price;
    });
    totalAmount.textContent = total.toFixed(2);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".clickable-img");
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".modal .close");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.getAttribute("data-full");
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

/*filter function*/
function filterByPrice() {
  var priceFilter = document.getElementById("priceFilter").value;
  var cards = document.querySelectorAll(".card");
  cards.forEach(function(card) {
    var price = parseFloat(card.querySelector("p").textContent.replace('₱', '').replace(',', ''));
    if (priceFilter === "cheap" && price > 1000) {
      card.style.display = "none";
    } else if (priceFilter === "expensive" && price <= 1000) {
      card.style.display = "none";
    } else {
      card.style.display = "block";
    }
  });
}

function searchProduct() {
  var searchQuery = document.getElementById("searchBar").value.toLowerCase();
  var cards = document.querySelectorAll(".card");
  cards.forEach(function(card) {
    var productName = card.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(searchQuery)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
