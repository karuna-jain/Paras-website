const init = () => {
  // --- Translation / Localization Engine ---
  let currentLang = localStorage.getItem('paras_lang') || 'en';

  const formFeedbackMessages = {
    en: {
      required: 'Please fill in all required fields.',
      phone: 'Please enter a valid phone number.',
      sending: 'Sending Enquiry...',
      success: 'Thank you for contacting us! We will get back to you shortly.',
    },
    hi: {
      required: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
      phone: 'कृपया एक सही फ़ोन नंबर दर्ज करें।',
      sending: 'पूछताछ भेजी जा रही है...',
      success: 'हमसे संपर्क करने के लिए धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।',
    }
  };

  function setLanguage(lang) {
    // Translate standard text nodes - using innerHTML to preserve nested HTML tags (like <span>)
    document.querySelectorAll('[data-en]').forEach(el => {
      const translation = el.getAttribute(`data-${lang}`);
      if (translation) {
        el.innerHTML = translation;
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
      const translation = el.getAttribute(`data-${lang}-placeholder`);
      if (translation) {
        el.placeholder = translation;
      }
    });

    // Sync active state and labels for toggle buttons
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      const label = btn.getAttribute(`data-${lang}`);
      if (label) {
        btn.innerHTML = label;
      }
      if (lang === 'hi') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    currentLang = lang;
    localStorage.setItem('paras_lang', lang);
  }

  // Bind Event Listeners to Toggle Buttons
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = currentLang === 'en' ? 'hi' : 'en';
      setLanguage(targetLang);
    });
  });

  // Initialize selected language on load
  setLanguage(currentLang);


  // --- Sticky Header Effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Drawer Menu Navigation ---
  const toggleBtn = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const backdrop = document.querySelector('.backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  function openMenu() {
    mobileMenu.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- Smooth Scroll Spy & Active Nav Class ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Interactive Contact Form Handling ---
  const contactForm = document.getElementById('partsContactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      // Extract form data
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const vehicle = document.getElementById('formVehicle').value;
      const message = document.getElementById('formMessage').value.trim();

      // Basic validation using current language strings
      if (!name || !phone || !message) {
        showStatus(formFeedbackMessages[currentLang].required, 'error');
        return;
      }

      // Check phone pattern
      if (!/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
        showStatus(formFeedbackMessages[currentLang].phone, 'error');
        return;
      }

      // Show loader state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<svg class="spinner" viewBox="0 0 50 50" style="width: 20px; height: 20px; animation: rotate 2s linear infinite; stroke: currentColor; fill: none; stroke-width: 5; stroke-linecap: round; display: inline-block; vertical-align: middle; margin-right: 8px;"><circle cx="25" cy="25" r="20"></circle></svg> ${formFeedbackMessages[currentLang].sending}`;

      // Simulate API post (saving locally)
      setTimeout(() => {
        const enquiry = {
          name,
          phone,
          email,
          vehicle,
          message,
          timestamp: new Date().toISOString()
        };

        // Save to localStorage for demo
        try {
          const enquiries = JSON.parse(localStorage.getItem('paras_enquiries') || '[]');
          enquiries.push(enquiry);
          localStorage.setItem('paras_enquiries', JSON.stringify(enquiries));
        } catch (e) {
          console.error("Localstorage saving failed", e);
        }

        // Complete transition
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        showStatus(formFeedbackMessages[currentLang].success, 'success');
        contactForm.reset();

      }, 1500);
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }
  }
};

// Start script execution safely
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// CSS spin animation helper injected
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    100% { transform: rotate(360deg); }
  }
  @keyframes dash {
    0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
    50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
    100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
  }
  .spinner circle {
    animation: dash 1.5s ease-in-out infinite;
  }
`;
document.head.appendChild(style);
