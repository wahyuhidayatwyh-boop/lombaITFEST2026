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
      const waUrl = `https://wa.me/6283843653251?text=${encodeURIComponent(waMessage)}`;

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
  window.products = {
    1: {
      name: "Kain Batik Tulis Jlamprang Premium",
      badge: "Batik Tulis Canting",
      price: "Rp850.000",
      seller: "Batik Sri Rejeki (Wiradesa)",
      rating: "4.8 (32 ulasan)",
      img: "image/products/prod_jlamprang.png",
      desc: "Kain batik tulis autentik Pekalongan dengan motif geometris Jlamprang khas. Dibuat secara 100% manual menggosok canting malam oleh pengrajin berpengalaman selama 3-4 minggu."
    },
    2: {
      name: "Kemeja Batik Cap Sekar Jagad",
      badge: "Batik Cap Autentik",
      price: "Rp275.000",
      seller: "Batik Fauzi Craft (Buaran)",
      rating: "4.9 (48 ulasan)",
      img: "image/products/prod_sekar_jagad.png",
      desc: "Kemeja pria batik cap motif Sekar Jagad melambangkan keindahan dan keragaman budaya. Menggunakan katun primissima yang adem, halus, dan tahan luntur."
    },
    3: {
      name: "Kain Batik Kombinasi Terang Bulan",
      badge: "Batik Kombinasi",
      price: "Rp450.000",
      seller: "Batik Kartika Indah (Kedungwuni)",
      rating: "4.7 (19 ulasan)",
      img: "image/products/prod_terang_bulan.png",
      desc: "Kombinasi teknik cap dan sentuhan tulis pada motif Terang Bulan khas Pekalongan. Warna cerah khas pesisir yang anggun untuk busana formal maupun santai."
    },
    4: {
      name: "Kain Batik Colet Pesisiran Artisanal",
      badge: "Batik Colet Pesisir",
      price: "Rp620.000",
      seller: "Batik Pekalongan Indah (Tirto)",
      rating: "4.9 (25 ulasan)",
      img: "image/products/prod_colet_pesisiran.png",
      desc: "Karya seni batik tulis colet khas pesisiran Pekalongan dengan gradasi warna alam yang kaya dan detail motif flora pesisir."
    }
  };

  window.activeProductData = null;

  window.openProductDetail = function(productId) {
    const p = window.products[productId];
    if (!p) return;
    window.activeProductData = p;

    if (document.getElementById('modalProductTitle')) document.getElementById('modalProductTitle').textContent = p.name;
    if (document.getElementById('modalProductBadge')) document.getElementById('modalProductBadge').textContent = p.badge;
    if (document.getElementById('modalProductPrice')) document.getElementById('modalProductPrice').textContent = p.price;
    if (document.getElementById('modalProductSeller')) document.getElementById('modalProductSeller').textContent = p.seller;
    if (document.getElementById('modalProductRating')) document.getElementById('modalProductRating').textContent = p.rating;
    if (document.getElementById('modalProductImg')) document.getElementById('modalProductImg').src = p.img;
    if (document.getElementById('modalProductDesc')) document.getElementById('modalProductDesc').textContent = p.desc;

    openModal('modalProduct');
  };

  // --- 8. Interactive Map & Cluster Filtering System ---
  const mapData = {
    buaran: {
      title: "Pusat Klaster Batik Buaran",
      tag: "Pusat Utama",
      location: "Buaran, Kab. Pekalongan",
      umkm: "150+",
      gb: "45+",
      pointer: "150",
      region: "Pekalongan Selatan",
      img: "image/gallery/doc_canting.png",
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
      img: "image/gallery/doc_pewarnaan.png",
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
      img: "image/gallery/doc_penjemuran.png",
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
      img: "image/gallery/doc_pameran.png",
      waText: "Halo Tim BatikNusa, saya ingin berkonsultasi mengenai platform BatikNusa.",
      iframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63354.76483489812!2d109.6465494!3d-6.9080277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70258cb7d6c6e7%3A0x4027a76e352f750!2sPekalongan%2C%20Pekalongan%20City%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
    }
  };

  const servicePhotos = {
    katalog: "image/products/prod_jlamprang.png",
    patungan: "image/products/prod_sekar_jagad.png",
    konsultasi: "image/backgrounds/about_klaster.png"
  };

  function updateMapSection(locationKey, serviceKey = 'all', notify = true, triggerSource = 'location') {
    const data = mapData[locationKey] || mapData['all'];

    // Select dynamic photo: Location photos ALWAYS take priority when pin or location select is used!
    let cardPhoto = data.img;
    if (triggerSource === 'service' && serviceKey && servicePhotos[serviceKey]) {
      cardPhoto = servicePhotos[serviceKey];
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
      // Pop up card on desktop when pin marker or filter is used
      card.classList.add('active');
      card.style.opacity = '0.3';
      card.style.transform = 'translate(-50%, -46%) scale(0.95)';
      setTimeout(() => {
        if (cardImg) cardImg.src = cardPhoto;
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

  // Bind Close Button on Map Card (Desktop Pop-up close)
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

  // --- 9. Mobile Testimonial Carousel Centering & Dynamic Focus Observer ---
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

});

// --- 10. Consultation & Registration Modal Form Handler ---
function handleConsultationSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('consultName') ? document.getElementById('consultName').value : '';
  const brand = document.getElementById('consultBrand') ? document.getElementById('consultBrand').value : '';
  const region = document.getElementById('consultRegion') ? document.getElementById('consultRegion').value : '';
  const service = document.getElementById('consultService') ? document.getElementById('consultService').value : '';
  const wa = document.getElementById('consultWa') ? document.getElementById('consultWa').value : '';

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
}

// --- 11. Open Dedicated Product Order Form ---
window.openConsultationForProduct = function(productId) {
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

    if (img) img.src = window.activeProductData.img;
    if (badge) badge.textContent = window.activeProductData.badge;
    if (title) title.textContent = window.activeProductData.name;
    if (seller) seller.textContent = window.activeProductData.seller;
    if (price) price.textContent = window.activeProductData.price;
  }

  setTimeout(() => {
    openModal('modalProductOrder');
  }, 150);
};

// --- 12. Product Order Form Submit Handler ---
window.handleProductOrderSubmit = function(e) {
  e.preventDefault();
  const buyerName = document.getElementById('orderBuyerName') ? document.getElementById('orderBuyerName').value : '';
  const qty = document.getElementById('orderQty') ? document.getElementById('orderQty').value : '1';
  const wa = document.getElementById('orderWa') ? document.getElementById('orderWa').value : '';
  const city = document.getElementById('orderCity') ? document.getElementById('orderCity').value : '';
  const note = document.getElementById('orderNote') ? document.getElementById('orderNote').value : '-';

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
};
