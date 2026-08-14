/* ==========================================================================
   BatikNusa — Landing Page Interactive Logic & Components
   Includes: Smooth Scroll, Active Nav Highlight, Count-Up Counters, 
   Mobile Hamburger Toggle, Product Quick View Modal & UMKM Register Modal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // --- 2. Mobile Hamburger Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link or mobile CTA
    navMenu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  // --- 3. Stat Count-Up Animation ---
  function countUp(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start);
    }, 16);
  }

  const counters = document.querySelectorAll('.count-up');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          if (!isNaN(target)) {
            countUp(entry.target, target);
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // --- 4. Active Nav Link Observer on Scroll ---
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav-item');

  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });

      mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (current && item.getAttribute('href') === '#' + current) {
          item.classList.add('active');
        }
      });
    });
  }

  // --- 5. Interactive Toast Notifications ---
  window.showToast = function(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #1B2B5E;
      color: #FFF;
      padding: 14px 22px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      border-left: 4px solid #C8933A;
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: auto;
    `;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8933A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // --- 6. Modal Popup Handlers ---
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close modals when clicking outside modal-card
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Handle UMKM Register Form Submission inside modal
  const regForm = document.getElementById('umkmRegisterForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const umkmName = document.getElementById('regUmkmName')?.value || 'UMKM Anda';
      closeModal('modalRegister');
      showToast(`Pendaftaran "${umkmName}" berhasil diajukan! Tim BatikNusa akan menghubungi Anda via WhatsApp.`);
      regForm.reset();
    });
  }

  // Handle Contact Form Submission with WhatsApp Redirection
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || 'Sahabat BatikNusa';
      const phone = document.getElementById('contactPhone')?.value || '';
      const topic = document.getElementById('contactTopic')?.value || 'Konsultasi UMKM';
      const message = document.getElementById('contactMessage')?.value || '';

      const waMessage = `Halo Tim BatikNusa,\n\nSaya: ${name}\nNomor WA: ${phone}\nTopik: ${topic}\n\nPesan:\n${message}`;
      const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

      showToast(`Pesan dari "${name}" sedang dikirim via WhatsApp...`);
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);

      contactForm.reset();
    });
  }

  // --- Gallery Lightbox Modal Handler ---
  window.openGalleryModal = function(title, imgUrl, desc) {
    const modalImg = document.getElementById('modalGalleryImg');
    const modalTitle = document.getElementById('modalGalleryTitle');
    const modalDesc = document.getElementById('modalGalleryDesc');

    if (modalImg) modalImg.src = imgUrl;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    openModal('modalGallery');
  };

  // --- 7. Product Quick View Modal Population ---
  const products = {
    1: {
      name: "Kain Batik Tulis Jlamprang Premium",
      badge: "Batik Tulis Canting",
      price: "Rp850.000",
      seller: "Batik Sri Rejeki (Wiradesa)",
      rating: "★ 4.8 (32 ulasan)",
      img: "image/products/prod_jlamprang.png",
      desc: "Kain batik tulis autentik Pekalongan dengan motif geometris Jlamprang khas. Dibuat secara 100% manual menggosok canting malam oleh pengrajin berpengalaman selama 3-4 minggu."
    },
    2: {
      name: "Kemeja Batik Cap Sekar Jagad",
      badge: "Batik Cap Autentik",
      price: "Rp275.000",
      seller: "Batik Fauzi Craft (Buaran)",
      rating: "★ 4.9 (48 ulasan)",
      img: "image/products/prod_sekar_jagad.png",
      desc: "Kemeja pria batik cap motif Sekar Jagad melambangkan keindahan dan keragaman budaya. Menggunakan katun primissima yang adem, halus, dan tahan luntur."
    },
    3: {
      name: "Kain Batik Kombinasi Terang Bulan",
      badge: "Batik Kombinasi",
      price: "Rp450.000",
      seller: "Batik Kartika Indah (Kedungwuni)",
      rating: "★ 4.7 (19 ulasan)",
      img: "image/products/prod_terang_bulan.png",
      desc: "Kombinasi teknik cap dan sentuhan tulis pada motif Terang Bulan khas Pekalongan. Warna cerah khas pesisir yang anggun untuk busana formal maupun santai."
    },
    4: {
      name: "Kain Batik Colet Pesisiran Artisanal",
      badge: "Batik Colet Pesisir",
      price: "Rp620.000",
      seller: "Batik Pekalongan Indah (Tirto)",
      rating: "★ 4.9 (25 ulasan)",
      img: "image/products/prod_colet_pesisiran.png",
      desc: "Karya seni batik tulis colet khas pesisiran Pekalongan dengan gradasi warna alam yang kaya dan detail motif flora pesisir."
    }
  };

  window.openProductDetail = function(productId) {
    const p = products[productId];
    if (!p) return;

    document.getElementById('modalProductTitle').textContent = p.name;
    document.getElementById('modalProductBadge').textContent = p.badge;
    document.getElementById('modalProductPrice').textContent = p.price;
    document.getElementById('modalProductSeller').textContent = p.seller;
    document.getElementById('modalProductRating').textContent = p.rating;
    document.getElementById('modalProductImg').src = p.img;
    document.getElementById('modalProductDesc').textContent = p.desc;

    openModal('modalProduct');
  };

});
