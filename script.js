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

// Mock Cart Functionality
const cartBtns = document.querySelectorAll('.add-to-cart-btn');
const cartCountElement = document.querySelector('.cart-count');
let cartCount = 0;

cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        // Simple animation feedback
        btn.textContent = 'Added';
        btn.style.backgroundColor = 'var(--clr-success)';
        
        setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.style.backgroundColor = '';
        }, 2000);
    });
});

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

// Update Mock Cart Functionality to open cart
cartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setTimeout(() => {
            openCart();
        }, 500); // Open cart after a short delay
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
    
    const icon = mobileMenuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
    } else {
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileMenu);
}
