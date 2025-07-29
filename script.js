// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');

// Tab Navigation Function
function switchTab(tabName) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to clicked nav link
    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
}

// Form Validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Clear previous error messages
    clearFormErrors();
    
    // Validate name
    if (name === '') {
        showFieldError('name', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate phone
    if (phone === '') {
        showFieldError('phone', 'Phone number is required');
        isValid = false;
    } else         if (!isValidPhone(phone)) {
            showFieldError('phone', 'Please enter a valid 10-digit phone number');
            isValid = false;
        }
    
    // Validate message
    if (message === '') {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

// Phone number validation and formatting
function formatPhoneNumber(value) {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // If we have digits, format them
    if (phoneNumber.length > 0) {
        // Limit to 10 digits
        const limitedNumber = phoneNumber.substring(0, 10);
        
        // Format as +1 (XXX) XXX-XXXX
        if (limitedNumber.length >= 6) {
            return `+1 (${limitedNumber.substring(0, 3)}) ${limitedNumber.substring(3, 6)}-${limitedNumber.substring(6)}`;
        } else if (limitedNumber.length >= 3) {
            return `+1 (${limitedNumber.substring(0, 3)}) ${limitedNumber.substring(3)}`;
        } else {
            return `+1 (${limitedNumber}`;
        }
    }
    
    return '';
}

function isValidPhone(phone) {
    // Remove all non-digits and check if exactly 10 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

// Clear form errors
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
    
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea');
    formFields.forEach(field => {
        field.style.borderColor = '#e9ecef';
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString()
        };
        
        // Send via EmailJS (primary method)
        sendViaEmailJS(formData);
        
        // Store in localStorage (for backup)
        saveToLocalStorage(formData);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        contactForm.reset();
        clearFormErrors();
    }
}

// Send form data via email
function sendViaEmail(formData) {
    const subject = 'New Contact Form Submission - DP Global';
    const body = `
Name: ${formData.name}
Phone: ${formData.phone}
Message: ${formData.message}
Date: ${new Date().toLocaleString()}
    `.trim();
    
    // Try to send to your email
    const mailtoLink = `mailto:divypatel442000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    // Also log to console for debugging
    console.log('Form data:', formData);
    console.log('Email link:', mailtoLink);
}

// Save form data to localStorage (for demo/backup)
function saveToLocalStorage(formData) {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push(formData);
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Send via EmailJS
function sendViaEmailJS(formData) {
    // EmailJS configuration
    const serviceID = 'service_3a0omcp';
    const templateID = 'template_ohi5kx7';
    const publicKey = '4bFUa58sZGRWASJAu';
    
    // Initialize EmailJS
    emailjs.init(publicKey);
    
    // Prepare template parameters
    const templateParams = {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        date: new Date().toLocaleString()
    };
    
    // Send email via EmailJS
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('SUCCESS! Email sent via EmailJS', response);
        })
        .catch(function(error) {
            console.log('FAILED... EmailJS error:', error);
            // Show error message to user
            alert('Failed to send message. Please try again later.');
        });
}

// Show professional success message
function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting DP Global. We will get back to you within 24 hours.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    successDiv.querySelector('.success-content').style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    successDiv.querySelector('i').style.cssText = `
        font-size: 3rem;
        color: #27ae60;
        margin-bottom: 1rem;
    `;
    
    successDiv.querySelector('h3').style.cssText = `
        color: #2c3e50;
        margin-bottom: 1rem;
    `;
    
    successDiv.querySelector('p').style.cssText = `
        color: #555;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    `;
    
    successDiv.querySelector('button').style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(successDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

// Smooth scroll to section
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Initialize the application
function init() {
    // Set up event listeners for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = link.getAttribute('data-tab');
            switchTab(tabName);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Smooth scroll to section
            smoothScrollToSection(tabName);
        });
    });
    
    // Set up hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Set up form submission (only if custom form exists)
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Set up phone number validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            // Allow only numeric input and navigation keys
            phoneInput.addEventListener('keydown', (e) => {
                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                const isNumeric = /[0-9]/.test(e.key);
                const isAllowed = allowedKeys.includes(e.key) || isNumeric;
                
                if (!isAllowed) {
                    e.preventDefault();
                }
            });
        }
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 150, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 150, 255, 0.1)';
        }
    });
    
    // Add loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Add some interactive features
function addInteractiveFeatures() {
    // Add hover effects to service cards with glow effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(0, 150, 255, 0.3)';
            card.style.borderColor = 'rgba(0, 150, 255, 0.8)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 10px 30px rgba(0, 150, 255, 0.1)';
            card.style.borderColor = 'rgba(0, 150, 255, 0.2)';
        });
    });
    
    // Add glow effect to icons
    const icons = document.querySelectorAll('.service-list i, .feature-item i');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.textShadow = '0 0 20px rgba(0, 150, 255, 0.8)';
            icon.style.transform = 'scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.textShadow = '0 0 10px rgba(0, 150, 255, 0.5)';
            icon.style.transform = 'scale(1)';
        });
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Add scroll animations with staggered effect
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200); // Staggered animation
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .contact-info, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
    
    // Add pulse animation to submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', () => {
            submitBtn.style.animation = 'pulse 1s infinite';
        });
        
        submitBtn.addEventListener('mouseleave', () => {
            submitBtn.style.animation = 'none';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    addInteractiveFeatures();
    setupFormAutoDate();
    
    // Set initial body opacity for loading effect
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Setup form with auto-filled date
function setupFormAutoDate() {
    const dateField = document.getElementById('date');
    if (dateField) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Set the date field value
        dateField.value = today;
        
        console.log('Form date auto-filled with:', today);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on window resize if screen becomes larger
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Tab navigation with arrow keys (optional enhancement)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeLink = document.querySelector('.nav-link.active');
        const currentIndex = Array.from(navLinks).indexOf(activeLink);
        
        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].click();
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].click();
        }
    }
}); 