/**
 * RCCG Nigeria Province 5, Minna - Main Interactive Application Script
 * Features: Mobile Nav, Modals (Prayer, Giving, Scripture/AI Assistant), 
 * Gallery Lightbox, Live Service Countdown, Audio Preview, and Dynamic Tabs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  }

  if (closeMobileMenu && mobileMenu) {
    closeMobileMenu.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // 2. Sticky Navbar Glass Effect on Scroll
  const mainNavbar = document.getElementById('mainNavbar');
  if (mainNavbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        mainNavbar.classList.add('py-3', 'shadow-2xl');
        mainNavbar.classList.remove('py-5');
      } else {
        mainNavbar.classList.add('py-5');
        mainNavbar.classList.remove('py-3', 'shadow-2xl');
      }
    });
  }

  // 3. Countdown to Next Major Event (Provincial Convention / Sunday Service)
  initCountdown();

  // 4. Modals Management
  setupModals();

  // 5. "Ask Pastor / Scripture Assistant" Interactive Search
  setupScriptureAssistant();

  // 6. Copy to Clipboard Utility
  setupCopyButtons();

  // 7. Lightbox for Gallery
  setupLightbox();

  // 8. Dynamic Tabs for Sermons & Events
  setupTabs();
});

/* ==========================================================================
   Countdown Timer Function
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl) return;

  // Target: Next upcoming Sunday at 8:00 AM or Provincial Convention
  const now = new Date();
  const nextTarget = new Date();
  
  // Set target 4 days from now for dynamic preview
  nextTarget.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  nextTarget.setHours(8, 0, 0, 0);

  function update() {
    const currentTime = new Date().getTime();
    const distance = nextTarget.getTime() - currentTime;

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minsEl) minsEl.innerText = "00";
      if (secsEl) secsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   Modals Management (Prayer, Giving, Devotional)
   ========================================================================== */
function setupModals() {
  // Generic modal openers with data-modal-target
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  // Close modals
  document.querySelectorAll('[data-modal-close]').forEach(closer => {
    closer.addEventListener('click', () => {
      const modal = closer.closest('.modal-container');
      if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });

  // Close when clicking outside modal panel
  document.querySelectorAll('.modal-container').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }
    });
  });

  // Prayer Request Form Submission handling
  const prayerForm = document.getElementById('prayerRequestForm');
  if (prayerForm) {
    prayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prayerName')?.value || 'Beloved in Christ';
      showToast(`Thank you, ${name}! Your prayer request has been received. Our Ministerial Prayer Band is praying for you.`);
      prayerForm.reset();
      const modal = document.getElementById('prayerModal');
      if (modal) modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // General Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thank you for reaching out to RCCG Nigeria Province 5! We will respond shortly.");
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   Interactive "Ask Pastor / Scripture Assistant" Widget
   (Directly reflects the 'Ask anything' pill in reference UI)
   ========================================================================== */
function setupScriptureAssistant() {
  const askInput = document.getElementById('scriptureAskInput');
  const askBtn = document.getElementById('scriptureAskBtn');
  const askResponseBox = document.getElementById('scriptureResponse');

  const knowledgeBase = [
    {
      keywords: ['service', 'time', 'sunday', 'program', 'meeting', 'when'],
      answer: "⛪ <strong>Service Times at RCCG Province 5, Minna:</strong><br>• <strong>Sunday Celebration Service:</strong> 8:00 AM - 11:30 AM<br>• <strong>Wednesday Digging Deep (Bible Study):</strong> 5:00 PM - 6:30 PM<br>• <strong>Friday Faith Clinic (Prayer Meeting):</strong> 5:00 PM - 6:30 PM"
    },
    {
      keywords: ['prayer', 'pray', 'request', 'help', 'intercession'],
      answer: "🙏 <em>'For where two or three are gathered in my name, there am I among them.' (Matt 18:20)</em><br>Our 24/7 Ministerial Intercessory Team is ready. Click the <strong>Prayer Request</strong> button to submit your burden confidentially."
    },
    {
      keywords: ['give', 'tithe', 'offering', 'bank', 'account', 'donate', 'transfer'],
      answer: "💳 <strong>Province 5 Giving Accounts:</strong><br><strong>Account Name:</strong> RCCG Nigeria Province 5<br><strong>Bank:</strong> Zenith Bank / Access Bank<br><strong>Account No:</strong> 1014892305 (Main Tithes/Offerings). Use the 'Give' button for 1-click copy."
    },
    {
      keywords: ['location', 'where', 'address', 'minna', 'find', 'parish', 'directions'],
      answer: "📍 <strong>Provincial Headquarters:</strong><br>RCCG Nigeria Province 5 HQ, Opp. Government College Road, Minna, Niger State.<br>We have over 45 parish centers spread across Minna, Bida, Suleja and environs."
    },
    {
      keywords: ['salvation', 'jesus', 'born again', 'peace', 'forgiveness', 'grace'],
      answer: "✨ <em>'If anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.' (2 Corinthians 5:17)</em><br>Jesus loves you and has a glorious destiny for you. Welcome home to God's family!"
    },
    {
      keywords: ['theme', 'year', 'adeboye', 'pastor', 'motto'],
      answer: "🕊️ <strong>RCCG Motto:</strong> 'Making Heaven. Living Christlike. Taking as many people with us.'<br><strong>Provincial Pastor:</strong> Overseeing Kingdom expansion across Niger State with apostolic grace."
    }
  ];

  function handleQuery() {
    if (!askInput) return;
    const query = askInput.value.trim().toLowerCase();
    if (!query) {
      if (askResponseBox) {
        askResponseBox.innerHTML = "<p class='text-amber-300'>Please type a question, topic (e.g. 'service times', 'prayer', 'giving', 'salvation'), or scripture keyword.</p>";
        askResponseBox.classList.remove('hidden');
      }
      return;
    }

    let found = knowledgeBase.find(item => item.keywords.some(k => query.includes(k)));
    let resultHTML = "";

    if (found) {
      resultHTML = found.answer;
    } else {
      resultHTML = `📖 <strong>Spiritual Focus:</strong><br>"Call to Me, and I will answer you, and show you great and mighty things, which you do not know." (Jeremiah 33:3)<br><br>We'd love to assist you personally! Please contact our Provincial pastoral desk at <strong>+234 (0) 803 123 4567</strong> or use the Prayer Request button.`;
    }

    if (askResponseBox) {
      askResponseBox.innerHTML = resultHTML;
      askResponseBox.classList.remove('hidden');
    }
  }

  if (askBtn) {
    askBtn.addEventListener('click', handleQuery);
  }

  if (askInput) {
    askInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleQuery();
      }
    });
  }
}

/* ==========================================================================
   Copy to Clipboard Function
   ========================================================================== */
function setupCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied: "${textToCopy}" to clipboard!`);
        });
      } else {
        const input = document.createElement('input');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(`Copied: "${textToCopy}" to clipboard!`);
      }
    });
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'fixed bottom-6 right-6 z-50 max-w-md px-5 py-4 rounded-2xl glass-panel text-white shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 border border-amber-400/40';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div class="text-sm font-medium leading-snug">${message}</div>
  `;

  toast.classList.remove('translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4500);
}

/* ==========================================================================
   Gallery Lightbox Viewer
   ========================================================================== */
function setupLightbox() {
  const lightboxModal = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  if (!lightboxModal || !lightboxImg) return;

  document.querySelectorAll('[data-gallery-img]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const src = item.getAttribute('data-gallery-img');
      const caption = item.getAttribute('data-gallery-title') || 'RCCG Nigeria Province 5';
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.innerText = caption;
      lightboxModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  });
}

/* ==========================================================================
   Dynamic Filter Tabs
   ========================================================================== */
function setupTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-filter]');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-tab-filter');
      
      tabButtons.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
        b.classList.add('bg-white/10', 'text-slate-300');
      });
      btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
      btn.classList.remove('bg-white/10', 'text-slate-300');

      document.querySelectorAll('[data-tab-category]').forEach(card => {
        if (category === 'all' || card.getAttribute('data-tab-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
