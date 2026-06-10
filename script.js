const init = () => {
  // --- Enable JS-based styling ---
  document.body.classList.add('js-enabled');

  // --- Smart Part Search Elements (needed early by translation engine) ---
  const searchInput = document.getElementById('partsSearchInput');
  const searchFeedbackText = document.getElementById('searchFeedbackText');
  const searchWhatsAppBtn = document.getElementById('searchWhatsAppBtn');
  const searchFeedbackCard = document.getElementById('searchFeedbackCard');

  // --- Translation / Localization Engine ---
  let currentLang = 'en';
  try {
    currentLang = localStorage.getItem('paras_lang') || 'en';
  } catch (e) {
    console.warn('localStorage not accessible', e);
  }

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

  const searchFeedbackMessages = {
    en: {
      default: 'Looking for something specific? Type to check or ask directly.',
      typing: 'Check availability for "{query}" on WhatsApp instantly!',
      btnText: 'Ask on WhatsApp'
    },
    hi: {
      default: 'कुछ विशेष ढूंढ रहे हैं? टाइप करें या सीधे हमसे पूछें।',
      typing: 'व्हाट्सएप पर तुरंत "{query}" की उपलब्धता के बारे में पूछें!',
      btnText: 'व्हाट्सएप पर पूछें'
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
    try {
      localStorage.setItem('paras_lang', lang);
    } catch (e) {
      console.warn('localStorage not accessible', e);
    }

    // Update dynamic search feedback text if search input is being used
    updateSearchFeedback();
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

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

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
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }


  // --- Animated Stats Counter ---
  const statNumbers = document.querySelectorAll('.counter-value');
  let statsAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = target / 80; // Animation speed proportional to the target number
      
      const updateCount = () => {
        count += speed;
        if (count < target) {
          stat.innerText = Math.floor(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = target + suffix;
        }
      };
      
      updateCount();
    });
  };

  const statsSection = document.querySelector('.hero-stats-wrapper');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          animateCounters();
          statsAnimated = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    statsObserver.observe(statsSection);
  }


  // --- Smart Part Search Section ---

  function updateSearchFeedback() {
    if (!searchInput) return;
    
    const query = searchInput.value.trim();
    if (query.length > 0) {
      // Show query feedback & pre-fill WhatsApp link
      const textTemplate = searchFeedbackMessages[currentLang].typing;
      searchFeedbackText.innerHTML = textTemplate.replace('{query}', `<strong style="color: var(--primary-red); font-size: 1.1em;">${query}</strong>`);
      
      const waMsg = encodeURIComponent(`Hi Paras Auto Parts, I am looking for: ${query}. Please let me know if it is available and what the pricing is.`);
      searchWhatsAppBtn.href = `https://wa.me/919993150250?text=${waMsg}`;
      searchWhatsAppBtn.style.display = 'inline-flex';
      searchFeedbackCard.classList.add('highlighted');
      
      // Update WhatsApp button label dynamically
      searchWhatsAppBtn.querySelector('span').textContent = searchFeedbackMessages[currentLang].btnText;
    } else {
      // Default placeholder text
      searchFeedbackText.textContent = searchFeedbackMessages[currentLang].default;
      searchWhatsAppBtn.style.display = 'none';
      searchFeedbackCard.classList.remove('highlighted');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateSearchFeedback);
  }


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

  // --- Interactive Bike Parts Finder Logic ---
  const finderBrandSelect = document.getElementById('finderBrandSelect');
  const finderModelSelect = document.getElementById('finderModelSelect');
  const finderDiagramWrapper = document.getElementById('finderDiagramWrapper');
  const motorcycleSvg = document.getElementById('motorcycleSvg');
  const scooterSvg = document.getElementById('scooterSvg');

  const finderModal = document.getElementById('finderModal');
  const finderModalClose = document.getElementById('finderModalClose');
  const modalPartName = document.getElementById('modalPartName');
  const modalCompatibleVehicle = document.getElementById('modalCompatibleVehicle');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalWhatsAppEnquiryBtn = document.getElementById('modalWhatsAppEnquiryBtn');

  // Specs Database
  const partsInventoryDb = {
    "Front Tyre": {
      category: { en: "Tyres & Tubes", hi: "टायर और ट्यूब" },
      brandSpecs: {
        "Splendor": "MRF Nylogrip Moto-D (2.75-18) Front Tyre",
        "HF Deluxe": "MRF Nylogrip Plus (2.75-18) Front Tyre",
        "Activa": "CEAT Milaze (90/90-10) Tubeless Front Tyre",
        "Shine": "MRF Ezeeride (80/100-18) Tubeless Front Tyre",
        "Pulsar": "MRF Zapper-FS (80/100-17) Tubeless Front Tyre",
        "Apache": "TVS Eurogrip Remora (90/90-17) Tubeless Front Tyre",
        "Jupiter": "CEAT Zoom D (90/90-12) Tubeless Front Tyre"
      }
    },
    "Rear Tyre": {
      category: { en: "Tyres & Tubes", hi: "टायर और ट्यूब" },
      brandSpecs: {
        "Splendor": "MRF Nylogrip Zapper (3.00-18) Rear Tyre",
        "HF Deluxe": "CEAT Secura Zoom F (3.00-18) Rear Tyre",
        "Activa": "CEAT Milaze (90/90-10) Tubeless Rear Tyre",
        "Shine": "MRF Zapper (80/100-18) Tubeless Rear Tyre",
        "Pulsar": "MRF Vyde (120/80-17) Tubeless Rear Tyre",
        "Apache": "TVS Eurogrip Remora (110/80-17) Tubeless Rear Tyre",
        "Jupiter": "CEAT Zoom D (90/90-12) Tubeless Rear Tyre"
      }
    },
    "Tube": {
      category: { en: "Tyres & Tubes", hi: "टायर और ट्यूब" },
      brandSpecs: {
        "Splendor": "MRF Heavy-Duty (3.00-18) Rubber Inner Tube",
        "HF Deluxe": "CEAT Durable (3.00-18) Rubber Inner Tube",
        "Activa": "CEAT Scooter Inner Tube (90/90-10)",
        "Shine": "MRF Premium Inner Tube (80/100-18)",
        "Pulsar": "MRF Sports Inner Tube (120/80-17)",
        "Apache": "TVS Eurogrip Inner Tube (110/80-17)",
        "Jupiter": "CEAT Scooter Inner Tube (90/90-12)"
      }
    },
    "Chain Sprocket": {
      category: { en: "Chain Sprocket Kits", hi: "चैन स्प्रोकेट किट" },
      brandSpecs: {
        "Splendor": "Rolon Genuine Steel Chain Sprocket Kit (44T-14T)",
        "HF Deluxe": "Rolon Genuine Chain & Sprocket Kit (42T-14T)",
        "Activa": "Honda Genuine CVT Drive Belt (Friction Belt)",
        "Shine": "Rolon Hardened Chain Sprocket Assembly",
        "Pulsar": "Bajaj Genuine Sports Chain Sprocket Kit",
        "Apache": "TVS Genuine High-Tensile Chain Kit",
        "Jupiter": "TVS Genuine CVT Drive Belt (Variator Belt)"
      }
    },
    "Clutch": {
      category: { en: "Clutch Components", hi: "क्लच पार्ट्स" },
      brandSpecs: {
        "Splendor": "Hero Genuine Clutch & Friction Plate Kit",
        "HF Deluxe": "Hero Genuine Clutch Assembly Kit",
        "Activa": "Honda Genuine Centrifugal Clutch Shoe Assembly",
        "Shine": "Honda Genuine Heavy-Duty Clutch Plate Set",
        "Pulsar": "Bajaj Genuine Multi-Plate Clutch Assembly",
        "Apache": "TVS Apache Genuine Clutch Plate Set",
        "Jupiter": "TVS Jupiter Genuine CVT Clutch Shoe"
      }
    },
    "Brake Shoe": {
      category: { en: "Brake Components", hi: "ब्रेक सिस्टम" },
      brandSpecs: {
        "Splendor": "Hero Genuine Rear Brake Shoe (130mm)",
        "HF Deluxe": "Hero Genuine Rear Brake Shoe (130mm)",
        "Activa": "Honda Genuine Rear Drum Brake Shoe",
        "Shine": "Honda Genuine Rear Brake Shoe (130mm)",
        "Pulsar": "Bajaj Genuine Rear Brake Shoe Assembly",
        "Apache": "TVS Genuine Rear Brake Shoe (130mm)",
        "Jupiter": "TVS Genuine Rear Drum Brake Shoe"
      }
    },
    "Brake Pads": {
      category: { en: "Brake Components", hi: "ब्रेक सिस्टम" },
      brandSpecs: {
        "Splendor": "ASK Premium Front Drum Brake Shoe Set",
        "HF Deluxe": "ASK Premium Front Drum Brake Shoe Set",
        "Activa": "KBX Front Disc Brake Pads / Drum Brake Shoe",
        "Shine": "Honda Genuine Front Disc Brake Pads",
        "Pulsar": "Bajaj Genuine KBX Front Disc Brake Pads",
        "Apache": "TVS Apache RTR Front Disc Brake Pads",
        "Jupiter": "TVS Jupiter Disc Edition Front Brake Pads"
      }
    },
    "Headlight": {
      category: { en: "Electrical Parts", hi: "इलेक्ट्रिकल पार्ट्स" },
      brandSpecs: {
        "Splendor": "Halonix 12V 35/35W Halogen Headlight Bulb",
        "HF Deluxe": "Halonix 12V HS1 Headlight Bulb",
        "Activa": "Philips 12V LED Headlight Upgrade Bulb",
        "Shine": "Halonix 12V 35/35W Halogen Headlight Bulb",
        "Pulsar": "Osram 12V 35/35W Blue-vision Headlight Bulb",
        "Apache": "TVS Genuine High-Illumination H4 LED Bulb",
        "Jupiter": "TVS Jupiter LED Headlight Module"
      }
    },
    "Indicators": {
      category: { en: "Electrical Parts", hi: "इलेक्ट्रिकल पार्ट्स" },
      brandSpecs: {
        "Splendor": "Hero Genuine Flexible Amber Turn Signal Indicator",
        "HF Deluxe": "Hero Genuine Amber Turn Signal Indicator",
        "Activa": "Honda Genuine Transparent Indicator Lens & Bulb",
        "Shine": "Honda Genuine Flexible Indicator Assembly",
        "Pulsar": "Bajaj Pulsar Genuine Flexible LED Indicator",
        "Apache": "TVS Apache RTR Clear-Lens Turn Indicator",
        "Jupiter": "TVS Jupiter Amber Front Indicator Bulb"
      }
    },
    "Battery": {
      category: { en: "Electrical Parts", hi: "इलेक्ट्रिकल पार्ट्स" },
      brandSpecs: {
        "Splendor": "Exide Xplore 12V 3Ah Maintenance-Free Battery",
        "HF Deluxe": "Exide Xplore 12V 3Ah Maintenance-Free Battery",
        "Activa": "Amaron Pro Rider 12V 3Ah VRLA Battery",
        "Shine": "Exide Xplore 12V 4Ah Maintenance-Free Battery",
        "Pulsar": "Amaron Pro Rider 12V 5Ah VRLA Battery",
        "Apache": "Exide Xplore 12V 9Ah Sports Battery",
        "Jupiter": "Amaron Pro Rider 12V 4Ah VRLA Battery"
      }
    },
    "Air Filter": {
      category: { en: "Oil Filters", hi: "ऑयल फिल्टर" },
      brandSpecs: {
        "Splendor": "Hero Genuine Foam Air Filter Element",
        "HF Deluxe": "Hero Genuine Foam Air Filter Element",
        "Activa": "Honda Genuine Viscous Paper Air Filter",
        "Shine": "Honda Genuine Viscous Paper Air Filter",
        "Pulsar": "Bajaj Genuine Foam Air Filter Element",
        "Apache": "TVS Genuine Paper Air Filter Element",
        "Jupiter": "TVS Jupiter Genuine Viscous Paper Filter"
      }
    },
    "Oil Filter": {
      category: { en: "Oil Filters", hi: "ऑयल फिल्टर" },
      brandSpecs: {
        "Splendor": "Hero Genuine Engine Centrifugal Oil Filter",
        "HF Deluxe": "Hero Genuine Engine Oil Filter Screen",
        "Activa": "Honda Genuine Engine Oil Strainer Screen",
        "Shine": "Honda Genuine Engine Oil Filter Element",
        "Pulsar": "Bajaj Genuine Engine Oil Filter Cartridge",
        "Apache": "TVS Apache Genuine Paper Oil Filter",
        "Jupiter": "TVS Jupiter Engine Oil Strainer Screen"
      }
    },
    "Spark Plug": {
      category: { en: "Electrical Parts", hi: "इलेक्ट्रिकल पार्ट्स" },
      brandSpecs: {
        "Splendor": "NGK UR4AC Copper Spark Plug",
        "HF Deluxe": "NGK UR4AC Resistor Spark Plug",
        "Activa": "NGK MR7C-9 Resistor Spark Plug",
        "Shine": "NGK CPR7EA-9 Resistor Spark Plug",
        "Pulsar": "NGK Spark Plug (Twin Spark Set - UR5AC)",
        "Apache": "NGK CPR8EA-9 High-Performance Spark Plug",
        "Jupiter": "NGK UR5AC Resistor Spark Plug"
      }
    },
    "Engine Oil": {
      category: { en: "Engine Oils & Lubricants", hi: "इंजन ऑयल और लुब्रिकेंट्स" },
      brandSpecs: {
        "Splendor": "Castrol Activ 4T 10W30 Engine Oil (900ml)",
        "HF Deluxe": "Hero Genuine 4T 10W30 Engine Oil (900ml)",
        "Activa": "Castrol Activ Scooter 10W30 Engine Oil (800ml)",
        "Shine": "Honda Genuine 4T 10W30 Engine Oil (1L)",
        "Pulsar": "Motul 3100 4T 20W50 Engine Oil (1.1L)",
        "Apache": "Motul 7100 4T 10W30 Synthetic Oil (1L)",
        "Jupiter": "Gulf Pride Scooter 10W30 Engine Oil (800ml)"
      }
    }
  };

  // Dropdown filtering logic
  if (finderBrandSelect && finderModelSelect) {
    finderBrandSelect.addEventListener('change', () => {
      const selectedBrand = finderBrandSelect.value;
      finderModelSelect.value = "";
      
      if (selectedBrand === "") {
        finderModelSelect.disabled = true;
        finderDiagramWrapper.style.display = "none";
      } else {
        finderModelSelect.disabled = false;
        
        // Show only models of selected brand
        Array.from(finderModelSelect.options).forEach(opt => {
          if (opt.value === "") {
            opt.style.display = "block";
          } else if (opt.classList.contains(`brand-${selectedBrand}`)) {
            opt.style.display = "block";
          } else {
            opt.style.display = "none";
          }
        });
      }
    });
  }

  // Model Selection - SVG Toggle
  if (finderModelSelect) {
    finderModelSelect.addEventListener('change', () => {
      const selectedModel = finderModelSelect.value;
      
      if (selectedModel === "") {
        finderDiagramWrapper.style.display = "none";
      } else {
        finderDiagramWrapper.style.display = "block";
        
        // If scooter (Activa or Jupiter)
        if (selectedModel === "Activa" || selectedModel === "Jupiter") {
          scooterSvg.style.display = "block";
          motorcycleSvg.style.display = "none";
        } else {
          scooterSvg.style.display = "none";
          motorcycleSvg.style.display = "block";
        }
      }
    });
  }

  // Hotspot clicks
  document.querySelectorAll('.finder-hotspot').forEach(hotspot => {
    hotspot.addEventListener('click', (e) => {
      e.preventDefault();
      
      const partKey = hotspot.getAttribute('data-part');
      const selectedModel = finderModelSelect.value;
      const selectedBrand = finderBrandSelect.value;
      
      if (!partKey || !selectedModel || !selectedBrand) return;

      const partData = partsInventoryDb[partKey];
      if (!partData) return;

      const partName = partData.brandSpecs[selectedModel] || `${selectedModel} Genuine ${partKey}`;
      const partCategory = currentLang === 'hi' ? partData.category.hi : partData.category.en;
      const compatibleVehicle = `${selectedBrand} ${selectedModel}`;

      // Populate Modal
      modalPartName.textContent = partName;
      modalCompatibleVehicle.textContent = compatibleVehicle;
      modalProductCategory.textContent = partCategory;

      // WhatsApp Deep link
      const waMessageText = `Hi Paras Auto Parts, I am looking for the "${partName}" compatible with my "${compatibleVehicle}". Please let me know if it is available and what the price is.`;
      modalWhatsAppEnquiryBtn.href = `https://wa.me/919993150250?text=${encodeURIComponent(waMessageText)}`;

      // Show Modal
      finderModal.style.display = 'flex';
    });
  });

  // Close Modal
  if (finderModalClose) {
    finderModalClose.addEventListener('click', () => {
      finderModal.style.display = 'none';
    });
  }

  if (finderModal) {
    finderModal.addEventListener('click', (e) => {
      if (e.target === finderModal) {
        finderModal.style.display = 'none';
      }
    });
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
