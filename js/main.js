const nav = document.querySelector('.site-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = document.querySelectorAll('main section[id]');
const mobileToggle = document.querySelector('.nav-toggle');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const mobileClose = document.querySelector('.mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link');
const body = document.body;
const hero = document.querySelector('.hero-section');
const revealElements = document.querySelectorAll('.reveal');
const statsSection = document.querySelector('.stats-section');
const counterElements = document.querySelectorAll('[data-target]');
const volunteerForm = document.querySelector('#volunteer-form');
const contactForm = document.querySelector('#contact-form');
const tierButtons = document.querySelectorAll('.tier-button');
const donateBtn = document.querySelector('#donate-btn');
const paymentModal = document.querySelector('#payment-modal');
const paymentClose = document.querySelector('#payment-close');
const paymentOverlay = document.querySelector('#payment-overlay');
const amountCards = document.querySelectorAll('.amount-card');
const customAmountInput = document.querySelector('#custom-amount');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentForm = document.querySelector('#payment-form');
const paymentSubmit = document.querySelector('#payment-submit');

let ticking = false;
let selectedAmount = 0;
let selectedMethod = null;

// ============================================
// PAYMENT MODAL FUNCTIONS
// ============================================

function openPaymentModal() {
  paymentModal.classList.add('active');
  body.style.overflow = 'hidden';
  paymentForm.reset();
  selectedAmount = 0;
  selectedMethod = null;
  updatePaymentSummary();
  amountCards.forEach(card => card.classList.remove('active'));
  paymentMethods.forEach(method => method.classList.remove('active'));
}

function closePaymentModal() {
  paymentModal.classList.remove('active');
  body.style.overflow = '';
}

// Amount Selection
amountCards.forEach(card => {
  card.addEventListener('click', () => {
    amountCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    selectedAmount = parseInt(card.dataset.amount);
    customAmountInput.value = '';
    updatePaymentSummary();
  });
});

// Custom Amount
customAmountInput.addEventListener('input', () => {
  if (customAmountInput.value) {
    const value = parseInt(customAmountInput.value);
    if (value >= 10) {
      selectedAmount = value;
      amountCards.forEach(c => c.classList.remove('active'));
      updatePaymentSummary();
    }
  }
});

// Payment Method Selection
paymentMethods.forEach(method => {
  method.addEventListener('click', () => {
    paymentMethods.forEach(m => m.classList.remove('active'));
    method.classList.add('active');
    selectedMethod = method.dataset.method;
    updatePaymentSummary();
  });
});

// Update Payment Summary
function updatePaymentSummary() {
  const summaryAmount = document.querySelector('#summary-amount');
  const summaryMethod = document.querySelector('#summary-method');
  const summaryTotal = document.querySelector('#summary-total');
  
  summaryAmount.textContent = selectedAmount ? `K${selectedAmount.toLocaleString()}` : 'K0';
  
  const methodNames = {
    mpesa: 'M-Pesa',
    airtel: 'Airtel Money',
    bank: 'Bank Transfer',
    card: 'Card Payment'
  };
  summaryMethod.textContent = selectedMethod ? methodNames[selectedMethod] : 'Select method';
  summaryTotal.textContent = selectedAmount ? `K${selectedAmount.toLocaleString()}` : 'K0';
}

// Payment Form Submission
paymentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!selectedAmount || selectedAmount < 10) {
    showToast('Please enter a valid amount (minimum K10)', 'error');
    return;
  }
  
  if (!selectedMethod) {
    showToast('Please select a payment method', 'error');
    return;
  }
  
  const formData = {
    name: document.querySelector('#donor-name').value,
    phone: document.querySelector('#donor-phone').value,
    email: document.querySelector('#donor-email').value,
    amount: selectedAmount,
    method: selectedMethod,
    timestamp: new Date().toISOString()
  };
  
  processPayment(formData);
});

// Payment Processing
function processPayment(formData) {
  paymentSubmit.disabled = true;
  const submitText = document.querySelector('#submit-text');
  submitText.textContent = 'Processing...';
  
  setTimeout(() => {
    submitText.textContent = 'Complete Donation';
    paymentSubmit.disabled = false;
    
    triggerConfetti();
    showToast('🎉 Thank you for your generous support!', 'success');
    
    setTimeout(() => {
      closePaymentModal();
      paymentForm.reset();
      selectedAmount = 0;
      selectedMethod = null;
      updatePaymentSummary();
    }, 1500);
  }, 2000);
}

// ============================================
// CONFETTI EFFECT
// ============================================

function triggerConfetti() {
  const colors = ['confetti-gold', 'confetti-orange', 'confetti-green', 'confetti-white'];
  
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = `confetti ${colors[Math.floor(Math.random() * colors.length)]}`;
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const velocity = {
      x: (Math.random() - 0.5) * 25,
      y: (Math.random() - 0.5) * 25 - 15
    };
    
    confetti.style.left = startX + 'px';
    confetti.style.top = startY + 'px';
    confetti.style.setProperty('--tx', velocity.x + 'px');
    confetti.style.setProperty('--ty', velocity.y + 'px');
    confetti.style.setProperty('--rotation', Math.random() * 360 + 'deg');
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 3000);
  }
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function handleNavScroll() {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

function handleHeroParallax() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      hero.style.backgroundPosition = `center ${window.scrollY * 0.4}px`;
      ticking = false;
    });
    ticking = true;
  }
}

function updateActiveLink() {
  const offset = nav.offsetHeight + 24;
  const scrollPosition = window.scrollY + offset;
  let currentId = 'home';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollPosition >= sectionTop) {
      currentId = section.id;
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

function openMobileMenu() {
  body.classList.add('nav-open');
  mobileToggle.setAttribute('aria-expanded', 'true');
  mobileOverlay.setAttribute('aria-hidden', 'false');
  mobileClose.focus();
}

function closeMobileMenu() {
  body.classList.remove('nav-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileOverlay.setAttribute('aria-hidden', 'true');
  mobileToggle.focus();
}

function trapMobileFocus(e) {
  if (!body.classList.contains('nav-open')) return;
  const focusable = mobileOverlay.querySelectorAll('button, a[href], input, select, textarea');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  if (e.key === 'Escape') {
    closeMobileMenu();
  }
}

function initSmoothScroll() {
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        event.preventDefault();
        const navHeight = nav.offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
        if (body.classList.contains('nav-open')) {
          closeMobileMenu();
        }
      }
    });
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 4000);
}

function validateForm(form, successMessage) {
  const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
  const valid = inputs.every((input) => input.value.trim() !== '' && (input.type !== 'email' || input.checkValidity()));
  if (valid) {
    form.reset();
    showToast(successMessage, 'success');
  } else {
    showToast('Please fill in all required fields.', 'error');
  }
}

function animateCounter(el, target, duration = 1400) {
  let start = null;
  const initial = 0;
  const suffix = el.textContent.trim().endsWith('+') ? '+' : '';
  const targetValue = Number(target);
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * targetValue);
    el.textContent = value.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${targetValue.toLocaleString()}${suffix}`;
    }
  }
  requestAnimationFrame(step);
}

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach((element) => observer.observe(element));
}

function initStatsObserver() {
  if (!statsSection) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counterElements.forEach((el) => {
          if (!el.dataset.animated) {
            animateCounter(el, el.dataset.target);
            el.dataset.animated = 'true';
          }
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(statsSection);
}

// ============================================
// EVENT LISTENERS - INITIALIZATION
// ============================================

mobileToggle.addEventListener('click', openMobileMenu);
mobileClose.addEventListener('click', closeMobileMenu);
mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', trapMobileFocus);

window.addEventListener('scroll', () => {
  handleNavScroll();
  updateActiveLink();
  handleHeroParallax();
});

window.addEventListener('load', () => {
  handleNavScroll();
  updateActiveLink();
  initRevealObserver();
  initStatsObserver();
  initSmoothScroll();
});

// Form Submissions
if (volunteerForm) {
  volunteerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateForm(volunteerForm, "Twalumba! We'll be in touch soon.");
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateForm(contactForm, 'Message sent! The campaign team will respond within 24 hours.');
  });
}

if (tierButtons.length) {
  tierButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tierButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
    });
  });
}

// Payment Modal Event Listeners
if (donateBtn) {
  donateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPaymentModal();
  });
}

if (paymentClose) {
  paymentClose.addEventListener('click', closePaymentModal);
}

if (paymentOverlay) {
  paymentOverlay.addEventListener('click', closePaymentModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
    closePaymentModal();
  }
});

// Prevent closing when clicking inside modal content
document.querySelector('.payment-container')?.addEventListener('click', (e) => {
  e.stopPropagation();
});
