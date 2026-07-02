// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
const isAlwaysSolid = navbar ? navbar.classList.contains('scrolled') : false;

window.addEventListener('scroll', () => {
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        if (!isAlwaysSolid) {
            navbar.classList.remove('scrolled');
        }
    }
});

// Scroll Reveal Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

// Observe all elements with fade-up class
document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
});

// Real Cart Functionality (LocalStorage)
let cart = JSON.parse(localStorage.getItem('mahrukh_cart')) || [];
const cartCountElements = document.querySelectorAll('.cart-count');
const cartItemsContainer = document.querySelector('.cart-items');
const cartSubtotalElement = document.querySelector('.cart-subtotal span:last-child');
const cartHeaderTitle = document.querySelector('.cart-header h3');

function saveCart() {
    localStorage.setItem('mahrukh_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    // Update Counts
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);
    if (cartHeaderTitle) {
        cartHeaderTitle.textContent = `Your Cart (${totalItems})`;
    }

    // Render Items
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--clr-text-light);">Your cart is empty.</p>';
        if (cartSubtotalElement) cartSubtotalElement.textContent = 'Rs. 0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-meta">Qty: ${item.quantity}</p>
                <p class="cart-item-price">Rs. ${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
        </div>
    `).join('');

    // Update Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotalElement) cartSubtotalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

window.removeFromCart = removeFromCart; // Expose to global scope for inline onclick

// Initialize UI
updateCartUI();

// Mock Newsletter Submit
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const btn = newsletterForm.querySelector('button');
        
        if (input.value) {
            const originalText = btn.textContent;
            btn.textContent = 'Thanks!';
            input.value = '';
            
            setTimeout(() => {
                btn.textContent = originalText;
            }, 3000);
        }
    });
}

// Cart Drawer Logic
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const navCartBtns = document.querySelectorAll('.cart-btn');

function openCart() {
    if (cartOverlay && cartDrawer) {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeCart() {
    if (cartOverlay && cartDrawer) {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

navCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
});

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

// Add to Cart Handlers
const addCartBtns = document.querySelectorAll('.add-to-cart-btn, .lux-add-cart');

addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Extract product details
        let title = "Premium Item";
        let price = 0;
        let image = "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1000&auto=format&fit=crop";
        let quantity = 1;

        const luxuryCard = btn.closest('.luxury-card');
        if (luxuryCard) {
            title = luxuryCard.querySelector('.lux-title')?.textContent || title;
            const priceText = luxuryCard.querySelector('.lux-price')?.textContent || "0";
            price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            image = luxuryCard.querySelector('.lux-img-main')?.src || image;
        } else {
            // Probably Product Detail Page
            title = document.querySelector('.pdp-title')?.textContent || title;
            const priceText = document.querySelector('.pdp-price')?.textContent || "0";
            price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            image = document.querySelector('.thumbnail.active')?.src || document.querySelector('.pdp-main-img')?.src || image;
            const qtyInput = document.querySelector('.qty-input');
            if (qtyInput) quantity = parseInt(qtyInput.value) || 1;
        }

        // Add to cart array
        const existingItem = cart.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ title, price, image, quantity });
        }
        
        saveCart();

        // Button Animation
        const originalText = btn.textContent;
        btn.textContent = 'Added';
        btn.style.backgroundColor = 'var(--clr-success)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            openCart();
        }, 1000);
    });
});

// Initialize Swiper for Hero Section
if (typeof Swiper !== 'undefined' && document.querySelector('.hero-slider')) {
    const heroSwiper = new Swiper('.hero-slider', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination-custom',
            type: 'fraction',
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span>' +
                       ' / ' +
                       '<span class="' + totalClass + '"></span>';
            }
        },
        navigation: {
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        },
        parallax: true,
        grabCursor: true,
    });
}

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const mobileOverlay = document.querySelector('.mobile-overlay');

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    if (mobileOverlay) mobileOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    
    if (navLinks.classList.contains('active')) {
        mobileMenuToggle.innerHTML = '<i data-lucide="x"></i>';
        mobileMenuToggle.style.color = 'var(--clr-text)';
    } else {
        mobileMenuToggle.innerHTML = '<i data-lucide="menu"></i>';
        mobileMenuToggle.style.color = '';
    }
    lucide.createIcons();
}

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileMenu);
}
