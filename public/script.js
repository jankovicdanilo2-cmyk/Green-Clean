document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // If the clicked link is the dropdown toggle, let the specific handler manage it
            if (e.target.id === 'services-dropdown-toggle') return;
            
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Close dropdown if a regular link is clicked
            const dropdownMenu = document.getElementById('services-dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
            }
        });
    });

    // Mobile Dropdown Interactive Logic
    const servicesToggle = document.getElementById('services-dropdown-toggle');
    const servicesMenu = document.getElementById('services-dropdown-menu');

    if (servicesToggle && servicesMenu) {
        servicesToggle.addEventListener('click', function(e) {
            // Check if we are on mobile view
            if (window.innerWidth <= 768) {
                // If it's already open, let the click go through to follow the link
                if (servicesMenu.classList.contains('show')) {
                    // It will navigate normally because we don't preventDefault here
                    // Optional: Close the whole hamburger menu on navigation
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                } else {
                    // First click: prevent navigation and just open the submenu
                    e.preventDefault();
                    servicesMenu.classList.add('show');
                }
            }
        });
    }

    // Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fade-in Animation on Scroll using IntersectionObserver
    const faders = document.querySelectorAll('.fade-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // Form Submission and Validation
    const quoteForm = document.getElementById('quote-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset previous errors
            const formGroups = quoteForm.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('error'));
            formMessage.className = 'form-message hidden';
            formMessage.textContent = '';

            // Basic Frontend Validation
            let isValid = true;
            const requiredFields = ['name', 'phone', 'email', 'service', 'property_type'];
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.closest('.form-group').classList.add('error');
                    isValid = false;
                }
            });

            // Email format validation
            const emailField = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value && !emailRegex.test(emailField.value)) {
                emailField.closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (!isValid) return;

            // Prepare data for submission
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                service: document.getElementById('service').value,
                property_type: document.getElementById('property_type').value,
                message: document.getElementById('message').value.trim()
            };

            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            spinner.classList.remove('hidden');

            try {
                // Send POST request to backend
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Show success message
                    formMessage.textContent = result.success || 'Your quote request has been sent successfully!';
                    formMessage.className = 'form-message success';
                    quoteForm.reset();
                } else {
                    // Show error message from server
                    formMessage.textContent = result.error || 'There was an error sending your request. Please try again later.';
                    formMessage.className = 'form-message error';
                }
            } catch (error) {
                console.error('Submission error:', error);
                formMessage.textContent = 'Network error. Please check your connection and try again.';
                formMessage.className = 'form-message error';
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                btnText.textContent = 'Request My Free Quote';
                spinner.classList.add('hidden');
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Gallery Show More Toggle
    const showMoreBtn = document.getElementById('show-more-gallery');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (showMoreBtn && galleryGrid) {
        showMoreBtn.addEventListener('click', () => {
            galleryGrid.classList.toggle('show-all');
            
            if (galleryGrid.classList.contains('show-all')) {
                showMoreBtn.textContent = 'Show Less';
            } else {
                showMoreBtn.textContent = 'Show More';
                // Optional: Scroll back up to the top of the gallery
                document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Modal functionality for Gallery
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("modalCaption");
    const closeBtn = document.querySelector(".close-modal");

    if (modal && modalImg && captionText) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const label = this.querySelector('.gallery-label').innerText;
                
                if (img) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                    captionText.innerHTML = label;
                    // Prevent scrolling on body when modal is open
                    document.body.style.overflow = "hidden";
                }
            });
        });

        // Close modal when clicking the X
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            });
        }

        // Close modal when clicking outside the image
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
        
        // Close modal on Escape key press
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape" && modal.style.display === "block") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});
