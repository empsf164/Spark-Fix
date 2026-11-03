/**
 * SPARK FIX — Premium Electrical Services
 * Main Interactive Script
 * Brand Tagline: "Powering Your Spaces. Protecting What Matters."
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Navbar Sticky & Scroll Elevation
  const navbar = document.querySelector('.spark-navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Active Page Highlighting & Mobile Nav Collapse on Click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.querySelector('.navbar-collapse');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkFile = href.split('#')[0].split('/').pop();
      if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      }
    }

    // Auto-close mobile navbar on link click
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  // 3. Password Toggle Visibility (Login & Sign Up)
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      const passwordInput = document.getElementById(targetId);
      const icon = this.querySelector('i');

      if (passwordInput) {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
          }
          this.setAttribute('aria-label', 'Hide password');
        } else {
          passwordInput.type = 'password';
          if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
          }
          this.setAttribute('aria-label', 'Show password');
        }
      }
    });
  });

  // 4. Password Strength Meter (Sign Up)
  const signupPassword = document.getElementById('signupPassword');
  const passwordMeterFill = document.querySelector('.password-meter-fill');
  const passwordHint = document.getElementById('passwordStrengthHint');

  if (signupPassword && passwordMeterFill) {
    signupPassword.addEventListener('input', function () {
      const val = this.value;
      let score = 0;
      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      if (val.length === 0) {
        passwordMeterFill.style.width = '0%';
        passwordMeterFill.style.backgroundColor = 'var(--color-border)';
        if (passwordHint) passwordHint.textContent = 'Minimum 8 characters with letters, numbers & symbols.';
      } else if (score <= 1) {
        passwordMeterFill.style.width = '25%';
        passwordMeterFill.style.backgroundColor = 'var(--color-danger)';
        if (passwordHint) passwordHint.textContent = 'Weak password';
      } else if (score === 2) {
        passwordMeterFill.style.width = '50%';
        passwordMeterFill.style.backgroundColor = 'var(--color-warning)';
        if (passwordHint) passwordHint.textContent = 'Moderate password strength';
      } else if (score === 3) {
        passwordMeterFill.style.width = '75%';
        passwordMeterFill.style.backgroundColor = 'var(--color-electric)';
        if (passwordHint) passwordHint.textContent = 'Strong password';
      } else {
        passwordMeterFill.style.width = '100%';
        passwordMeterFill.style.backgroundColor = 'var(--color-success)';
        if (passwordHint) passwordHint.textContent = 'Optimal security standards met';
      }
    });
  }

  // 5. Service Type Toggle Buttons in Booking Form
  const typeToggleBtns = document.querySelectorAll('.type-toggle-btn');
  const hiddenServiceType = document.getElementById('selectedPropertyType');

  typeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      typeToggleBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const selectedType = this.getAttribute('data-type');
      if (hiddenServiceType) {
        hiddenServiceType.value = selectedType;
      }
    });
  });

  // 6. Image Upload Drag & Drop Preview
  const dropzone = document.getElementById('fileUploadDropzone');
  const fileInput = document.getElementById('bookingImageUpload');
  const previewContainer = document.getElementById('filePreviewContainer');
  const previewName = document.getElementById('previewFileName');
  const previewSize = document.getElementById('previewFileSize');
  const previewThumbnail = document.getElementById('previewThumbnail');
  const removeFileBtn = document.getElementById('removeUploadedFileBtn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect(fileInput.files[0]);
      }
    });

    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        handleFileSelect(this.files[0]);
      }
    });

    function handleFileSelect(file) {
      if (!file.type.match('image.*')) {
        alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Reference photo size must not exceed 5MB.');
        return;
      }

      if (previewName) previewName.textContent = file.name;
      if (previewSize) previewSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

      const reader = new FileReader();
      reader.onload = function (e) {
        if (previewThumbnail) previewThumbnail.src = e.target.result;
        if (previewContainer) previewContainer.classList.remove('d-none');
        dropzone.classList.add('d-none');
      };
      reader.readAsDataURL(file);
    }

    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        fileInput.value = '';
        if (previewThumbnail) previewThumbnail.src = '';
        if (previewContainer) previewContainer.classList.add('d-none');
        dropzone.classList.remove('d-none');
      });
    }
  }

  // 7. Booking Form Validation & Submission
  const bookingForm = document.getElementById('electricalBookingForm');
  if (bookingForm) {
    // Populate preferred date minimum to today
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const requiredInputs = bookingForm.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        if (!input.checkValidity() || input.value.trim() === '') {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      });

      // Email validation
      const emailInput = document.getElementById('clientEmail');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.classList.add('is-invalid');
          isValid = false;
        }
      }

      // Phone validation (at least 7 digits)
      const phoneInput = document.getElementById('clientPhone');
      if (phoneInput && phoneInput.value) {
        const cleaned = phoneInput.value.replace(/[^0-9+]/g, '');
        if (cleaned.length < 7) {
          phoneInput.classList.add('is-invalid');
          isValid = false;
        }
      }

      if (!isValid) {
        const firstError = bookingForm.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Generate randomized enquiry reference
      const refNumber = 'SF-' + Math.floor(100000 + Math.random() * 900000);
      const refDisplay = document.getElementById('modalEnquiryRef');
      if (refDisplay) refDisplay.textContent = '#' + refNumber;

      const clientName = document.getElementById('clientFullName')?.value || 'Valued Customer';
      const clientNameDisplay = document.getElementById('modalClientName');
      if (clientNameDisplay) clientNameDisplay.textContent = clientName;

      // Show confirmation modal
      const confirmationModal = new bootstrap.Modal(document.getElementById('bookingConfirmationModal'));
      confirmationModal.show();

      // Reset form
      bookingForm.reset();
      bookingForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      if (previewContainer) previewContainer.classList.add('d-none');
      if (dropzone) dropzone.classList.remove('d-none');
    });
  }

  // 8. Login Form Validation & Simulation
  const loginForm = document.getElementById('sparkLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const email = document.getElementById('loginEmail');
      const pass = document.getElementById('loginPassword');

      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (valid) {
        const btn = loginForm.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Authenticating...';

        setTimeout(() => {
          btn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Verified';
          btn.classList.remove('btn-electric');
          btn.classList.add('btn-success');
          
          const alertBox = document.getElementById('loginFeedbackAlert');
          if (alertBox) {
            alertBox.className = 'alert alert-success mt-3';
            alertBox.innerHTML = '<strong>Authentication Verified:</strong> Customer portal session established. (Demo interface: no customer dashboard configured per specifications).';
            alertBox.classList.remove('d-none');
          }
          
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = origText;
            btn.classList.add('btn-electric');
            btn.classList.remove('btn-success');
          }, 4000);
        }, 1200);
      }
    });
  }

  // 9. Sign Up Form Validation & Simulation
  const signupForm = document.getElementById('sparkSignupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('signupName');
      const email = document.getElementById('signupEmail');
      const phone = document.getElementById('signupPhone');
      const pass = document.getElementById('signupPassword');
      const confirmPass = document.getElementById('signupConfirmPassword');
      const terms = document.getElementById('signupTerms');

      [name, email, phone, pass, confirmPass].forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          valid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (pass.value && confirmPass.value && pass.value !== confirmPass.value) {
        confirmPass.classList.add('is-invalid');
        valid = false;
      }

      if (terms && !terms.checked) {
        terms.classList.add('is-invalid');
        valid = false;
      } else if (terms) {
        terms.classList.remove('is-invalid');
      }

      if (valid) {
        const btn = signupForm.querySelector('button[type="submit"]');
        const origText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating Account...';

        setTimeout(() => {
          const alertBox = document.getElementById('signupFeedbackAlert');
          if (alertBox) {
            alertBox.className = 'alert alert-success mt-3';
            alertBox.innerHTML = '<strong>Account Registered:</strong> Your account request has been logged. You may now proceed to sign in.';
            alertBox.classList.remove('d-none');
          }
          signupForm.reset();
          if (passwordMeterFill) passwordMeterFill.style.width = '0%';
          btn.disabled = false;
          btn.innerHTML = origText;
        }, 1300);
      }
    });
  }

  // 10. Service Areas Interactive Search / Filter
  const areaSearchInput = document.getElementById('areaSearchInput');
  const areaCards = document.querySelectorAll('.service-area-item');
  const areaFilterBtns = document.querySelectorAll('.area-filter-btn');

  if (areaCards.length > 0) {
    function filterAreas() {
      const query = (areaSearchInput ? areaSearchInput.value.toLowerCase().trim() : '');
      const activeFilter = document.querySelector('.area-filter-btn.active')?.getAttribute('data-filter') || 'all';

      areaCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const category = card.getAttribute('data-category') || '';

        const matchesQuery = !query || text.includes(query);
        const matchesCategory = activeFilter === 'all' || category.includes(activeFilter);

        if (matchesQuery && matchesCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (areaSearchInput) {
      areaSearchInput.addEventListener('input', filterAreas);
    }

    areaFilterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        areaFilterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterAreas();
      });
    });
  }

  // 11. Pre-fill Service from Query String (e.g. from index.html or services.html to booking form)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const typeParam = urlParams.get('type');

  if (serviceParam) {
    const serviceSelect = document.getElementById('serviceTypeSelect');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (typeParam) {
    const matchingToggle = document.querySelector(`.type-toggle-btn[data-type="${typeParam}"]`);
    if (matchingToggle) {
      matchingToggle.click();
    }
  }

});

