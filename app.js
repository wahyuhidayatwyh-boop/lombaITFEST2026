/* ==========================================================================
   BatikNusa — Landing Page Interactive Logic & Components
   Author: Tim BatikNusa (Lomba IT FEST 2026)
   Includes:
   1. Sticky Navbar & Active Navigation Scrollspy
   2. Mobile Hamburger Menu Toggle & Bottom Navigation
   3. Statistics Count-Up Animation (Intersection Observer)
   4. Interactive Toast Notification System
   5. Accessible Modal System (Product, Gallery, Order, Consultation)
   6. Product Catalog Quick View & Order WhatsApp Dispatcher
   7. Interactive Map & Cluster Filter Synchronization
   8. Testimonial Carousel Focus on Mobile
   9. Clean Form Submit Event Listeners (No Inline onsubmit)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 0. Preloader / Initial Loading Screen Controller (3-Second Duration) ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderPercent = document.getElementById('preloaderPercent');
    const preloaderStatus = document.getElementById('preloaderStatus');

    const TOTAL_DURATION = 3000; // 3 seconds
    const startTime = performance.now();

    const statusMessages = [
      { at: 0, text: 'Menghubungkan klaster batik Pekalongan...' },
      { at: 35, text: 'Memuat katalog & karya pengrajin...' },
      { at: 70, text: 'Menyiapkan ekosistem BatikNusa...' },
      { at: 98, text: 'BatikNusa Siap!' }
    ];

    const updateStatus = (val) => {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (val >= statusMessages[i].at) {
          if (preloaderStatus && preloaderStatus.textContent !== statusMessages[i].text) {
            preloaderStatus.textContent = statusMessages[i].text;
          }
          break;
        }
      }
    };

    const animateProgress = (now) => {
      const elapsed = now - startTime;
      // Reaches 100% around 2.6s, holds briefly, and exits at 3.0s
      const progressRatio = Math.min(elapsed / (TOTAL_DURATION - 400), 1);

      // Smooth natural easing
      const easedProgress = Math.min(100, Math.round(progressRatio * 100));

      if (preloaderBar) preloaderBar.style.width = `${easedProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${easedProgress}%`;
      updateStatus(easedProgress);

      if (elapsed < TOTAL_DURATION) {
        requestAnimationFrame(animateProgress);
      } else {
        if (preloaderBar) preloaderBar.style.width = '100%';
        if (preloaderPercent) preloaderPercent.textContent = '100%';
        if (preloaderStatus) preloaderStatus.textContent = 'BatikNusa Siap!';

        setTimeout(() => {
          preloader.classList.add('preloader-hidden');
          document.body.classList.remove('preloader-active');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 700);
        }, 200);
      }
    };

    requestAnimationFrame(animateProgress);
  }

  // --- 1. Sticky/Fixed Navbar & Back to Top Button ---
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  const handleNavScroll = () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 2. Mobile Hamburger Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    const closeMobileMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking a link or mobile CTA
    navMenu.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMobileMenu();
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
      el.textContent = Math.floor(start).toLocaleString('id-ID');
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
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // --- 4. Active Nav Link Observer on Scroll ---
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav-item');

  if (sections.length > 0) {
    const updateActiveNav = () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 130;
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
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // --- 5. Interactive Toast Notifications ---
  window.showToast = function (message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8933A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // --- 6. Modal Popup Handlers ---
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  };

  // Close modals when clicking outside modal-card or pressing ESC
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.classList.remove('modal-open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
      document.body.classList.remove('modal-open');
    }
  });

  // --- 7. Gallery Lightbox Modal Handler ---
  window.openGalleryModal = function (title, imgUrl, desc) {
    const modalImg = document.getElementById('modalGalleryImg');
    const modalTitle = document.getElementById('modalGalleryTitle');
    const modalDesc = document.getElementById('modalGalleryDesc');

    // Replace .png with .webp automatically if needed
    const webpUrl = imgUrl.replace(/\.png$/i, '.webp');

    if (modalImg) {
      modalImg.src = webpUrl;
      modalImg.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    openModal('modalGallery');
  };

  // --- 8. Product Quick View Modal & Data ---
  window.products = {
    1: {
      name: "Kain Batik Tulis Jlamprang Premium",
      badge: "Batik Tulis Canting",
      price: "Rp850.000",
      seller: "Batik Sri Rejeki (Wiradesa)",
      rating: "4.8 (32 ulasan)",
      img: "image/products/prod_jlamprang.webp",
      desc: "Kain batik tulis autentik Pekalongan dengan motif geometris Jlamprang khas. Dibuat secara 100% manual menggosok canting malam oleh pengrajin berpengalaman selama 3-4 minggu."
    },
    2: {
      name: "Kemeja Batik Cap Sekar Jagad",
      badge: "Batik Cap Autentik",
      price: "Rp275.000",
      seller: "Batik Fauzi Craft (Buaran)",
      rating: "4.9 (48 ulasan)",
      img: "image/products/prod_sekar_jagad.webp",
      desc: "Kemeja pria batik cap motif Sekar Jagad melambangkan keindahan dan keragaman budaya. Menggunakan katun primissima yang adem, halus, dan tahan luntur."
    },
    3: {
      name: "Kain Batik Kombinasi Terang Bulan",
      badge: "Batik Kombinasi",
      price: "Rp450.000",
      seller: "Batik Kartika Indah (Kedungwuni)",
      rating: "4.7 (19 ulasan)",
      img: "image/products/prod_terang_bulan.webp",
      desc: "Kombinasi teknik cap dan sentuhan tulis pada motif Terang Bulan khas Pekalongan. Warna cerah khas pesisir yang anggun untuk busana formal maupun santai."
    },
    4: {
      name: "Kain Batik Colet Pesisiran Artisanal",
      badge: "Batik Colet Pesisir",
      price: "Rp620.000",
      seller: "Batik Pekalongan Indah (Tirto)",
      rating: "4.9 (25 ulasan)",
      img: "image/products/prod_colet_pesisiran.webp",
      desc: "Karya seni batik tulis colet khas pesisiran Pekalongan dengan gradasi warna alam yang kaya dan detail motif flora pesisir."
    },
    5: {
      name: "Kain Batik Tulis Motif Tujuh Rupa",
      badge: "Batik Tulis",
      price: "Rp920.000",
      seller: "Batik Canting Emas (Buaran)",
      rating: "4.9 (18 ulasan)",
      img: "image/products/prod_tujuh_rupa.webp",
      desc: "Motif klasik Tujuh Rupa khas Pekalongan yang memadukan ornamen flora dan fauna pesisir yang anggun, dibuat dengan teknik canting malam presisi tinggi."
    },
    6: {
      name: "Kemeja Batik Cap Pria Garutan Modern",
      badge: "Batik Cap",
      price: "Rp315.000",
      seller: "Tenun & Batik Jaya (Wiradesa)",
      rating: "4.8 (34 ulasan)",
      img: "image/products/prod_garutan.webp",
      desc: "Kemeja pria motif cap Garutan kontemporer dengan perpaduan warna sogan earthy dan gold, dijahit dengan fitting reguler-fit yang nyaman dan elegan."
    },
    7: {
      name: "Kain Batik Tulis Indigo Pesisiran",
      badge: "Batik Tulis",
      price: "Rp780.000",
      seller: "Galeri Pesisir Indah (Tirto)",
      rating: "4.9 (15 ulasan)",
      img: "image/products/prod_megamendung.webp",
      desc: "Kain batik tulis pesisiran dengan pewarnaan indigo alami khas Pekalongan yang menghasilkan gradasi biru laut eksotis dan tahan luntur bertahun-tahun."
    },
    8: {
      name: "Kain Batik Cap Smok Pesisir Eksklusif",
      badge: "Batik Smok",
      price: "Rp385.000",
      seller: "Griya Batik Barokah (Kedungwuni)",
      rating: "4.7 (22 ulasan)",
      img: "image/products/prod_smok_pesisir.webp",
      desc: "Inovasi batik cap kombinasi teknik celup smok Pekalongan yang menghasilkan gradasi tekstur warna marmer etnik yang modern dan menawan."
    }
  };

  window.activeProductData = null;

  window.openProductDetail = function (productId) {
    const p = window.products[productId];
    if (!p) return;
    window.activeProductData = p;

    if (document.getElementById('modalProductTitle')) document.getElementById('modalProductTitle').textContent = p.name;
    if (document.getElementById('modalProductBadge')) document.getElementById('modalProductBadge').textContent = p.badge;
    if (document.getElementById('modalProductPrice')) document.getElementById('modalProductPrice').textContent = p.price;
    if (document.getElementById('modalProductSeller')) document.getElementById('modalProductSeller').textContent = p.seller;
    if (document.getElementById('modalProductRating')) document.getElementById('modalProductRating').textContent = p.rating;
    if (document.getElementById('modalProductImg')) {
      const img = document.getElementById('modalProductImg');
      img.src = p.img;
      img.alt = p.name;
    }
    if (document.getElementById('modalProductDesc')) document.getElementById('modalProductDesc').textContent = p.desc;

    openModal('modalProduct');
  };

  // Dedicated Product Order Form opener
  window.openConsultationForProduct = function (productId) {
    if (productId && window.products && window.products[productId]) {
      window.activeProductData = window.products[productId];
    }

    closeModal('modalProduct');

    if (window.activeProductData) {
      const img = document.getElementById('orderProductImg');
      const badge = document.getElementById('orderProductBadge');
      const title = document.getElementById('orderProductTitle');
      const seller = document.getElementById('orderProductSeller');
      const price = document.getElementById('orderProductPrice');

      if (img) {
        img.src = window.activeProductData.img;
        img.alt = window.activeProductData.name;
      }
      if (badge) badge.textContent = window.activeProductData.badge;
      if (title) title.textContent = window.activeProductData.name;
      if (seller) seller.textContent = window.activeProductData.seller;
      if (price) price.textContent = window.activeProductData.price;
    }

    setTimeout(() => {
      openModal('modalProductOrder');
    }, 150);
  };

  // --- 8.1 Product Search & Pagination System ---
  const productSearch = document.getElementById('productSearch');
  const productSearchClear = document.getElementById('productSearchClear');
  const productCards = document.querySelectorAll('.product-vertical-grid .product-vcard');
  const productNotFound = document.getElementById('productNotFound');
  const paginationWrap = document.getElementById('productPagination');
  const pageButtons = document.querySelectorAll('.product-page-num');
  const prevPageBtn = document.getElementById('prodPrevPage');
  const nextPageBtn = document.getElementById('prodNextPage');

  let currentPage = 1;
  const totalPages = 2;

  const updateProductView = () => {
    const query = productSearch ? productSearch.value.trim().toLowerCase() : '';
    let matchCount = 0;

    if (productSearchClear) {
      productSearchClear.style.display = query.length > 0 ? 'flex' : 'none';
    }

    if (query.length > 0) {
      // In search mode: filter across all 8 products
      if (paginationWrap) paginationWrap.style.display = 'none';

      productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const isMatch = text.includes(query);
        if (isMatch) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });
    } else {
      // In normal mode: show products for currentPage
      if (paginationWrap) paginationWrap.style.display = 'flex';

      productCards.forEach(card => {
        const page = parseInt(card.getAttribute('data-page') || '1', 10);
        if (page === currentPage) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update active pagination button states
      pageButtons.forEach(btn => {
        const p = parseInt(btn.getAttribute('data-page') || '1', 10);
        btn.classList.toggle('active', p === currentPage);
      });

      if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
      if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    }

    if (productNotFound) {
      productNotFound.style.display = matchCount === 0 ? 'block' : 'none';
    }
  };

  if (productSearch) {
    productSearch.addEventListener('input', updateProductView);
  }

  if (productSearchClear) {
    productSearchClear.addEventListener('click', () => {
      productSearch.value = '';
      updateProductView();
      productSearch.focus();
    });
  }

  pageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page') || '1', 10);
      currentPage = page;
      updateProductView();
      const grid = document.getElementById('productGrid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateProductView();
        const grid = document.getElementById('productGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateProductView();
        const grid = document.getElementById('productGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  updateProductView();

  // --- 9. Interactive Map & Cluster Filtering System ---
  const mapData = {
    buaran: {
      title: "Pusat Klaster Batik Buaran",
      tag: "Pusat Utama",
      location: "Buaran, Kab. Pekalongan",
      umkm: "150+",
      gb: "45+",
      pointer: "150",
      region: "Pekalongan Selatan",
      img: "image/gallery/doc_canting.webp",
      waText: "Halo Tim BatikNusa, saya ingin berkonsultasi mengenai Klaster Buaran (Pusat Utama).",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31677.38241584906!2d109.6580000!3d-6.9150000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70258cb7d6c6e7%3A0x4027a76e352f750!2sBuaran%2C%20Pekalongan%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
    },
    wiradesa: {
      title: "Sentra Batik Tulis Wiradesa",
      tag: "Spesialis Tulis",
      location: "Wiradesa, Kab. Pekalongan",
      umkm: "120+",
      gb: "25+",
      pointer: "120",
      region: "Pekalongan Barat",
      img: "image/gallery/doc_pewarnaan.webp",
      waText: "Halo Tim BatikNusa, saya berminat dengan produk & pendaftaran Klaster Batik Tulis Wiradesa.",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31678.00000000000!2d109.6100000!3d-6.8900000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70240000000000%3A0x0!2sWiradesa%2C%20Pekalongan%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
    },
    kedungwuni: {
      title: "Posko Group Buying Kedungwuni",
      tag: "Hub Bahan Baku",
      location: "Kedungwuni, Kab. Pekalongan",
      umkm: "80+",
      gb: "60+",
      pointer: "80",
      region: "Pekalongan Timur",
      img: "image/gallery/doc_penjemuran.webp",
      waText: "Halo Tim BatikNusa, saya ingin bertanya tentang program Group Buying Bahan Baku di Kedungwuni.",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31676.00000000000!2d109.6800000!3d-6.9500000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70260000000000%3A0x0!2sKedungwuni%2C%20Pekalongan%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
    },
    all: {
      title: "Pusat Showroom Batik Pekalongan",
      tag: "Showroom Utama",
      location: "Pusat Kota Pekalongan, Jawa Tengah",
      umkm: "350+",
      gb: "85+",
      pointer: "350",
      region: "Pekalongan City",
      img: "image/gallery/doc_pameran.webp",
      waText: "Halo Tim BatikNusa, saya ingin berkonsultasi mengenai platform BatikNusa.",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63354.76483489812!2d109.6465494!3d-6.9080277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70258cb7d6c6e7%3A0x4027a76e352f750!2sPekalongan%2C%20Pekalongan%20City%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
    }
  };

  function getServicePhoto(key) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (key === 'konsultasi') {
      return isDark ? 'image/backgrounds/about_klasterdark.webp' : 'image/backgrounds/about_klaster.webp';
    }
    const photos = {
      katalog: 'image/products/prod_jlamprang.webp',
      patungan: 'image/products/prod_sekar_jagad.webp'
    };
    return photos[key] || null;
  }

  function updateMapSection(locationKey, serviceKey = 'all', notify = true, triggerSource = 'location') {
    const data = mapData[locationKey] || mapData['all'];

    let cardPhoto = data.img;
    if (triggerSource === 'service' && serviceKey) {
      const sPhoto = getServicePhoto(serviceKey);
      if (sPhoto) cardPhoto = sPhoto;
    }

    const card = document.getElementById('mapCenterCard');
    const cardImg = document.getElementById('mapCardImg');
    const cardTag = document.getElementById('mapCardTag');
    const cardTitle = document.getElementById('mapCardTitle');
    const cardLocText = document.getElementById('mapCardLocText');
    const cardStatUmkm = document.getElementById('mapCardStatUmkm');
    const cardStatGb = document.getElementById('mapCardStatGb');
    const cardRegion = document.getElementById('mapCardRegion');
    const cardWaBtn = document.getElementById('mapCardWaBtn');
    const cardPointerCount = document.getElementById('mapCardPointerCount');
    const mapIframe = document.querySelector('.section-bg-map-container iframe');

    if (card) {
      card.classList.add('active');
      card.style.opacity = '0.4';
      card.style.transform = 'translate(-50%, -46%) scale(0.95)';
      setTimeout(() => {
        if (cardImg) {
          cardImg.src = cardPhoto;
          cardImg.alt = data.title;
        }
        if (cardTag) cardTag.textContent = data.tag;
        if (cardTitle) cardTitle.textContent = data.title;
        if (cardLocText) cardLocText.textContent = data.location;
        if (cardStatUmkm) cardStatUmkm.textContent = data.umkm;
        if (cardStatGb) cardStatGb.textContent = data.gb;
        if (cardRegion) cardRegion.textContent = data.region;
        if (cardPointerCount) cardPointerCount.textContent = data.pointer;

        if (cardWaBtn) {
          cardWaBtn.href = `https://wa.me/6283843653251?text=${encodeURIComponent(data.waText)}`;
        }

        card.style.opacity = '1';
        card.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 150);
    }

    if (mapIframe && data.iframeUrl) {
      mapIframe.src = data.iframeUrl;
    }

    // Synchronize Location Select Dropdown value
    const locSelect = document.getElementById('mapFilterLocation');
    if (locSelect && locSelect.value !== locationKey) {
      locSelect.value = locationKey;
    }

    // Update marker pins active state
    document.querySelectorAll('.map-avatar-marker').forEach(marker => {
      const loc = marker.dataset.location;
      if (loc === locationKey || (locationKey === 'all' && loc === 'all')) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });

    if (notify) {
      showToast(`Lokasi dipilih: ${data.title}`);
    }
  }

  // Bind Close Button on Map Card
  const cardCloseBtn = document.getElementById('mapCardCloseBtn');
  if (cardCloseBtn) {
    cardCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = document.getElementById('mapCenterCard');
      if (card) card.classList.remove('active');
      document.querySelectorAll('.map-avatar-marker').forEach(m => m.classList.remove('active'));
    });
  }

  // Bind Location & Service Select Dropdowns
  const locSelect = document.getElementById('mapFilterLocation');
  const serviceSelect = document.getElementById('mapFilterService');
  const searchBtn = document.getElementById('mapSearchBtn');

  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      updateMapSection(e.target.value, serviceSelect ? serviceSelect.value : 'all', true, 'location');
    });
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', (e) => {
      updateMapSection(locSelect ? locSelect.value : 'all', e.target.value, true, 'service');
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const locVal = locSelect ? locSelect.value : 'all';
      const srvVal = serviceSelect ? serviceSelect.value : 'all';
      updateMapSection(locVal, srvVal, true, 'location');
    });
  }

  // Bind Pin Marker Clicks
  document.querySelectorAll('.map-avatar-marker').forEach(marker => {
    marker.addEventListener('click', (e) => {
      e.stopPropagation();
      const loc = marker.dataset.location || 'all';
      updateMapSection(loc, serviceSelect ? serviceSelect.value : 'all', true, 'location');
    });
  });

  // --- 10. Mobile Testimonial Carousel Centering & Dynamic Focus ---
  const testiContainer = document.querySelector('.testi-clean-grid');
  if (testiContainer) {
    const updateActiveTestiCard = () => {
      if (window.innerWidth <= 768) {
        const testiCards = testiContainer.querySelectorAll('.testi-clean-item');
        const containerCenter = testiContainer.scrollLeft + (testiContainer.offsetWidth / 2);

        let closestCard = null;
        let minDistance = Infinity;

        testiCards.forEach(card => {
          const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
          const distance = Math.abs(containerCenter - cardCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
          }
        });

        testiCards.forEach(card => {
          if (card === closestCard) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      }
    };

    const centerTestiCarousel = () => {
      if (window.innerWidth <= 768) {
        const testiCards = testiContainer.querySelectorAll('.testi-clean-item');
        if (testiCards.length >= 2) {
          const middleCard = testiCards[1]; // Card 2 (Bapak Ahmad Fauzi)
          const containerWidth = testiContainer.offsetWidth;
          const cardLeft = middleCard.offsetLeft;
          const cardWidth = middleCard.offsetWidth;
          testiContainer.scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
          updateActiveTestiCard();
        }
      }
    };

    testiContainer.addEventListener('scroll', updateActiveTestiCard, { passive: true });
    setTimeout(centerTestiCarousel, 250);
    window.addEventListener('resize', centerTestiCarousel);
  }

  // --- 11. Enhanced Form Validation & WhatsApp Dispatcher ---

  // Helper validation functions
  const setFieldError = (inputEl, errorEl, message) => {
    if (!inputEl || !errorEl) return;
    if (message) {
      inputEl.classList.add('is-invalid');
      errorEl.textContent = message;
      errorEl.style.opacity = '1';
    } else {
      inputEl.classList.remove('is-invalid');
      errorEl.textContent = '';
      errorEl.style.opacity = '0';
    }
  };

  const validatePhone = (phoneStr) => {
    const cleaned = (phoneStr || '').trim().replace(/[\s\-\+]/g, '');
    if (!cleaned) return 'Nomor WhatsApp wajib diisi.';
    if (!/^\d+$/.test(cleaned)) return 'Nomor WhatsApp hanya boleh berisi angka.';
    if (cleaned.length < 9 || cleaned.length > 15) return 'Nomor WhatsApp harus 9–15 digit angka valid.';
    return '';
  };

  const validateRequired = (str, fieldName, minLen = 2) => {
    const val = (str || '').trim();
    if (!val) return `${fieldName} wajib diisi.`;
    if (val.length < minLen) return `${fieldName} minimal ${minLen} karakter.`;
    return '';
  };

  // A. Formulir Konsultasi & Pendaftaran UMKM
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    const consultName = document.getElementById('consultName');
    const consultBrand = document.getElementById('consultBrand');
    const consultRegion = document.getElementById('consultRegion');
    const consultService = document.getElementById('consultService');
    const consultWa = document.getElementById('consultWa');

    const consultNameErr = document.getElementById('consultNameError');
    const consultBrandErr = document.getElementById('consultBrandError');
    const consultWaErr = document.getElementById('consultWaError');

    // Real-time blur & input validation
    if (consultName) {
      consultName.addEventListener('blur', () => {
        setFieldError(consultName, consultNameErr, validateRequired(consultName.value, 'Nama pemilik'));
      });
      consultName.addEventListener('input', () => {
        if (consultName.classList.contains('is-invalid')) {
          setFieldError(consultName, consultNameErr, validateRequired(consultName.value, 'Nama pemilik'));
        }
      });
    }

    if (consultBrand) {
      consultBrand.addEventListener('blur', () => {
        setFieldError(consultBrand, consultBrandErr, validateRequired(consultBrand.value, 'Nama usaha / brand'));
      });
      consultBrand.addEventListener('input', () => {
        if (consultBrand.classList.contains('is-invalid')) {
          setFieldError(consultBrand, consultBrandErr, validateRequired(consultBrand.value, 'Nama usaha / brand'));
        }
      });
    }

    if (consultWa) {
      consultWa.addEventListener('blur', () => {
        setFieldError(consultWa, consultWaErr, validatePhone(consultWa.value));
      });
      consultWa.addEventListener('input', () => {
        if (consultWa.classList.contains('is-invalid')) {
          setFieldError(consultWa, consultWaErr, validatePhone(consultWa.value));
        }
      });
    }

    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameErr = validateRequired(consultName?.value, 'Nama pemilik');
      const brandErr = validateRequired(consultBrand?.value, 'Nama usaha / brand');
      const waErr = validatePhone(consultWa?.value);

      setFieldError(consultName, consultNameErr, nameErr);
      setFieldError(consultBrand, consultBrandErr, brandErr);
      setFieldError(consultWa, consultWaErr, waErr);

      if (nameErr) {
        consultName?.focus();
        return;
      }
      if (brandErr) {
        consultBrand?.focus();
        return;
      }
      if (waErr) {
        consultWa?.focus();
        return;
      }

      const name = consultName.value.trim();
      const brand = consultBrand.value.trim();
      const region = consultRegion?.value || 'Buaran';
      const service = consultService?.value || 'Pendaftaran Katalog Digital';
      const wa = consultWa.value.trim();

      const message = `Halo Tim BatikNusa, saya ingin berkonsultasi & mendaftar UMKM Batik:
- Nama: ${name}
- Brand/Usaha: ${brand}
- Lokasi: ${region}
- Kebutuhan: ${service}
- WhatsApp: ${wa}`;

      closeModal('modalConsultation');
      showToast(`Formulir Konsultasi Terkirim! Membuka WhatsApp Official BatikNusa...`);

      setTimeout(() => {
        window.open(`https://wa.me/6283843653251?text=${encodeURIComponent(message)}`, '_blank');
      }, 600);

      consultationForm.reset();
      setFieldError(consultName, consultNameErr, '');
      setFieldError(consultBrand, consultBrandErr, '');
      setFieldError(consultWa, consultWaErr, '');
    });
  }

  // B. Formulir Pemesanan & Pertanyaan Karya Produk
  const productOrderForm = document.getElementById('productOrderForm');
  if (productOrderForm) {
    const orderBuyerName = document.getElementById('orderBuyerName');
    const orderQty = document.getElementById('orderQty');
    const orderWa = document.getElementById('orderWa');
    const orderCity = document.getElementById('orderCity');
    const orderNote = document.getElementById('orderNote');

    const orderBuyerNameErr = document.getElementById('orderBuyerNameError');
    const orderWaErr = document.getElementById('orderWaError');
    const orderCityErr = document.getElementById('orderCityError');

    // Real-time blur & input validation
    if (orderBuyerName) {
      orderBuyerName.addEventListener('blur', () => {
        setFieldError(orderBuyerName, orderBuyerNameErr, validateRequired(orderBuyerName.value, 'Nama pemesan'));
      });
      orderBuyerName.addEventListener('input', () => {
        if (orderBuyerName.classList.contains('is-invalid')) {
          setFieldError(orderBuyerName, orderBuyerNameErr, validateRequired(orderBuyerName.value, 'Nama pemesan'));
        }
      });
    }

    if (orderWa) {
      orderWa.addEventListener('blur', () => {
        setFieldError(orderWa, orderWaErr, validatePhone(orderWa.value));
      });
      orderWa.addEventListener('input', () => {
        if (orderWa.classList.contains('is-invalid')) {
          setFieldError(orderWa, orderWaErr, validatePhone(orderWa.value));
        }
      });
    }

    if (orderCity) {
      orderCity.addEventListener('blur', () => {
        setFieldError(orderCity, orderCityErr, validateRequired(orderCity.value, 'Kota / Alamat', 3));
      });
      orderCity.addEventListener('input', () => {
        if (orderCity.classList.contains('is-invalid')) {
          setFieldError(orderCity, orderCityErr, validateRequired(orderCity.value, 'Kota / Alamat', 3));
        }
      });
    }

    productOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameErr = validateRequired(orderBuyerName?.value, 'Nama pemesan');
      const waErr = validatePhone(orderWa?.value);
      const cityErr = validateRequired(orderCity?.value, 'Kota / Alamat', 3);

      setFieldError(orderBuyerName, orderBuyerNameErr, nameErr);
      setFieldError(orderWa, orderWaErr, waErr);
      setFieldError(orderCity, orderCityErr, cityErr);

      if (nameErr) {
        orderBuyerName?.focus();
        return;
      }
      if (waErr) {
        orderWa?.focus();
        return;
      }
      if (cityErr) {
        orderCity?.focus();
        return;
      }

      const buyerName = orderBuyerName.value.trim();
      const qty = orderQty?.value || '1';
      const wa = orderWa.value.trim();
      const city = orderCity.value.trim();
      const note = orderNote?.value.trim() || '-';

      const productName = window.activeProductData ? window.activeProductData.name : 'Karya Batik Pekalongan';
      const productPrice = window.activeProductData ? window.activeProductData.price : '-';
      const productSeller = window.activeProductData ? window.activeProductData.seller : '-';
      const productBadge = window.activeProductData ? window.activeProductData.badge : '-';

      const waMessage = `Halo BatikNusa & Pengrajin, saya ingin memesan / menanyakan karya batik berikut:

DETAIL PRODUK:
- Nama Karya: ${productName}
- Harga: ${productPrice}
- Pengrajin / Workshop: ${productSeller}
- Jenis Batik: ${productBadge}

DATA PEMESAN:
- Nama Pemesan: ${buyerName}
- Jumlah Pesanan: ${qty} pcs
- Kota / Alamat: ${city}
- WhatsApp Pemesan: ${wa}
- Catatan Khusus: ${note}`;

      closeModal('modalProductOrder');
      showToast(`Formulir Pemesanan Karya Terkirim! Membuka WhatsApp Official BatikNusa...`);

      setTimeout(() => {
        window.open(`https://wa.me/6283843653251?text=${encodeURIComponent(waMessage)}`, '_blank');
      }, 600);

      productOrderForm.reset();
      setFieldError(orderBuyerName, orderBuyerNameErr, '');
      setFieldError(orderWa, orderWaErr, '');
      setFieldError(orderCity, orderCityErr, '');
    });
  }

  // --- 12. Opt-in Background Ambient Audio (Lazy Loaded & Gentle Fade) ---
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    let ambientAudio = null;
    let isPlaying = false;
    let fadeInterval = null;
    const TARGET_VOLUME = 0.25; // Gentle background level (<= 0.3)
    const FADE_DURATION = 500;  // 500ms smooth transition

    // Lazy instantiate HTML5 Audio object only on user click (zero initial network overhead)
    const initAudio = () => {
      if (!ambientAudio) {
        ambientAudio = new Audio('sound/ambient-batik.mp3');
        ambientAudio.loop = true;
        ambientAudio.volume = 0;
      }
      return ambientAudio;
    };

    const fadeIn = (audio) => {
      clearInterval(fadeInterval);
      audio.volume = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Audio playback prevented or unsupported:', err);
        });
      }
      const step = TARGET_VOLUME / (FADE_DURATION / 25);
      fadeInterval = setInterval(() => {
        if (audio.volume + step < TARGET_VOLUME) {
          audio.volume += step;
        } else {
          audio.volume = TARGET_VOLUME;
          clearInterval(fadeInterval);
        }
      }, 25);
    };

    const fadeOut = (audio) => {
      clearInterval(fadeInterval);
      const step = audio.volume / (FADE_DURATION / 25);
      fadeInterval = setInterval(() => {
        if (audio.volume - step > 0.01) {
          audio.volume -= step;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
        }
      }, 25);
    };

    const updateButtonState = (active) => {
      soundToggle.classList.toggle('sound-active', active);
      soundToggle.setAttribute('aria-pressed', active ? 'true' : 'false');
      soundToggle.setAttribute('aria-label', active ? 'Matikan musik latar' : 'Aktifkan musik latar');
      soundToggle.setAttribute('title', active ? 'Matikan Musik Latar' : 'Aktifkan Musik Latar (Opt-in)');
    };

    soundToggle.addEventListener('click', () => {
      const audio = initAudio();
      isPlaying = !isPlaying;

      if (isPlaying) {
        fadeIn(audio);
        updateButtonState(true);
        try { localStorage.setItem('batiknusa_sound_pref', 'on'); } catch (e) { }
        if (window.showToast) {
          showToast('Musik latar gamelan & ambient batik diaktifkan.');
        }
      } else {
        fadeOut(audio);
        updateButtonState(false);
        try { localStorage.setItem('batiknusa_sound_pref', 'off'); } catch (e) { }
        if (window.showToast) {
          showToast('Musik latar dimatikan.');
        }
      }
    });
  }

  // --- 13. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else if (revealElements.length > 0) {
    // Fallback: browser tidak support IntersectionObserver, tampilkan langsung
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- 14. FAQ Accordion Interaction ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQs for clean single-expanded accordion
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            const otherAns = other.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // --- 15. Dark Mode Toggle & Preference Management (Global Handlers) ---
  window.getSavedTheme = function () {
    try {
      const saved = localStorage.getItem('batiknusa_theme_pref');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) { }
    return 'light';
  };

  window.applyTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }

    const isDark = theme === 'dark';
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
      btn.setAttribute('title', isDark ? 'Mode Terang' : 'Mode Gelap');

      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
      }
    }
  };

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    window.applyTheme(next);
    try {
      localStorage.setItem('batiknusa_theme_pref', next);
    } catch (e) { }

    if (typeof window.showToast === 'function') {
      window.showToast(`Mode ${next === 'dark' ? 'Gelap (Night Heritage)' : 'Terang'} Diaktifkan`);
    }
  };

  // Initial theme application on DOM ready
  const initialTheme = window.getSavedTheme();
  window.applyTheme(initialTheme);

  // Listen for system color-scheme change
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('batiknusa_theme_pref')) {
        window.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

});
