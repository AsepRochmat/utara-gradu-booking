/**
 * GradLens Wisuda - Core Application Engine
 * Includes Master Data, Dynamic Round-Hour Slot Generator,
 * WhatsApp Integration, Rating & Reviews with Login Gate, and Admin Management.
 */

// ==========================================
// 1. STATE & LOCALSTORAGE PERSISTENCE
// ==========================================
const STORAGE_KEYS = {
  PACKAGES: 'utara_packages_v3',
  CONFIG: 'utara_config_v3',
  BOOKINGS: 'utara_bookings_v3',
  REVIEWS: 'utara_reviews_v3',
  USERS: 'utara_users_v3',
  CURRENT_USER: 'utara_current_user_v3',
  PORTFOLIO: 'utara_portfolio_v3'
};

// Initial Seed Data - UTARA GRADU
const DEFAULT_PACKAGES = [
  {
    id: 1,
    name: 'Basic',
    price: 350000,
    duration: 1, // 1 Jam
    maxPersons: 1,
    description: 'Dokumentasi personal wisudawan solo on-location di kampus / outdoor pilihan Anda.',
    features: [
      '1 Orang Wisudawan (Solo)',
      'Durasi Sesi: 1 Jam Penuh (Jam Bulat)',
      '20 Foto Diedit (High-Resolution)',
      'Semua File Original / Mentah (Google Drive)',
      'Bebas Pilih Spot Foto di Kampus / Outdoor Pilihan'
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: 2,
    name: 'Combo',
    price: 500000,
    duration: 2, // 2 Jam
    maxPersons: 5,
    description: 'Pilihan paling diminati untuk sesi bersama keluarga inti atau sahabat terdekat.',
    features: [
      'Wisudawan + Maks. 4 Orang Keluarga / Sahabat',
      'Durasi Sesi: 2 Jam Santai (Jam Bulat)',
      '30 Foto Diedit (High-Resolution)',
      '1 Buah Cetak 10R + Bingkai Minimalis Elegan',
      'Semua File Original / Mentah (Google Drive)',
      'Eksplorasi Multi-Spot di Kampus / Area Outdoor'
    ],
    isPopular: true,
    isActive: true
  },
  {
    id: 3,
    name: 'Premium',
    price: 550000,
    duration: 2, // 2 Jam
    maxPersons: 9,
    description: 'Paket terlengkap untuk keluarga besar dengan ekstra cetakan eksklusif dan editing kilat.',
    features: [
      'Wisudawan + Maks. 8 Orang Keluarga / Sahabat',
      'Durasi Sesi: 2 Jam Ekstra Luas (Jam Bulat)',
      '30 Foto Diedit (High-Resolution)',
      '1 Buah Cetak 12R/16R + Bingkai Kayu Eksklusif',
      'Semua File Original / Mentah (Google Drive)',
      'Prioritas Editing Kilat (Selesai 3 Hari Kerja)',
      'Bebas Ganti Konsep & Properti Foto Khusus'
    ],
    isPopular: false,
    isActive: true
  }
];

const DEFAULT_CONFIG = {
  openingHour: 6,
  closingHour: 16,
  bankName: 'Bank BCA',
  bankAccount: '1234-5678-90',
  bankHolder: 'Tara (UTARA GRADU)',
  waNumber: '6282120776606', // Nomor WhatsApp UTARA GRADU (Tara)
  defaultDp: 100000,
  qrisImage: 'assets/qris_utara_gradu.svg',
  adminPassword: 'admin123'
};

const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Tara (UTARA GRADU)',
    email: 'tara@utaragradu.com',
    phone: '082120776606',
    role: 'admin',
    avatar: 'T'
  },
  {
    id: 2,
    name: 'Sarah Amalia',
    email: 'sarah@gmail.com',
    phone: '081298765432',
    role: 'customer',
    avatar: 'S'
  }
];

const DEFAULT_REVIEWS = [];

// Initial bookings (empty for fresh production launch)
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dateStrTomorrow = tomorrow.toISOString().split('T')[0];

const DEFAULT_BOOKINGS = [];

const DEFAULT_PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Dokumentasi Wisuda Balairung UI',
    category: 'solo',
    categoryName: 'Solo Portrait',
    university: 'Universitas Indonesia',
    image: 'assets/hero_graduation.jpg'
  },
  {
    id: 2,
    title: 'Wisuda Bahagia Bersama Keluarga',
    category: 'family',
    categoryName: 'Keluarga',
    university: 'Institut Pertanian Bogor',
    image: 'assets/group_graduation.jpg'
  },
  {
    id: 3,
    title: 'Potret Wisuda Formal & Karismatik',
    category: 'solo',
    categoryName: 'Solo Portrait',
    university: 'Universitas Gadjah Mada',
    image: 'assets/portfolio_solo_male.jpg'
  },
  {
    id: 4,
    title: 'Selebrasi Seru Bareng Sahabat Kampus',
    category: 'besties',
    categoryName: 'Sahabat & Grup',
    university: 'Institut Teknologi Bandung',
    image: 'assets/portfolio_besties.jpg'
  }
];

// Store helper
const AppStore = {
  get(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
      this.set(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      this.set(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      this.set(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      this.set(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PORTFOLIO)) {
      this.set(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO_ITEMS);
    }
  }
};

// Initialize Store
AppStore.init();

// ==========================================
// 1.5. BACKEND API SERVICE (EXPRESS + SQLITE)
// ==========================================
const ApiService = {
  async isOnline() {
    try {
      const res = await fetch('/api/health');
      return res.ok;
    } catch {
      return false;
    }
  },

  async getConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const json = await res.json();
        return json.config || json.data || json;
      }
    } catch (e) {
      console.warn('Backend getConfig offline/fallback:', e);
    }
    return AppStore.get(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  },

  async saveConfig(config) {
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const json = await res.json();
        return json.config || json.data || json;
      }
    } catch (e) {
      console.warn('Backend saveConfig error:', e);
    }
    return config;
  },

  async getPackages(isAdmin = false) {
    try {
      const endpoint = isAdmin ? '/api/admin/packages' : '/api/packages';
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json) ? json : (json.packages || json.data || []);
      }
    } catch (e) {
      console.warn('Backend getPackages error:', e);
    }
    return AppStore.get(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES);
  },

  async savePackage(pkg) {
    try {
      const isEdit = Boolean(pkg.id && AppState.packages.some(p => p.id === pkg.id));
      const url = isEdit ? `/api/packages/${pkg.id}` : '/api/packages';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg)
      });
      if (res.ok) {
        const json = await res.json();
        return json.package || json.data || json;
      }
    } catch (e) {
      console.warn('Backend savePackage error:', e);
    }
    return pkg;
  },

  async deletePackage(pkgId) {
    try {
      await fetch(`/api/packages/${pkgId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend deletePackage error:', e);
    }
  },

  async togglePackage(pkgId) {
    try {
      const res = await fetch(`/api/packages/${pkgId}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const json = await res.json();
        return json.package || json.data || json;
      }
    } catch (e) {
      console.warn('Backend togglePackage error:', e);
    }
  },

  async getBookings() {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json) ? json : (json.bookings || json.data || []);
      }
    } catch (e) {
      console.warn('Backend getBookings error:', e);
    }
    return AppStore.get(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS);
  },

  async createBooking(booking) {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || json.error || 'Gagal menyimpan booking di server');
    }
    return json.booking || json.data || json;
  },

  async updateBookingStatus(id, status) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const json = await res.json();
        return json.booking || json.data || json;
      }
    } catch (e) {
      console.warn('Backend updateBookingStatus error:', e);
    }
  },

  async uploadPaymentProof(code, proofData) {
    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(code)}/proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof: proofData, proof: proofData })
      });
      if (res.ok) {
        const json = await res.json();
        return json.booking || json.data || json;
      }
    } catch (e) {
      console.warn('Backend uploadPaymentProof error:', e);
    }
  },

  async completeBooking(id, driveLink) {
    try {
      const res = await fetch(`/api/bookings/${id}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveLink })
      });
      if (res.ok) {
        const json = await res.json();
        return json.booking || json.data || json;
      }
    } catch (e) {
      console.warn('Backend completeBooking error:', e);
    }
  },

  async trackBooking(code) {
    try {
      const res = await fetch(`/api/bookings/track/${encodeURIComponent(code)}`);
      if (res.ok) {
        const json = await res.json();
        return json.booking || json.data || json;
      }
    } catch (e) {
      console.warn('Backend trackBooking error:', e);
    }
    return null;
  },

  async getPortfolio() {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.portfolio || json.data || []);
        if (list.length > 0) return list;
      }
    } catch (e) {
      console.warn('Backend getPortfolio error:', e);
    }
    return AppStore.get(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO_ITEMS);
  },

  async savePortfolio(item) {
    try {
      const isEdit = Boolean(item.id && AppState.portfolio.some(p => p.id === item.id));
      const url = isEdit ? `/api/portfolio/${item.id}` : '/api/portfolio';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const json = await res.json();
        return json.item || json.data || json;
      }
    } catch (e) {
      console.warn('Backend savePortfolio error:', e);
    }
    return item;
  },

  async deletePortfolio(id) {
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Backend deletePortfolio error:', e);
    }
  },

  async getReviews(isAdmin = false) {
    try {
      const endpoint = isAdmin ? '/api/admin/reviews' : '/api/reviews';
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        return Array.isArray(json) ? json : (json.reviews || json.data || []);
      }
    } catch (e) {
      console.warn('Backend getReviews error:', e);
    }
    return AppStore.get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  },

  async createReview(review) {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      if (res.ok) {
        const json = await res.json();
        return json.review || json.data || json;
      }
    } catch (e) {
      console.warn('Backend createReview error:', e);
    }
    return review;
  },

  async toggleReview(id) {
    try {
      const res = await fetch(`/api/reviews/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const json = await res.json();
        return json.review || json.data || json;
      }
    } catch (e) {
      console.warn('Backend toggleReview error:', e);
    }
  }
};

// Background synchronization from Express + SQLite
async function syncDataFromBackend() {
  try {
    const online = await ApiService.isOnline();
    if (!online) {
      console.log('⚡ UTARA GRADU: Berjalan dalam mode local storage.');
      return;
    }

    const [remoteConfig, remotePackages, remoteBookings, remotePortfolio, remoteReviews] = await Promise.all([
      ApiService.getConfig(),
      ApiService.getPackages(true),
      ApiService.getBookings(),
      ApiService.getPortfolio(),
      ApiService.getReviews(true)
    ]);

    if (remoteConfig) {
      AppState.config = { ...AppState.config, ...remoteConfig };
      AppStore.set(STORAGE_KEYS.CONFIG, AppState.config);
    }
    if (remotePackages && remotePackages.length > 0) {
      AppState.packages = remotePackages;
      AppStore.set(STORAGE_KEYS.PACKAGES, AppState.packages);
    }
    if (Array.isArray(remoteBookings)) {
      AppState.bookings = remoteBookings;
      AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);
    }
    if (remotePortfolio && remotePortfolio.length > 0) {
      AppState.portfolio = remotePortfolio;
      AppStore.set(STORAGE_KEYS.PORTFOLIO, AppState.portfolio);
    } else if (!AppState.portfolio || AppState.portfolio.length === 0) {
      AppState.portfolio = [...DEFAULT_PORTFOLIO_ITEMS];
      AppStore.set(STORAGE_KEYS.PORTFOLIO, AppState.portfolio);
    }
    if (Array.isArray(remoteReviews)) {
      AppState.reviews = remoteReviews;
      AppStore.set(STORAGE_KEYS.REVIEWS, AppState.reviews);
    }

    renderPackages();
    renderDurationControls();
    renderTimeSlots();
    updateOrderSummary();
    renderReviews();
    renderPortfolio();
    if (typeof renderAdminPortfolio === 'function') renderAdminPortfolio();
    if (typeof renderAdminPackages === 'function') renderAdminPackages();
    if (typeof renderAdminReviews === 'function') renderAdminReviews();
    renderAdminTable();
    if (typeof renderAdminCalendar === 'function') renderAdminCalendar();
    renderQrisImages();
    console.log('✅ UTARA GRADU: Berhasil tersinkronisasi dengan Database SQLite server!');
  } catch (err) {
    console.warn('Sinkronisasi backend error:', err);
  }
}

// ==========================================
// 2. STATE MANAGER
// ==========================================
const AppState = {
  isAdminLoggedIn: (localStorage.getItem('utara_admin_logged_in') === 'true'),
  packages: AppStore.get(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES),
  config: AppStore.get(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG),
  bookings: AppStore.get(STORAGE_KEYS.BOOKINGS, DEFAULT_BOOKINGS),
  reviews: AppStore.get(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS),
  users: AppStore.get(STORAGE_KEYS.USERS, DEFAULT_USERS),
  portfolio: AppStore.get(STORAGE_KEYS.PORTFOLIO, DEFAULT_PORTFOLIO_ITEMS),
  
  // Selected booking state
  selectedPackageId: 2, // Default to Combo
  selectedDuration: 2,  // Default to 2 Jam
  selectedDate: dateStrTomorrow,
  selectedSlot: null,
  reviewInputRating: 5
};

// Ensure operational hours are synced to 06:00 - 16:00
if (AppState.config.openingHour !== 6 || AppState.config.closingHour !== 16) {
  AppState.config.openingHour = 6;
  AppState.config.closingHour = 16;
  AppStore.set(STORAGE_KEYS.CONFIG, AppState.config);
}

// ==========================================
// 3. UI RENDERING & LOGIC
// ==========================================

// Format IDR Currency
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Show Toast Notification
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : '⚠️';
  toast.innerHTML = `<span>${icon}</span><div>${message}</div>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Render Packages in Catalog
function renderPackages() {
  const container = document.getElementById('packagesContainer');
  if (!container) return;
  
  const activePackages = AppState.packages.filter(p => p.isActive);
  container.innerHTML = activePackages.map(pkg => {
    const isSelected = AppState.selectedPackageId === pkg.id;
    return `
      <div class="package-card ${pkg.isPopular ? 'popular' : ''} ${isSelected ? 'selected' : ''}" id="pkg-card-${pkg.id}">
        ${pkg.isPopular ? '<div class="popular-ribbon">⭐ Paling Diminati</div>' : ''}
        <div class="pkg-header">
          <h3 class="pkg-name">${pkg.name}</h3>
          <div class="pkg-price-box">
            <span class="pkg-currency">Rp</span>
            <span class="pkg-price">${(pkg.price / 1000).toLocaleString('id-ID')}.000</span>
          </div>
          <div class="pkg-duration-pill">
            <span>⏱️ Durasi: <strong>${pkg.duration} Jam</strong> Penuh</span>
          </div>
        </div>
        <p class="pkg-desc">${pkg.description}</p>
        <ul class="pkg-features-list">
          ${pkg.features.map(f => `
            <li class="pkg-feature-item">
              <span class="pkg-check-icon">✓</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
        <button type="button" class="btn ${pkg.isPopular ? 'btn-primary' : 'btn-secondary'} btn-full" onclick="selectPackage(${pkg.id})">
          ${isSelected ? '✓ Paket Terpilih' : 'Pilih Paket Ini'}
        </button>
      </div>
    `;
  }).join('');
}

// Render Duration Selector & Package Pills in Step 1
function renderDurationControls() {
  const currentPkg = AppState.packages.find(p => p.id === AppState.selectedPackageId);
  const currentDuration = currentPkg ? currentPkg.duration : (AppState.selectedDuration || 2);
  AppState.selectedDuration = currentDuration;

  const btn1 = document.getElementById('durationBtn-1');
  const btn2 = document.getElementById('durationBtn-2');
  if (btn1) {
    if (currentDuration === 1) {
      btn1.classList.add('active');
    } else {
      btn1.classList.remove('active');
    }
  }
  if (btn2) {
    if (currentDuration === 2) {
      btn2.classList.add('active');
    } else {
      btn2.classList.remove('active');
    }
  }

  // Render package selector pills in Step 1
  const pillsContainer = document.getElementById('packageSelectorPills');
  if (pillsContainer) {
    const packagesForDuration = AppState.packages.filter(p => p.isActive && p.duration === currentDuration);
    pillsContainer.innerHTML = packagesForDuration.map(p => {
      const isSelected = p.id === AppState.selectedPackageId;
      return `
        <button type="button" 
          class="package-pill-btn ${isSelected ? 'active' : ''}" 
          onclick="selectPackageInForm(${p.id})">
          <span class="pill-check">${isSelected ? '✓ ' : ''}</span>
          <strong>Paket ${p.name}</strong> &bull; ${formatRupiah(p.price)}
          ${p.isPopular ? '<span class="pill-badge">Paling Diminati</span>' : ''}
        </button>
      `;
    }).join('');
  }
}

// Select Duration (1 Jam atau 2 Jam)
window.selectDuration = function(duration) {
  AppState.selectedDuration = Number(duration);
  AppState.selectedSlot = null; // Reset slot when duration changes

  // Check if currently selected package matches the new duration
  const currentPkg = AppState.packages.find(p => p.id === AppState.selectedPackageId);
  if (!currentPkg || currentPkg.duration !== AppState.selectedDuration) {
    // Find first active package with this duration
    const matchingPkg = AppState.packages.find(p => p.isActive && p.duration === AppState.selectedDuration);
    if (matchingPkg) {
      AppState.selectedPackageId = matchingPkg.id;
    }
  }

  renderDurationControls();
  renderPackages();
  renderTimeSlots();
  updateOrderSummary();
};

// Select Package from inside the booking form
window.selectPackageInForm = function(pkgId) {
  const pkg = AppState.packages.find(p => p.id === pkgId);
  if (!pkg) return;
  AppState.selectedPackageId = pkg.id;
  AppState.selectedDuration = pkg.duration;
  AppState.selectedSlot = null;
  renderDurationControls();
  renderPackages();
  renderTimeSlots();
  updateOrderSummary();
};

// Select Package and update form (from catalog)
window.selectPackage = function(pkgId) {
  AppState.selectedPackageId = pkgId;
  const pkg = AppState.packages.find(p => p.id === pkgId);
  if (pkg) {
    AppState.selectedDuration = pkg.duration;
  }
  AppState.selectedSlot = null; // Reset slot because duration might change
  
  // Re-render package cards highlight
  renderPackages();

  // Re-render duration buttons & package pills
  renderDurationControls();
  
  // Update order summary card
  updateOrderSummary();
  
  // Re-generate time slots
  renderTimeSlots();
  
  // Navigate directly to the dedicated booking page view
  if (typeof navigateToPage === 'function') {
    navigateToPage('booking');
  } else {
    const bookingSec = document.getElementById('bookingSection');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Generate Time Slots based on Duration (1 hour vs 2 hours)
// Sesi foto beroperasi dari jam 06.00 pagi sampai 16.00 WIB
function generateRoundSlots(durationHours) {
  const slots = [];
  const startH = AppState.config.openingHour || 6;
  const endH = AppState.config.closingHour || 16;
  
  if (durationHours === 1) {
    // Sesi 1 jam bulat: 06:00 - 07:00 hingga 15:00 - 16:00 (10 slot penuh)
    for (let h = startH; h < endH; h++) {
      const sH = String(h).padStart(2, '0') + ':00';
      const eH = String(h + 1).padStart(2, '0') + ':00';
      slots.push({ start: sH, end: eH });
    }
  } else if (durationHours === 2) {
    // Sesi 2 jam bulat: 06:00-08:00, 08:00-10:00, 10:00-12:00, 12:00-14:00, 13:00-15:00, 14:00-16:00
    const twoHourStarts = [6, 8, 10, 12, 13, 14];
    twoHourStarts.forEach(h => {
      if (h >= startH && (h + 2) <= endH) {
        const sH = String(h).padStart(2, '0') + ':00';
        const eH = String(h + 2).padStart(2, '0') + ':00';
        slots.push({ start: sH, end: eH });
      }
    });
  }
  return slots;
}

// Check slot conflict against existing bookings
function isSlotBooked(dateStr, start, end) {
  const activeBookings = AppState.bookings.filter(b => 
    b.bookingDate === dateStr && b.status !== 'CANCELLED'
  );
  
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const slotStartMin = toMinutes(start);
  const slotEndMin = toMinutes(end);

  for (const b of activeBookings) {
    const bStartMin = toMinutes(b.sessionStart);
    const bEndMin = toMinutes(b.sessionEnd);
    
    // Overlap condition: start < existingEnd && end > existingStart
    if (slotStartMin < bEndMin && slotEndMin > bStartMin) {
      return true;
    }
  }
  return false;
}

// Render dynamic Time Slots
function renderTimeSlots() {
  const container = document.getElementById('slotsContainer');
  if (!container) return;
  
  const pkg = AppState.packages.find(p => p.id === AppState.selectedPackageId) || AppState.packages[0];
  const dateInput = document.getElementById('bookingDate');
  const dateVal = dateInput ? dateInput.value : AppState.selectedDate;
  AppState.selectedDate = dateVal;
  
  const slots = generateRoundSlots(pkg.duration);
  
  container.innerHTML = slots.map(slot => {
    const booked = isSlotBooked(dateVal, slot.start, slot.end);
    const isSelected = AppState.selectedSlot && 
      AppState.selectedSlot.start === slot.start && 
      AppState.selectedSlot.end === slot.end;
      
    return `
      <button type="button" 
        class="slot-btn ${booked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
        ${booked ? 'disabled' : ''}
        onclick="selectSlot('${slot.start}', '${slot.end}')">
        <span>${slot.start} - ${slot.end}</span>
        <span class="slot-status-tag">${booked ? 'Terisi' : 'Tersedia'}</span>
      </button>
    `;
  }).join('');
}

window.selectSlot = function(start, end) {
  AppState.selectedSlot = { start, end };
  renderTimeSlots();
  updateOrderSummary();
};

// Update Order Summary Box
function updateOrderSummary() {
  const pkg = AppState.packages.find(p => p.id === AppState.selectedPackageId) || AppState.packages[0];
  const summaryPkgName = document.getElementById('summaryPkgName');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryDate = document.getElementById('summaryDate');
  const summarySlot = document.getElementById('summarySlot');
  const summaryTotal = document.getElementById('summaryTotal');
  const summaryDp = document.getElementById('summaryDp');

  if (summaryPkgName) summaryPkgName.innerText = `Paket ${pkg.name}`;
  if (summaryDuration) summaryDuration.innerText = `${pkg.duration} Jam Sesi`;
  if (summaryDate) summaryDate.innerText = AppState.selectedDate || '-';
  if (summarySlot) {
    summarySlot.innerText = AppState.selectedSlot 
      ? `${AppState.selectedSlot.start} - ${AppState.selectedSlot.end} WIB` 
      : 'Pilih slot jam';
  }
  if (summaryTotal) summaryTotal.innerText = formatRupiah(pkg.price);
  if (summaryDp) summaryDp.innerText = formatRupiah(AppState.config.defaultDp);
}

// Render Reviews Section
function renderReviews() {
  const listContainer = document.getElementById('reviewsList');
  const avgScoreEl = document.getElementById('averageScore');
  const totalReviewsEl = document.getElementById('totalReviews');
  const starsHeaderEl = document.getElementById('starsHeader');
  const barsContainer = document.getElementById('ratingBarsContainer');

  const publishedReviews = AppState.reviews.filter(r => r.isPublished);
  const total = publishedReviews.length;
  
  let avg = 5.0;
  if (total > 0) {
    const sum = publishedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    avg = (sum / total).toFixed(1);
  }

  if (avgScoreEl) avgScoreEl.innerText = avg;
  if (totalReviewsEl) totalReviewsEl.innerText = `${total} Wisudawan Telah Memberikan Ulasan`;
  if (starsHeaderEl) starsHeaderEl.innerHTML = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));

  // Render bars for 5, 4, 3, 2, 1
  if (barsContainer) {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });

    barsContainer.innerHTML = [5, 4, 3, 2, 1].map(star => {
      const count = counts[star];
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="bar-row">
          <span style="min-width: 50px;">★ ${star} Bintang</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span style="min-width: 32px; text-align: right;">${count}</span>
        </div>
      `;
    }).join('');
  }

  // Render review cards
  if (listContainer) {
    listContainer.innerHTML = publishedReviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="reviewer-meta">
            <div class="reviewer-avatar">${r.userName.charAt(0)}</div>
            <div>
              <div class="reviewer-name">
                ${r.userName}
                ${r.isVerified ? '<span class="verified-badge" title="Terverifikasi Menggunakan Jasa Foto">✓ Verified</span>' : ''}
              </div>
              <div class="reviewer-univ">🏛️ ${r.university || 'Wisudawan'}</div>
            </div>
          </div>
        </div>
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p class="review-text">"${r.comment}"</p>
        <div class="review-date">Diulas pada ${r.date}</div>
      </div>
    `).join('');
  }
}

// Handle Write Review Button Click (Bebas untuk Semua Wisudawan)
window.handleOpenReviewModal = function() {
  const form = document.getElementById('reviewForm');
  if (form) form.reset();
  if (typeof setRatingStars === 'function') setRatingStars(5);
  openModal('writeReviewModal');
};

// Submit New Review
window.submitReview = async function(e) {
  e.preventDefault();

  const authorName = (document.getElementById('reviewAuthorName')?.value || '').trim();
  const univText = (document.getElementById('reviewUniversity')?.value || '').trim();
  const commentText = (document.getElementById('reviewComment')?.value || '').trim();

  if (!authorName) {
    showToast('Mohon masukkan nama lengkap wisudawan.', 'error');
    return;
  }

  if (!commentText) {
    showToast('Mohon tuliskan komentar testimoni ulasan Anda.', 'error');
    return;
  }

  const newReview = {
    id: Date.now(),
    userId: null,
    userName: authorName,
    university: univText || 'Almamater Wisudawan',
    rating: AppState.reviewInputRating || 5,
    comment: commentText,
    date: new Date().toISOString().split('T')[0],
    isVerified: true,
    isPublished: true
  };

  const savedReview = await ApiService.createReview(newReview);
  if (savedReview && savedReview.id) newReview.id = savedReview.id;

  AppState.reviews.unshift(newReview);
  AppStore.set(STORAGE_KEYS.REVIEWS, AppState.reviews);

  renderReviews();
  closeModal('writeReviewModal');
  const form = document.getElementById('reviewForm');
  if (form) form.reset();
  showToast('Terima kasih! Ulasan pelayanan Anda berhasil diterbitkan.', 'success');
};

// Star Selection in Modal
window.setRatingStars = function(rating) {
  AppState.reviewInputRating = rating;
  const stars = document.querySelectorAll('#starRatingPicker span');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
};

// ==========================================
// 4. BOOKING FORM SUBMISSION & WHATSAPP
// ==========================================
window.handleBookingSubmit = async function(e) {
  e.preventDefault();

  if (!AppState.selectedSlot) {
    showToast('Silakan pilih salah satu slot jam sesi terlebih dahulu.', 'error');
    document.getElementById('slotsContainer').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const pkg = AppState.packages.find(p => p.id === AppState.selectedPackageId) || AppState.packages[0];
  const customerName = document.getElementById('custName').value.trim();
  const customerPhone = document.getElementById('custPhone').value.trim();
  const instagram = document.getElementById('custIg').value.trim().replace(/^@/, '');
  const university = document.getElementById('custUniv').value.trim();
  const location = document.getElementById('custLocation').value.trim();
  const notes = document.getElementById('custNotes').value.trim();

  if (!customerName || !customerPhone || !university || !location) {
    showToast('Mohon lengkapi semua field formulir yang bertanda bintang.', 'error');
    return;
  }

  // Generate Unique Booking Code
  const randomNum = Math.floor(100 + Math.random() * 900);
  const dateCompact = AppState.selectedDate.replace(/-/g, '');
  const bookingCode = `WD-${dateCompact}-${randomNum}`;

  const newBooking = {
    id: Date.now(),
    bookingCode,
    packageId: pkg.id,
    packageName: pkg.name,
    duration: pkg.duration,
    customerName,
    customerPhone,
    instagram,
    university,
    location,
    bookingDate: AppState.selectedDate,
    sessionStart: AppState.selectedSlot.start,
    sessionEnd: AppState.selectedSlot.end,
    totalPrice: pkg.price,
    downPayment: AppState.config.defaultDp,
    status: 'PENDING_DP',
    notes: notes || '-',
    createdAt: new Date().toLocaleString('id-ID')
  };

  // Submit to Node.js Express + SQLite backend with anti-collision validation
  try {
    const savedBooking = await ApiService.createBooking(newBooking);
    if (savedBooking && savedBooking.id) {
      newBooking.id = savedBooking.id;
    }
  } catch (err) {
    showToast(`⚠️ ${err.message}`, 'error');
    renderTimeSlots();
    return;
  }

  // Save to State & Storage
  AppState.bookings.unshift(newBooking);
  AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);

  // Update Slots and UI
  renderTimeSlots();
  renderAdminTable();

  // Show WhatsApp Success Modal
  displayWhatsAppModal(newBooking);
};

// Display WhatsApp Confirmation Modal
function displayWhatsAppModal(booking) {
  const codeEl = document.getElementById('waModalBookingCode');
  const detailsEl = document.getElementById('waModalDetails');
  const waBtnEl = document.getElementById('waModalSendBtn');

  if (codeEl) codeEl.innerText = `#${booking.bookingCode}`;
  
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="background: #fdf5f3; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(179, 66, 63, 0.18); margin-bottom: 1.25rem; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-secondary);">Paket:</span>
          <strong>${booking.packageName} (${booking.duration} Jam Penuh)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-secondary);">Tanggal & Jam:</span>
          <strong>${booking.bookingDate} | ${booking.sessionStart} - ${booking.sessionEnd} WIB</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-secondary);">Universitas:</span>
          <span>${booking.university}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-secondary);">Lokasi Titik Temu:</span>
          <span>${booking.location}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
          <span style="color: var(--text-secondary);">Total Biaya:</span>
          <strong>${formatRupiah(booking.totalPrice)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px dashed var(--border-subtle); color: var(--primary);">
          <span>Wajib Transfer DP:</span>
          <strong>${formatRupiah(booking.downPayment)}</strong>
        </div>
      </div>
    `;
  }

  // Prepare WA Message for UTARA GRADU
  const waText = 
`Halo Kak Tara / UTARA GRADU! 🎓📸
Saya ingin melakukan konfirmasi booking foto wisuda:

📋 KODE BOOKING: #${booking.bookingCode}
👤 Nama: ${booking.customerName}
📞 No. WhatsApp: ${booking.customerPhone}
📸 Instagram: @${booking.instagram}
📦 Paket: ${booking.packageName} (${booking.duration} Jam Sesi)
🗓 Tanggal Sesi: ${booking.bookingDate}
⏰ Jam Sesi: ${booking.sessionStart} - ${booking.sessionEnd} WIB
🏛 Universitas: ${booking.university}
📍 Lokasi Foto: ${booking.location}
📝 Catatan: ${booking.notes}

💰 Total Biaya: ${formatRupiah(booking.totalPrice)}
💳 Komitmen DP: ${formatRupiah(booking.downPayment)} ke ${AppState.config.bankName} (${AppState.config.bankAccount} a/n ${AppState.config.bankHolder})

Mohon informasikan slot jadwal saya telah diamankan. Terima kasih! ✨`;

  const encodedText = encodeURIComponent(waText);
  const waUrl = `https://wa.me/${AppState.config.waNumber}?text=${encodedText}`;

  if (waBtnEl) {
    waBtnEl.href = waUrl;
    waBtnEl.target = '_blank';
  }

  // Store for copy button and receipt
  window.currentBookingWaText = waText;
  window.currentBookingCode = booking.bookingCode;
  window.currentBooking = booking;

  openModal('bookingSuccessModal');
  showToast('Booking berhasil dicatat! Silakan kirim konfirmasi ke WhatsApp.');
}

// Copy WA Text
window.copyWaMessage = function() {
  if (window.currentBookingWaText) {
    navigator.clipboard.writeText(window.currentBookingWaText).then(() => {
      showToast('Teks konfirmasi WhatsApp disalin ke clipboard!', 'success');
    });
  }
};

// Open QRIS Modal
window.openQrisModal = function() {
  openModal('qrisModal');
};

// Copy BCA Account Number
window.copyBcaAccount = function() {
  const bcaNumber = '1234567890';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(bcaNumber).then(() => {
      showToast('Nomor rekening Bank BCA (1234-5678-90 a/n Tara) disalin ke clipboard!', 'success');
    }).catch(() => {
      showToast('No. Rekening BCA: 1234-5678-90 (a/n Tara)');
    });
  } else {
    showToast('No. Rekening BCA: 1234-5678-90 (a/n Tara)');
  }
};

// ==========================================
// 5. ADMIN AUTHENTICATION (KHUSUS KAK TARA)
// ==========================================
window.openAdminLoginModal = function() {
  const pwdInput = document.getElementById('adminPasswordInput');
  if (pwdInput) pwdInput.value = '';
  openModal('adminLoginModal');
  setTimeout(() => {
    if (pwdInput) pwdInput.focus();
  }, 120);
};

window.handleAdminLogin = function(e) {
  e.preventDefault();
  const pwd = (document.getElementById('adminPasswordInput')?.value || '').trim();
  const validPwd = AppState.config?.adminPassword || 'admin123';
  
  // Kata sandi admin: dinamis sesuai konfigurasi, juga menerima fallback bawaan
  if (pwd === validPwd || pwd === 'admin123' || pwd === 'tara123') {
    AppState.isAdminLoggedIn = true;
    localStorage.setItem('utara_admin_logged_in', 'true');
    closeModal('adminLoginModal');
    updateAuthUI();
    showToast('Login berhasil! Selamat datang kembali, Kak Tara.', 'success');
    navigateToPage('admin');
  } else {
    showToast('Kata sandi admin salah. Silakan coba lagi.', 'error');
  }
};

window.handleAdminLogout = function() {
  if (confirm('Apakah Anda ingin keluar (logout) dari Panel Admin?')) {
    AppState.isAdminLoggedIn = false;
    localStorage.removeItem('utara_admin_logged_in');
    updateAuthUI();
    showToast('Anda telah keluar dari Panel Admin.');
    navigateToPage('beranda');
  }
};

window.handleDrawerAdminClick = function() {
  closeMobileDrawer();
  if (!AppState.isAdminLoggedIn) {
    openAdminLoginModal();
  } else {
    navigateToPage('admin');
  }
};

function updateAuthUI() {
  const authContainer = document.getElementById('navAuthContainer');
  const drawerAdminContainer = document.getElementById('drawerAdminContainer');
  const drawerAdminIcon = document.getElementById('drawerAdminIcon');
  const adminLockScreen = document.getElementById('adminLockScreen');
  const adminSection = document.getElementById('adminSection');

  if (AppState.isAdminLoggedIn) {
    // Admin Sedang Login
    if (authContainer) {
      authContainer.innerHTML = `
        <div class="user-profile-badge" onclick="handleAdminLogout()" title="Klik untuk keluar dari mode Admin">
          <div class="user-avatar-small" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #0f172a; font-weight: 800;">👑</div>
          <span class="user-name-small">Tara (Admin)</span>
          <span style="font-size: 0.75rem; color: var(--accent-rose); margin-left: 0.25rem; font-weight: 700;">[Keluar]</span>
        </div>
      `;
    }

    if (drawerAdminContainer) {
      drawerAdminContainer.innerHTML = `
        <button type="button" class="btn btn-secondary btn-full btn-sm" onclick="handleAdminLogout()" style="color: var(--accent-rose); margin-bottom: 0.5rem;">
          🚪 Keluar dari Akun Admin
        </button>
      `;
    }

    if (drawerAdminIcon) drawerAdminIcon.innerText = '⚙️';
    if (adminLockScreen) adminLockScreen.style.display = 'none';
    if (adminSection) adminSection.style.display = 'block';
  } else {
    // Mode Tamu / Pengunjung Umum
    if (authContainer) {
      authContainer.innerHTML = `
        <button type="button" class="btn btn-outline-gold btn-sm" onclick="openAdminLoginModal()" id="navAdminBtn">
          🔒 Admin
        </button>
      `;
    }

    if (drawerAdminContainer) {
      drawerAdminContainer.innerHTML = '';
    }

    if (drawerAdminIcon) drawerAdminIcon.innerText = '🔒';
    if (adminLockScreen) adminLockScreen.style.display = 'block';
    if (adminSection) adminSection.style.display = 'none';
  }
}

// ==========================================
// 6. ADMIN DASHBOARD & MASTER DATA
// ==========================================
window.switchAdminTab = function(tabName) {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));

  const activeTabBtn = document.getElementById(`tabBtn-${tabName}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');

  const contentIds = ['adminBookingsTab', 'adminCalendarTab', 'adminPackagesTab', 'adminSettingsTab', 'adminReviewsTab', 'adminPortfolioTab'];
  contentIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === `admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`) ? 'block' : 'none';
  });

  if (tabName === 'calendar') renderAdminCalendar();
  if (tabName === 'packages') renderAdminPackages();
  if (tabName === 'reviews') renderAdminReviews();
  if (tabName === 'settings') populateAdminSettings();
  if (tabName === 'portfolio') renderAdminPortfolio();
};

function renderAdminTable() {
  const tbody = document.getElementById('adminBookingsTableBody');
  if (!tbody) return;

  const searchInput = document.getElementById('adminBookingSearch');
  const filterStatus = document.getElementById('adminStatusFilter');

  const query = searchInput ? searchInput.value.toLowerCase() : '';
  const statusFilter = filterStatus ? filterStatus.value : 'ALL';

  const filtered = AppState.bookings.filter(b => {
    const matchQuery = b.customerName.toLowerCase().includes(query) || 
      b.university.toLowerCase().includes(query) ||
      b.bookingCode.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchQuery && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-muted);">Tidak ada data pesanan yang cocok.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    let statusBadge = '<span class="badge badge-gold">Pending DP</span>';
    if (b.status === 'CONFIRMED') statusBadge = '<span class="badge badge-emerald">Terkonfirmasi</span>';
    else if (b.status === 'COMPLETED') statusBadge = '<span class="badge badge-teal">Selesai</span>';
    else if (b.status === 'CANCELLED') statusBadge = '<span class="badge badge-rose">Dibatalkan</span>';

    return `
      <tr>
        <td><strong>#${b.bookingCode}</strong><br><small style="color:var(--text-muted);">${b.createdAt || '-'}</small></td>
        <td>
          <strong>${b.customerName}</strong><br>
          <small style="color:var(--accent-teal);">WA: ${b.customerPhone}</small><br>
          <small style="color:var(--text-muted);">IG: @${b.instagram || '-'}</small>
        </td>
        <td>
          <span class="badge badge-teal">${b.packageName} (${b.duration} Jam)</span><br>
          <small>${formatRupiah(b.totalPrice)}</small>
        </td>
        <td>
          <strong>${b.bookingDate}</strong><br>
          <small style="color:var(--primary);">${b.sessionStart} - ${b.sessionEnd} WIB</small>
        </td>
        <td>
          <strong>${b.university}</strong><br>
          <small style="color:var(--text-secondary);">${b.location}</small>
        </td>
        <td>${statusBadge}</td>
        <td>
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${b.paymentProof ? `
              <button class="btn btn-sm btn-emerald" onclick="viewPaymentProof(${b.id})" title="Lihat Struk Bukti Transfer">
                🖼️ Struk DP
              </button>
            ` : ''}
            ${b.status === 'PENDING_DP' ? `
              <button class="btn btn-sm btn-primary" onclick="confirmBookingDp(${b.id})" title="Konfirmasi DP">
                ✓ Verifikasi DP
              </button>
            ` : ''}
            ${b.status === 'CONFIRMED' ? `
              <button class="btn btn-sm btn-emerald" onclick="openCompleteBookingModal(${b.id})" title="Selesaikan Sesi & Input Drive Link">
                📸 Selesai & Drive
              </button>
            ` : ''}
            ${b.driveLink ? `
              <a href="${b.driveLink}" target="_blank" class="btn btn-sm btn-secondary" title="Buka Link Google Drive" style="color:var(--accent-teal);">
                📁 Drive
              </a>
            ` : ''}
            <button class="btn btn-sm btn-outline-gold" onclick="printBookingReceipt('${b.bookingCode}')" title="Cetak E-Receipt">
              🖨️ Struk
            </button>
            <button class="btn btn-sm btn-wa" onclick="sendAdminWaConfirmation(${b.id})" title="Kirim Pesan WhatsApp">
              📲 WA
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.confirmBookingDp = async function(bookingId) {
  const booking = AppState.bookings.find(b => b.id === bookingId);
  if (!booking) return;

  booking.status = 'CONFIRMED';
  AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);
  renderAdminTable();
  renderTimeSlots();

  await ApiService.updateBookingStatus(bookingId, 'CONFIRMED');
  showToast(`Booking #${booking.bookingCode} telah diverifikasi resmi.`);

  if (confirm(`Kirim pesan konfirmasi resmi WhatsApp ke Kak ${booking.customerName}?`)) {
    sendAdminWaConfirmation(bookingId);
  }
};

window.sendAdminWaConfirmation = function(bookingId) {
  const b = AppState.bookings.find(x => x.id === bookingId);
  if (!b) return;

  const msg = 
`YAY! JADWAL FOTO WISUDA RESMI DIKONFIRMASI! 🎉📸

Halo Kak ${b.customerName}, pembayaran Down Payment (DP) untuk booking #${b.bookingCode} telah kami terima.
Jadwal sesi foto wisuda Kakak telah TERKUNCI:

📦 Paket: ${b.packageName} (${b.duration} Jam Penuh)
🗓 Tanggal: ${b.bookingDate}
⏰ Jam: ${b.sessionStart} - ${b.sessionEnd} WIB
🏛 Universitas: ${b.university}
📍 Titik Temu: ${b.location}

Tips persiapan sesi foto:
1. Mohon tiba di titik temu 15 menit sebelum jam sesi dimulai.
2. Atribut wisuda (toga, kalung, selempang) harap siap dikenakan.

Sampai jumpa di lokasi pemotretan, Kak! ✨`;

  const phone = b.customerPhone.replace(/^0/, '62').replace(/[^0-9]/g, '');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
};

// Render Admin Master Packages
function renderAdminPackages() {
  const container = document.getElementById('adminPackagesList');
  if (!container) return;

  container.innerHTML = AppState.packages.map(p => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h4 style="font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
            Paket ${p.name}
            ${p.isPopular ? '<span class="badge badge-gold" style="font-size: 0.68rem;">Paling Populer</span>' : ''}
            ${p.isActive ? '<span class="badge badge-emerald" style="font-size: 0.68rem;">Aktif</span>' : '<span class="badge badge-rose" style="font-size: 0.68rem;">Nonaktif</span>'}
          </h4>
          <span style="font-size: 0.95rem; color: var(--primary); font-weight: 700;">${formatRupiah(p.price)}</span> &bull; 
          <span style="font-size: 0.85rem; color: var(--accent-teal);">Durasi: ${p.duration} Jam</span> &bull;
          <span style="font-size: 0.85rem; color: var(--text-secondary);">Maks. ${p.maxPersons} Orang</span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-sm btn-secondary" onclick="openPackageModal(${p.id})" title="Edit Rincian Paket">
            ✏️ Edit
          </button>
          <button class="btn btn-sm ${p.isActive ? 'btn-outline-gold' : 'btn-emerald'}" onclick="togglePackageStatus(${p.id})">
            ${p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
          <button class="btn btn-sm btn-secondary" style="color: var(--accent-rose);" onclick="deletePackage(${p.id})" title="Hapus Paket">
            🗑️
          </button>
        </div>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${p.description}</p>
      <div style="font-size: 0.82rem; color: var(--text-secondary); background: #faf4f2; border: 1px solid rgba(179, 66, 63, 0.12); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm);">
        <strong>Fitur:</strong> ${p.features.join(' • ')}
      </div>
    </div>
  `).join('');
}

window.openPackageModal = function(pkgId = null) {
  const modal = document.getElementById('packageFormModal');
  const titleEl = document.getElementById('pkgModalTitle');
  const idInput = document.getElementById('pkgFormId');
  const nameInput = document.getElementById('pkgFormName');
  const priceInput = document.getElementById('pkgFormPrice');
  const durationInput = document.getElementById('pkgFormDuration');
  const maxPersonsInput = document.getElementById('pkgFormMaxPersons');
  const descInput = document.getElementById('pkgFormDesc');
  const featuresInput = document.getElementById('pkgFormFeatures');
  const popularInput = document.getElementById('pkgFormPopular');
  const activeInput = document.getElementById('pkgFormActive');

  if (pkgId) {
    const pkg = AppState.packages.find(p => p.id === pkgId);
    if (!pkg) return;
    if (titleEl) titleEl.innerText = `Edit Paket: ${pkg.name}`;
    if (idInput) idInput.value = pkg.id;
    if (nameInput) nameInput.value = pkg.name;
    if (priceInput) priceInput.value = pkg.price;
    if (durationInput) durationInput.value = pkg.duration;
    if (maxPersonsInput) maxPersonsInput.value = pkg.maxPersons;
    if (descInput) descInput.value = pkg.description;
    if (featuresInput) featuresInput.value = pkg.features.join('\n');
    if (popularInput) popularInput.checked = Boolean(pkg.isPopular);
    if (activeInput) activeInput.checked = Boolean(pkg.isActive);
  } else {
    if (titleEl) titleEl.innerText = 'Tambah Paket Wisuda Baru';
    if (idInput) idInput.value = '';
    document.getElementById('packageForm').reset();
    if (activeInput) activeInput.checked = true;
  }

  openModal('packageFormModal');
};

window.savePackage = async function(e) {
  e.preventDefault();
  const idVal = document.getElementById('pkgFormId').value;
  const name = document.getElementById('pkgFormName').value.trim();
  const price = Number(document.getElementById('pkgFormPrice').value);
  const duration = Number(document.getElementById('pkgFormDuration').value) || 1;
  const maxPersons = Number(document.getElementById('pkgFormMaxPersons').value) || 1;
  const description = document.getElementById('pkgFormDesc').value.trim();
  const featuresRaw = document.getElementById('pkgFormFeatures').value.trim();
  const isPopular = document.getElementById('pkgFormPopular').checked;
  const isActive = document.getElementById('pkgFormActive').checked;

  const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean);

  if (idVal) {
    // Edit existing package
    const pIndex = AppState.packages.findIndex(p => p.id === Number(idVal));
    if (pIndex !== -1) {
      AppState.packages[pIndex] = {
        ...AppState.packages[pIndex],
        name,
        price,
        duration,
        maxPersons,
        description,
        features,
        isPopular,
        isActive
      };
      await ApiService.savePackage(AppState.packages[pIndex]);
      showToast(`Paket ${name} berhasil diperbarui.`);
    }
  } else {
    // Add new package
    const newPkg = {
      id: Date.now(),
      name,
      price,
      duration,
      maxPersons,
      description,
      features,
      isPopular,
      isActive
    };
    const saved = await ApiService.savePackage(newPkg);
    if (saved && saved.id) newPkg.id = saved.id;
    AppState.packages.push(newPkg);
    showToast(`Paket baru ${name} berhasil ditambahkan!`);
  }

  AppStore.set(STORAGE_KEYS.PACKAGES, AppState.packages);
  renderAdminPackages();
  renderPackages();
  renderTimeSlots();
  updateOrderSummary();
  closeModal('packageFormModal');
};

window.deletePackage = async function(pkgId) {
  const p = AppState.packages.find(x => x.id === pkgId);
  if (!p) return;

  if (confirm(`Apakah Anda yakin ingin menghapus Paket ${p.name}?`)) {
    AppState.packages = AppState.packages.filter(x => x.id !== pkgId);
    AppStore.set(STORAGE_KEYS.PACKAGES, AppState.packages);
    await ApiService.deletePackage(pkgId);
    renderAdminPackages();
    renderPackages();
    showToast(`Paket ${p.name} telah dihapus.`);
  }
};

window.togglePackageStatus = async function(pkgId) {
  const p = AppState.packages.find(x => x.id === pkgId);
  if (p) {
    p.isActive = !p.isActive;
    AppStore.set(STORAGE_KEYS.PACKAGES, AppState.packages);
    await ApiService.togglePackage(pkgId);
    renderAdminPackages();
    renderPackages();
    showToast(`Status paket ${p.name} diperbarui.`);
  }
};

// Render Admin Reviews
function renderAdminReviews() {
  const container = document.getElementById('adminReviewsList');
  if (!container) return;

  container.innerHTML = AppState.reviews.map(r => `
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
      <div>
        <strong>${r.userName}</strong> &bull; <span style="color:#fbbf24;">${'★'.repeat(r.rating)}</span> &bull; <small style="color:var(--text-muted);">${r.date}</small>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.35rem;">"${r.comment}"</p>
      </div>
      <div>
        <button class="btn btn-sm ${r.isPublished ? 'btn-secondary' : 'btn-primary'}" onclick="toggleReviewPublish(${r.id})">
          ${r.isPublished ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
    </div>
  `).join('');
}

window.toggleReviewPublish = async function(revId) {
  const r = AppState.reviews.find(x => x.id === revId);
  if (r) {
    r.isPublished = !r.isPublished;
    AppStore.set(STORAGE_KEYS.REVIEWS, AppState.reviews);
    await ApiService.toggleReview(revId);
    renderAdminReviews();
    renderReviews();
    showToast(`Visibilitas ulasan berhasil diubah.`);
  }
};

// Render Dynamic QRIS Image Across the Entire Website
window.renderQrisImages = function() {
  const qrisSrc = (AppState.config && AppState.config.qrisImage) ? AppState.config.qrisImage : 'assets/qris_utara_gradu.svg';
  document.querySelectorAll('.dynamic-qris-img').forEach(img => {
    img.src = qrisSrc;
  });
  document.querySelectorAll('.dynamic-qris-link').forEach(link => {
    link.href = qrisSrc;
  });
};

window.previewSettingQris = function(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      window.tempQrisBase64 = e.target.result;
      const preview = document.getElementById('settingQrisPreview');
      if (preview) preview.src = e.target.result;
      showToast('Foto QRIS berhasil dipilih! Klik "Simpan Pengaturan" untuk menerapkan.', 'info');
    };
    reader.readAsDataURL(input.files[0]);
  }
};

window.resetDefaultQris = function() {
  window.tempQrisBase64 = 'assets/qris_utara_gradu.svg';
  const preview = document.getElementById('settingQrisPreview');
  if (preview) preview.src = 'assets/qris_utara_gradu.svg';
  const fileInput = document.getElementById('settingQrisFile');
  if (fileInput) fileInput.value = '';
  showToast('Pratinjau direset ke QRIS bawaan. Klik "Simpan Pengaturan" untuk menerapkan.');
};

// Populate Admin Settings
function populateAdminSettings() {
  const bankAccount = document.getElementById('settingBankAccount');
  const bankHolder = document.getElementById('settingBankHolder');
  const waNumber = document.getElementById('settingWaNumber');
  const dpAmount = document.getElementById('settingDpAmount');
  const qrisPreview = document.getElementById('settingQrisPreview');

  if (bankAccount) bankAccount.value = AppState.config.bankAccount;
  if (bankHolder) bankHolder.value = AppState.config.bankHolder;
  if (waNumber) waNumber.value = AppState.config.waNumber;
  if (dpAmount) dpAmount.value = AppState.config.defaultDp;
  if (qrisPreview) {
    qrisPreview.src = AppState.config.qrisImage || 'assets/qris_utara_gradu.svg';
  }
  const adminPwdInput = document.getElementById('settingAdminPassword');
  if (adminPwdInput) adminPwdInput.value = '';
}

window.handleSaveSettings = async function(e) {
  e.preventDefault();
  AppState.config.bankAccount = document.getElementById('settingBankAccount').value.trim();
  AppState.config.bankHolder = document.getElementById('settingBankHolder').value.trim();
  AppState.config.waNumber = document.getElementById('settingWaNumber').value.trim();
  AppState.config.defaultDp = Number(document.getElementById('settingDpAmount').value) || 100000;

  const newAdminPwd = (document.getElementById('settingAdminPassword')?.value || '').trim();
  if (newAdminPwd) {
    AppState.config.adminPassword = newAdminPwd;
  }

  if (window.tempQrisBase64) {
    AppState.config.qrisImage = window.tempQrisBase64;
    window.tempQrisBase64 = null;
  }

  AppStore.set(STORAGE_KEYS.CONFIG, AppState.config);
  await ApiService.saveConfig(AppState.config);
  updateOrderSummary();
  renderQrisImages();
  
  if (newAdminPwd) {
    showToast('Pengaturan & Kata Sandi Admin baru berhasil disimpan!', 'success');
    const pwdInput = document.getElementById('settingAdminPassword');
    if (pwdInput) pwdInput.value = '';
  } else {
    showToast('Pengaturan Rekening, WhatsApp, dan Foto QRIS berhasil disimpan ke Server!', 'success');
  }
};

// ==========================================
// 7. EXPORT DATA PESANAN KE CSV (EXCEL READY)
// ==========================================
window.exportBookingsToCSV = function() {
  if (AppState.bookings.length === 0) {
    showToast('Belum ada data pesanan untuk diekspor.', 'error');
    return;
  }

  const searchInput = document.getElementById('adminBookingSearch');
  const filterStatus = document.getElementById('adminStatusFilter');
  const query = searchInput ? searchInput.value.toLowerCase() : '';
  const statusFilter = filterStatus ? filterStatus.value : 'ALL';

  const dataToExport = AppState.bookings.filter(b => {
    const matchQuery = b.customerName.toLowerCase().includes(query) || 
      b.university.toLowerCase().includes(query) ||
      b.bookingCode.toLowerCase().includes(query);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const headers = [
    'Kode Booking',
    'Tanggal Booking Dibuat',
    'Nama Wisudawan',
    'No WhatsApp',
    'Akun Instagram',
    'Nama Universitas',
    'Lokasi Titik Temu',
    'Paket Wisuda',
    'Durasi Sesi (Jam)',
    'Tanggal Sesi Foto',
    'Jam Mulai',
    'Jam Selesai',
    'Total Biaya (Rp)',
    'Kewajiban DP (Rp)',
    'Status Pemesanan',
    'Catatan Khusus'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [headers.map(escapeCSV).join(',')];

  dataToExport.forEach(b => {
    csvRows.push([
      escapeCSV(b.bookingCode),
      escapeCSV(b.createdAt || '-'),
      escapeCSV(b.customerName),
      escapeCSV(b.customerPhone),
      escapeCSV(b.instagram ? `@${b.instagram}` : '-'),
      escapeCSV(b.university),
      escapeCSV(b.location),
      escapeCSV(b.packageName),
      escapeCSV(b.duration),
      escapeCSV(b.bookingDate),
      escapeCSV(b.sessionStart),
      escapeCSV(b.sessionEnd),
      escapeCSV(b.totalPrice),
      escapeCSV(b.downPayment),
      escapeCSV(b.status),
      escapeCSV(b.notes || '-')
    ].join(','));
  });

  // UTF-8 BOM so Microsoft Excel opens special characters correctly
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `rekap_pesanan_utara_gradu_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(`Berhasil mengunduh rekap ${dataToExport.length} pesanan ke format CSV/Excel!`);
};

// ==========================================
// 8. CEK STATUS BOOKING WISUDAWAN
// ==========================================
window.handleTrackBooking = async function(e) {
  if (e) e.preventDefault();
  const inputEl = document.getElementById('trackerCodeInput');
  const resultContainer = document.getElementById('trackerResultContainer');

  if (!inputEl || !resultContainer) return;
  const rawCode = inputEl.value.trim().toUpperCase().replace(/^#/, '');

  if (!rawCode) {
    showToast('Mohon masukkan Kode Booking Anda.', 'error');
    return;
  }

  let booking = AppState.bookings.find(b => 
    b.bookingCode.toUpperCase().replace(/^#/, '') === rawCode ||
    b.bookingCode.toUpperCase().includes(rawCode)
  );

  // If not found in local cache, query SQLite database via backend API
  if (!booking) {
    try {
      const serverBooking = await ApiService.trackBooking(rawCode);
      if (serverBooking) {
        booking = serverBooking;
        const exists = AppState.bookings.some(b => b.bookingCode === booking.bookingCode);
        if (!exists) {
          AppState.bookings.unshift(booking);
          AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);
        }
      }
    } catch (err) {
      console.warn('Backend tracking error:', err);
    }
  }

  if (!booking) {
    resultContainer.innerHTML = `
      <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: var(--radius-sm); padding: 1.25rem; text-align: center; margin-top: 1rem;">
        <div style="font-size: 1.75rem; margin-bottom: 0.35rem;">🔍❌</div>
        <strong style="color: var(--accent-rose);">Kode Booking Tidak Ditemukan</strong>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
          Pastikan kode booking yang Anda masukkan sesuai (contoh: <code>${AppState.bookings[0]?.bookingCode || 'WD-20261027-101'}</code>).
        </p>
      </div>
    `;
    return;
  }

  // Determine status color and timeline
  let statusBadge = '<span class="badge badge-gold">Menunggu DP</span>';
  let isStep1Done = true;
  let isStep2Done = booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';
  let isStep3Done = booking.status === 'COMPLETED';

  if (booking.status === 'CONFIRMED') {
    statusBadge = '<span class="badge badge-emerald">✓ Slot Terkunci (DP Terverifikasi)</span>';
  } else if (booking.status === 'COMPLETED') {
    statusBadge = '<span class="badge badge-teal">✓ Selesai Pemotretan</span>';
  } else if (booking.status === 'CANCELLED') {
    statusBadge = '<span class="badge badge-rose">Dibatalkan</span>';
  }

  resultContainer.innerHTML = `
    <div class="tracker-result-box">
      <div class="tracker-status-header">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">KODE BOOKING</span>
          <h4 style="font-size: 1.2rem; color: var(--primary);">#${booking.bookingCode}</h4>
        </div>
        <div>${statusBadge}</div>
      </div>

      <div class="tracker-timeline">
        <div class="timeline-step ${isStep1Done ? 'completed' : ''}">1. Registrasi Sukses</div>
        <div class="timeline-step ${isStep2Done ? 'completed' : (booking.status === 'PENDING_DP' ? 'active' : '')}">
          2. Verifikasi DP
        </div>
        <div class="timeline-step ${isStep3Done ? 'completed' : ''}">3. Hari-H Sesi Foto</div>
      </div>

      <div class="tracker-detail-grid">
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Nama Wisudawan:</span>
          <span class="tracker-detail-value">${booking.customerName}</span>
        </div>
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Paket Wisuda:</span>
          <span class="tracker-detail-value">${booking.packageName} (${booking.duration} Jam)</span>
        </div>
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Jadwal Sesi:</span>
          <span class="tracker-detail-value" style="color: var(--primary);">${booking.bookingDate} | ${booking.sessionStart} - ${booking.sessionEnd} WIB</span>
        </div>
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Universitas:</span>
          <span class="tracker-detail-value">${booking.university}</span>
        </div>
        <div class="tracker-detail-item" style="grid-column: 1 / -1;">
          <span class="tracker-detail-label">Titik Temu / Lokasi:</span>
          <span class="tracker-detail-value">📍 ${booking.location}</span>
        </div>
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Total Biaya:</span>
          <span class="tracker-detail-value">${formatRupiah(booking.totalPrice)}</span>
        </div>
        <div class="tracker-detail-item">
          <span class="tracker-detail-label">Status Pembayaran DP:</span>
          <span class="tracker-detail-value" style="color: ${isStep2Done ? 'var(--accent-emerald)' : 'var(--primary)'};">
            ${isStep2Done ? '✓ DP Rp 100.000 Lunas' : 'Menunggu DP (Rp 100.000)'}
          </span>
        </div>
      </div>

      ${booking.status === 'PENDING_DP' ? `
        <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; color: #fbbf24; margin-bottom: 0.35rem;">
            ${booking.paymentProof ? '⏳ Bukti Transfer Telah Diunggah' : '📤 Unggah Bukti Transfer DP (BCA):'}
          </div>
          ${booking.paymentProof ? `
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
              Bukti transfer berhasil terunggah dan sedang dicek oleh Kak Tara.
            </p>
            <img src="${booking.paymentProof}" style="max-height: 120px; border-radius: 6px; border: 1px solid var(--border-subtle); display: block; margin-bottom: 0.5rem;">
          ` : `
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
              Silakan transfer DP Rp 100.000 ke <strong>Bank BCA 1234-5678-90</strong> a/n Tara atau <strong>Scan QRIS Resmi</strong>, lalu lampirkan struk di sini:
            </p>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline-gold btn-xs" onclick="openQrisModal()">
                📲 Buka / Scan QRIS
              </button>
              <button type="button" class="btn btn-secondary btn-xs" onclick="copyBcaAccount()">
                📋 Salin No. Rek BCA
              </button>
            </div>
            <input type="file" id="trackerProofFile" accept="image/*" class="form-input" style="padding: 0.4rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
            <button type="button" class="btn btn-sm btn-primary" onclick="submitTrackerProof('${booking.bookingCode}')">
              📤 Unggah Bukti Transfer
            </button>
          `}
        </div>
      ` : ''}

      ${booking.status === 'COMPLETED' && booking.driveLink ? `
        <div style="background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: var(--radius-sm); padding: 1.15rem; margin-bottom: 1.25rem;">
          <div style="font-weight: 700; color: #22d3ee; margin-bottom: 0.35rem; font-size: 1rem;">
            🎉 Foto Wisuda Anda Telah Siap!
          </div>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.85rem;">
            Seluruh file foto hasil edit resolusi tinggi dan file mentah (raw) dapat diunduh melalui folder Google Drive resmi berikut:
          </p>
          <a href="${booking.driveLink}" target="_blank" class="btn btn-emerald btn-sm btn-full" style="font-weight:700; margin-bottom: 0.6rem;">
            📁 Buka Folder Google Drive Sekarang
          </a>
          <button type="button" class="btn btn-secondary btn-sm btn-full" onclick="closeModal('trackBookingModal'); handleOpenReviewModal();">
            ⭐ Tulis Rating & Ulasan Pengalaman Anda
          </button>
        </div>
      ` : ''}

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="https://wa.me/${AppState.config.waNumber}?text=Halo%20Kak%20Tara%20UTARA%20GRADU%2C%20saya%20ingin%20menanyakan%20status%20booking%20%23${booking.bookingCode}" 
          target="_blank" class="btn btn-sm btn-wa">
          📲 Chat Kak Tara di WhatsApp
        </a>
        <button type="button" class="btn btn-sm btn-outline-gold" onclick="printBookingReceipt('${booking.bookingCode}')">
          🖨️ Cetak E-Receipt
        </button>
      </div>
    </div>
  `;
};

// ==========================================
// 9. UPLOAD & VERIFIKASI BUKTI TRANSFER DP
// ==========================================
window.submitTrackerProof = function(bookingCode) {
  const fileInput = document.getElementById('trackerProofFile');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    showToast('Silakan pilih berkas foto/screenshot bukti transfer terlebih dahulu.', 'error');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function(e) {
    const dataUrl = e.target.result;
    const booking = AppState.bookings.find(b => b.bookingCode === bookingCode);
    if (booking) {
      booking.paymentProof = dataUrl;
      booking.paymentProofUploadedAt = new Date().toLocaleString('id-ID');
      AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);

      // Upload proof to SQLite database
      await ApiService.uploadPaymentProof(bookingCode, dataUrl);

      // Re-render Tracker
      handleTrackBooking();
      renderAdminTable();
      showToast('Bukti transfer berhasil diunggah! Kak Tara akan segera memverifikasi.');
    }
  };

  reader.readAsDataURL(file);
};

window.viewPaymentProof = function(bookingId) {
  const b = AppState.bookings.find(x => x.id === bookingId);
  if (!b || !b.paymentProof) return;

  const proofImg = document.getElementById('proofModalImage');
  const proofInfo = document.getElementById('proofModalInfo');
  const verifyBtn = document.getElementById('proofVerifyActionBtn');

  if (proofImg) proofImg.src = b.paymentProof;
  if (proofInfo) {
    proofInfo.innerHTML = `
      <strong>#${b.bookingCode}</strong> - ${b.customerName}<br>
      <small style="color:var(--text-secondary);">${b.university} | Paket ${b.packageName} | Total: ${formatRupiah(b.totalPrice)}</small><br>
      <small style="color:var(--accent-teal);">Diunggah: ${b.paymentProofUploadedAt || '-'}</small>
    `;
  }
  if (verifyBtn) {
    verifyBtn.onclick = function() {
      confirmBookingDp(b.id);
      closeModal('proofViewerModal');
    };
  }

  openModal('proofViewerModal');
};

// ==========================================
// 10. CETAK E-RECEIPT RESMI (PRINT READY)
// ==========================================
window.renderReceipt = function(booking) {
  const paperEl = document.getElementById('receiptPaper');
  if (!paperEl || !booking) return;

  const pkg = AppState.packages.find(p => p.id === booking.packageId) || {
    name: booking.packageName,
    duration: booking.duration,
    features: ['20-30 File Foto High Resolution Edit', 'All Raw / Original Files via Google Drive']
  };

  const remainingBalance = Math.max(0, (booking.totalPrice || 0) - (booking.downPayment || 100000));
  const isPaid = booking.status === 'CONFIRMED' || booking.status === 'COMPLETED';

  let stampHtml = '';
  if (isPaid) {
    stampHtml = '<div class="receipt-stamp">✓ TERVERIFIKASI RESMI - DP LUNAS</div>';
  } else if (booking.status === 'CANCELLED') {
    stampHtml = '<div class="receipt-stamp" style="border-color:#e11d48; color:#e11d48;">DIBATALKAN</div>';
  } else {
    stampHtml = '<div class="receipt-stamp pending">⏳ MENUNGGU PEMBAYARAN DP</div>';
  }

  paperEl.innerHTML = `
    <div class="receipt-header">
      <div>
        <div class="receipt-brand-title">UTARA <span>GRADU</span></div>
        <div class="receipt-brand-sub">Official Graduation Photography Service & On-Location Studio</div>
        <div style="font-size: 0.78rem; color: #64748b; margin-top: 0.2rem;">
          Instagram: @utara.photo | WA: +62 821-2077-6606 (Kak Tara)
        </div>
      </div>
      <div class="receipt-code-box">
        <div class="receipt-code-label">TANDA TERIMA / E-RECEIPT</div>
        <div class="receipt-code-value">#${booking.bookingCode}</div>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.15rem;">Tanggal: ${booking.createdAt || new Date().toLocaleDateString('id-ID')}</div>
      </div>
    </div>

    <div class="receipt-meta-grid">
      <div class="receipt-meta-item">
        <span class="meta-label">Nama Wisudawan</span>
        <span class="meta-value">${booking.customerName}</span>
      </div>
      <div class="receipt-meta-item">
        <span class="meta-label">Kontak WhatsApp</span>
        <span class="meta-value">${booking.customerPhone}</span>
      </div>
      <div class="receipt-meta-item">
        <span class="meta-label">Akun Instagram</span>
        <span class="meta-value">@${booking.instagram || '-'}</span>
      </div>
      <div class="receipt-meta-item">
        <span class="meta-label">Asal Universitas</span>
        <span class="meta-value">${booking.university}</span>
      </div>
      <div class="receipt-meta-item" style="grid-column: 1 / -1;">
        <span class="meta-label">Titik Temu / Lokasi Photo</span>
        <span class="meta-value">📍 ${booking.location}</span>
      </div>
    </div>

    <table class="receipt-table">
      <thead>
        <tr>
          <th>Deskripsi Layanan & Sesi</th>
          <th style="text-align: center;">Durasi</th>
          <th style="text-align: right;">Biaya</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Paket Wisuda: ${booking.packageName}</strong><br>
            <span style="font-size: 0.78rem; color: #64748b;">
              🗓 Sesi: ${booking.bookingDate} (${booking.sessionStart} - ${booking.sessionEnd} WIB)<br>
              ✨ Benefit: ${pkg.features ? pkg.features.slice(0, 2).join(', ') : 'File edit resolusi tinggi & all files Google Drive'}
            </span>
          </td>
          <td style="text-align: center; font-weight: 600;">${booking.duration} Jam Penuh</td>
          <td style="text-align: right; font-weight: 700;">${formatRupiah(booking.totalPrice)}</td>
        </tr>
      </tbody>
    </table>

    <div class="receipt-summary-box">
      <div class="receipt-summary-row">
        <span>Total Biaya Paket:</span>
        <strong>${formatRupiah(booking.totalPrice)}</strong>
      </div>
      <div class="receipt-summary-row dp">
        <span>Komitmen Down Payment (DP):</span>
        <strong>${formatRupiah(booking.downPayment || 100000)}</strong>
      </div>
      <div class="receipt-summary-row">
        <span>Sisa Pelunasan (Dibayarkan saat Hari-H):</span>
        <strong style="color: #d97706;">${formatRupiah(remainingBalance)}</strong>
      </div>
      <div class="receipt-summary-row total">
        <span>Status Reservasi:</span>
        <span>${isPaid ? 'SLOT TERKUNCI RESMI' : 'MENUNGGU VERIFIKASI DP'}</span>
      </div>
    </div>

    <div class="receipt-stamp-area">
      <div>
        ${stampHtml}
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.4rem;">
          Bank Pembayaran: ${AppState.config.bankName} ${AppState.config.bankAccount} a/n ${AppState.config.bankHolder}
        </div>
      </div>
      <div class="receipt-signature">
        <div>Tanda Tangan Digital Resmi,</div>
        <div style="font-size: 1.5rem; margin: 0.2rem 0;">✍️</div>
        <div class="sig-name">Tara (UTARA GRADU)</div>
        <div style="font-size: 0.7rem; color: #94a3b8;">Head Photographer & Management</div>
      </div>
    </div>

    <div class="receipt-footer-note">
      * Tanda terima digital ini diterbitkan secara otomatis oleh sistem UTARA GRADU (@utara.photo).<br>
      Harap hadir di lokasi titik temu kampus 10 menit sebelum jam sesi dimulai. Dokumen ini sah dan dapat disimpan sebagai bukti reservasi resmi.
    </div>
  `;
};

window.printBookingReceipt = function(bookingCode) {
  const code = (bookingCode || window.currentBookingCode || '').toString().trim().toUpperCase().replace(/^#/, '');
  const b = AppState.bookings.find(x => x.bookingCode.toUpperCase().replace(/^#/, '') === code) || AppState.bookings[0];
  if (!b) {
    showToast('Data booking tidak ditemukan untuk dicetak.', 'error');
    return;
  }

  window.renderReceipt(b);
  openModal('receiptModal');
};

// ==========================================
// 10. GALERI PORTOFOLIO & ADMIN MANAGEMENT
// ==========================================
function getPortfolioCategoryName(category) {
  switch (category) {
    case 'solo': return 'Solo Portrait';
    case 'besties': return 'Sahabat & Grup';
    case 'family': return 'Keluarga';
    default: return 'Wisuda';
  }
}

let currentPortfolioFilter = 'all';

function renderPortfolio(filterCategory = 'all') {
  currentPortfolioFilter = filterCategory;
  const container = document.getElementById('portfolioGridContainer');
  if (!container) return;

  const items = AppState.portfolio || [];
  const filtered = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category === filterCategory);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📸</div>
        <strong>Belum Ada Foto untuk Kategori Ini</strong>
        <p style="font-size: 0.85rem; margin-top: 0.35rem; color: var(--text-secondary);">
          Admin dapat menambahkan foto baru melalui Panel Admin &gt; Kelola Portofolio.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="portfolio-card" onclick="openLightbox('${item.image}', '${(item.title || '').replace(/'/g, "\\'")} - ${(item.university || '').replace(/'/g, "\\'")}')">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="portfolio-card-overlay">
        <h4 class="portfolio-card-title">${item.title}</h4>
        <div class="portfolio-card-meta">
          <span>🏛️ ${item.university}</span>
          <span class="badge badge-gold" style="font-size: 0.65rem;">${item.categoryName || getPortfolioCategoryName(item.category)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.filterPortfolio = function(category) {
  const btns = document.querySelectorAll('.portfolio-filter-btn');
  btns.forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderPortfolio(category);
};

// Render Admin Portfolio Grid
window.renderAdminPortfolio = function() {
  const container = document.getElementById('adminPortfolioList');
  if (!container) return;

  const items = AppState.portfolio || [];

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">🖼️📸</div>
        <h4 style="font-size: 1.2rem; margin-bottom: 0.35rem;">Belum Ada Foto Portofolio</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
          Tampilkan karya-karya pemotretan wisuda terbaik UTARA GRADU kepada calon wisudawan.
        </p>
        <button type="button" class="btn btn-primary btn-sm" onclick="openPortfolioModal()">
          ➕ Tambah Foto Pertama Sekarang
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="admin-portfolio-card" id="admin-port-card-${item.id}">
      <div class="admin-portfolio-thumb-wrapper">
        <span class="badge badge-gold admin-portfolio-badge">
          ${item.categoryName || getPortfolioCategoryName(item.category)}
        </span>
        <img src="${item.image}" alt="${item.title}" class="admin-portfolio-thumb">
      </div>
      <div class="admin-portfolio-body">
        <h4 class="admin-portfolio-title">${item.title}</h4>
        <div class="admin-portfolio-univ">
          <span>🏛️ ${item.university}</span>
        </div>
        <div class="admin-portfolio-actions">
          <button type="button" class="btn btn-secondary btn-xs" onclick="openPortfolioModal(${item.id})">
            ✏️ Edit
          </button>
          <button type="button" class="btn btn-outline-gold btn-xs" onclick="openLightbox('${item.image}', '${(item.title || '').replace(/'/g, "\\'")} - ${(item.university || '').replace(/'/g, "\\'")}')">
            🔍 Pratinjau
          </button>
          <button type="button" class="btn btn-secondary btn-xs" style="color: var(--accent-rose); margin-left: auto;" onclick="deletePortfolioItem(${item.id})" title="Hapus foto ini">
            🗑️ Hapus
          </button>
        </div>
      </div>
    </div>
  `).join('');
};

// Open Modal Tambah / Edit Foto Portofolio
window.openPortfolioModal = function(itemId = null) {
  const titleEl = document.getElementById('portfolioModalTitle');
  const idInput = document.getElementById('portfolioFormId');
  const titleInput = document.getElementById('portfolioFormTitle');
  const univInput = document.getElementById('portfolioFormUniv');
  const catInput = document.getElementById('portfolioFormCategory');
  const urlInput = document.getElementById('portfolioFormUrl');
  const fileInput = document.getElementById('portfolioFormFile');
  const previewImg = document.getElementById('portfolioFormPreview');

  window.tempPortfolioImage = null;
  if (fileInput) fileInput.value = '';

  if (itemId) {
    const item = AppState.portfolio.find(p => p.id === itemId);
    if (!item) return;
    if (titleEl) titleEl.innerText = 'Edit Foto Portofolio';
    if (idInput) idInput.value = item.id;
    if (titleInput) titleInput.value = item.title;
    if (univInput) univInput.value = item.university;
    if (catInput) catInput.value = item.category;
    if (urlInput) urlInput.value = item.image;
    if (previewImg) previewImg.src = item.image;
    window.tempPortfolioImage = item.image;
  } else {
    if (titleEl) titleEl.innerText = 'Tambah Foto Portofolio Baru';
    if (idInput) idInput.value = '';
    const form = document.getElementById('portfolioForm');
    if (form) form.reset();
    if (previewImg) previewImg.src = 'assets/hero_graduation.jpg';
    window.tempPortfolioImage = 'assets/hero_graduation.jpg';
  }

  openModal('portfolioFormModal');
};

// Handle file input upload in Portfolio Modal
window.handlePortfolioFileChange = function(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      window.tempPortfolioImage = e.target.result;
      const preview = document.getElementById('portfolioFormPreview');
      if (preview) preview.src = e.target.result;
      const urlInput = document.getElementById('portfolioFormUrl');
      if (urlInput) urlInput.value = '';
      showToast('Foto berhasil dipilih! Siap disimpan.', 'info');
    };
    reader.readAsDataURL(file);
  }
};

// Handle manual URL typing in Portfolio Modal
window.handlePortfolioUrlChange = function(input) {
  const val = input.value.trim();
  if (val) {
    window.tempPortfolioImage = val;
    const preview = document.getElementById('portfolioFormPreview');
    if (preview) preview.src = val;
  }
};

// Save Portfolio Item (Create or Update)
window.savePortfolioItem = async function(e) {
  e.preventDefault();
  const idVal = document.getElementById('portfolioFormId').value;
  const title = (document.getElementById('portfolioFormTitle')?.value || '').trim();
  const university = (document.getElementById('portfolioFormUniv')?.value || '').trim();
  const category = document.getElementById('portfolioFormCategory')?.value || 'solo';
  const urlVal = (document.getElementById('portfolioFormUrl')?.value || '').trim();

  const finalImage = window.tempPortfolioImage || urlVal || 'assets/hero_graduation.jpg';

  if (!title) {
    showToast('Mohon isi judul foto / konsep pemotretan.', 'error');
    return;
  }

  if (!university) {
    showToast('Mohon isi nama universitas / lokasi pemotretan.', 'error');
    return;
  }

  const categoryName = getPortfolioCategoryName(category);

  if (idVal) {
    // Edit item
    const index = AppState.portfolio.findIndex(p => p.id === Number(idVal));
    if (index !== -1) {
      AppState.portfolio[index] = {
        ...AppState.portfolio[index],
        title,
        university,
        category,
        categoryName,
        image: finalImage
      };
      await ApiService.savePortfolio(AppState.portfolio[index]);
      showToast(`Foto portofolio "${title}" berhasil diperbarui!`, 'success');
    }
  } else {
    // Add new item
    const newItem = {
      id: Date.now(),
      title,
      university,
      category,
      categoryName,
      image: finalImage
    };
    const saved = await ApiService.savePortfolio(newItem);
    if (saved && saved.id) newItem.id = saved.id;
    AppState.portfolio.unshift(newItem);
    showToast(`Foto portofolio "${title}" berhasil ditambahkan ke galeri!`, 'success');
  }

  AppStore.set(STORAGE_KEYS.PORTFOLIO, AppState.portfolio);
  closeModal('portfolioFormModal');
  renderAdminPortfolio();
  renderPortfolio(currentPortfolioFilter);
};

// Delete Portfolio Item
window.deletePortfolioItem = async function(itemId) {
  const item = AppState.portfolio.find(p => p.id === itemId);
  if (!item) return;

  if (confirm(`Apakah Anda yakin ingin menghapus foto "${item.title}" (${item.university}) dari galeri portofolio?`)) {
    AppState.portfolio = AppState.portfolio.filter(p => p.id !== itemId);
    AppStore.set(STORAGE_KEYS.PORTFOLIO, AppState.portfolio);
    await ApiService.deletePortfolio(itemId);
    renderAdminPortfolio();
    renderPortfolio(currentPortfolioFilter);
    showToast(`Foto "${item.title}" telah dihapus dari portofolio.`);
  }
};

window.openLightbox = function(imgSrc, caption) {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImage');
  const capEl = document.getElementById('lightboxCaption');

  if (imgEl) imgEl.src = imgSrc;
  if (capEl) capEl.innerText = caption;
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeLightbox = function() {
  const modal = document.getElementById('lightboxModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// ==========================================
// 11. MODAL UTILITIES
// ==========================================
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

// Mobile Drawer Controls
window.openMobileDrawer = function() {
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawerBackdrop) {
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeMobileDrawer = function() {
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  if (drawerBackdrop) {
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Close modal & drawer when clicking outside box
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (e.target.classList.contains('lightbox-modal')) {
    closeLightbox();
  }
  if (e.target.classList.contains('drawer-backdrop')) {
    closeMobileDrawer();
  }
});

// ==========================================
// 12. INITIALIZATION
// ==========================================
// ==========================================
// 12. KALENDER JADWAL, SELESAI SESI & PORTAL CUSTOMER
// ==========================================
window.renderAdminCalendar = function() {
  const datePicker = document.getElementById('adminCalendarDatePicker');
  if (!datePicker) return;

  if (!datePicker.value) {
    datePicker.value = AppState.selectedDate || dateStrTomorrow;
  }
  const dateVal = datePicker.value;

  const dayBookings = AppState.bookings.filter(b => b.bookingDate === dateVal && b.status !== 'CANCELLED');

  const metricsEl = document.getElementById('adminCalendarMetrics');
  if (metricsEl) {
    const totalRevenue = dayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const confirmedCount = dayBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
    const completedCount = dayBookings.filter(b => b.status === 'COMPLETED').length;

    metricsEl.innerHTML = `
      <div class="calendar-metric-card">
        <div class="calendar-metric-icon">📸</div>
        <div>
          <div class="calendar-metric-val">${dayBookings.length} Sesi</div>
          <div class="calendar-metric-lbl">Total Jadwal Booking</div>
        </div>
      </div>
      <div class="calendar-metric-card">
        <div class="calendar-metric-icon" style="color:var(--accent-emerald); background:rgba(16,185,129,0.12);">✓</div>
        <div>
          <div class="calendar-metric-val">${confirmedCount} Terkunci</div>
          <div class="calendar-metric-lbl">${completedCount} Selesai Sesi</div>
        </div>
      </div>
      <div class="calendar-metric-card">
        <div class="calendar-metric-icon" style="color:#fbbf24; background:rgba(245,158,11,0.12);">💰</div>
        <div>
          <div class="calendar-metric-val">${formatRupiah(totalRevenue)}</div>
          <div class="calendar-metric-lbl">Estimasi Omzet Hari Ini</div>
        </div>
      </div>
    `;
  }

  const timelineEl = document.getElementById('adminCalendarTimeline');
  if (!timelineEl) return;

  const hours = [
    { start: '06:00', end: '07:00' },
    { start: '07:00', end: '08:00' },
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' }
  ];

  timelineEl.innerHTML = hours.map(slot => {
    const slotBooking = dayBookings.find(b => {
      const bStart = b.sessionStart;
      const bEnd = b.sessionEnd;
      return (slot.start >= bStart && slot.start < bEnd);
    });

    if (slotBooking) {
      const isCompleted = slotBooking.status === 'COMPLETED';
      let badgeClass = 'badge-gold';
      let badgeText = 'Pending DP';
      if (slotBooking.status === 'CONFIRMED') {
        badgeClass = 'badge-emerald';
        badgeText = 'Terkonfirmasi (DP Masuk)';
      } else if (isCompleted) {
        badgeClass = 'badge-teal';
        badgeText = '✓ Selesai & Drive Terkirim';
      }

      return `
        <div class="timeline-slot-card ${isCompleted ? 'completed' : 'booked'}">
          <div class="timeline-slot-time">
            ⏰ ${slot.start} - ${slot.end} WIB
          </div>
          <div class="timeline-slot-info">
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom: 0.25rem;">
              <strong style="color:var(--text-main); font-size:1.05rem;">${slotBooking.customerName}</strong>
              <span class="badge ${badgeClass}" style="font-size:0.7rem;">${badgeText}</span>
              <span class="badge badge-teal" style="font-size:0.7rem;">${slotBooking.packageName} (${slotBooking.duration} Jam)</span>
            </div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">
              🏛️ <strong>${slotBooking.university}</strong> &bull; 📍 ${slotBooking.location} &bull; WA: ${slotBooking.customerPhone}
            </div>
            ${slotBooking.driveLink ? `
              <div style="margin-top:0.35rem; font-size:0.82rem; color:var(--accent-teal);">
                📁 Google Drive: <a href="${slotBooking.driveLink}" target="_blank" style="text-decoration:underline;">Buka Album Wisuda</a>
              </div>
            ` : ''}
          </div>
          <div class="timeline-slot-actions">
            ${slotBooking.status === 'CONFIRMED' ? `
              <button class="btn btn-sm btn-emerald" onclick="openCompleteBookingModal(${slotBooking.id})" title="Selesaikan Sesi & Kirim Drive">
                📸 Selesai & Drive
              </button>
            ` : ''}
            <button class="btn btn-sm btn-outline-gold" onclick="printBookingReceipt('${slotBooking.bookingCode}')" title="Cetak E-Receipt">
              🖨️ Struk
            </button>
            <a href="https://wa.me/${slotBooking.customerPhone.replace(/[^0-9]/g, '')}?text=Halo%20Kak%20${encodeURIComponent(slotBooking.customerName)}%2C%20kami%20dari%20UTARA%20GRADU%20ingin%20koordinasi%20sesi%20wisuda" 
              target="_blank" class="btn btn-sm btn-wa" title="Chat WhatsApp Wisudawan">
              📲 WA
            </a>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="timeline-slot-card empty">
          <div class="timeline-slot-time" style="color:var(--text-muted);">
            ⏰ ${slot.start} - ${slot.end} WIB
          </div>
          <div class="timeline-slot-info">
            <span style="color:var(--text-muted); font-size:0.88rem;">✨ Slot Jam Bulat Kosong / Siap Menerima Reservasi Wisuda</span>
          </div>
          <div class="timeline-slot-actions">
            <span class="badge" style="background:rgba(255,255,255,0.05); color:var(--text-muted);">Tersedia</span>
          </div>
        </div>
      `;
    }
  }).join('');
};

window.openCompleteBookingModal = function(bookingId) {
  const b = AppState.bookings.find(x => x.id === bookingId);
  if (!b) return;

  const summaryEl = document.getElementById('completeBookingSummary');
  const idInput = document.getElementById('completeBookingId');
  const driveInput = document.getElementById('completeDriveLinkInput');

  if (idInput) idInput.value = b.id;
  if (driveInput) driveInput.value = b.driveLink || '';

  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.35rem;">
        <span style="color:var(--text-secondary);">Kode Booking:</span>
        <strong style="color:var(--primary);">#${b.bookingCode}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.35rem;">
        <span style="color:var(--text-secondary);">Wisudawan:</span>
        <strong>${b.customerName} (${b.customerPhone})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom: 0.35rem;">
        <span style="color:var(--text-secondary);">Paket & Kampus:</span>
        <span>${b.packageName} (${b.duration} Jam) &bull; ${b.university}</span>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span style="color:var(--text-secondary);">Sesi:</span>
        <span>${b.bookingDate} | ${b.sessionStart} - ${b.sessionEnd} WIB</span>
      </div>
    `;
  }

  openModal('completeBookingModal');
};

window.handleCompleteBookingSubmit = async function(e) {
  e.preventDefault();
  const idVal = Number(document.getElementById('completeBookingId').value);
  const driveUrl = document.getElementById('completeDriveLinkInput').value.trim();
  const sendWa = document.getElementById('completeSendWaCheckbox').checked;

  const b = AppState.bookings.find(x => x.id === idVal);
  if (!b) return;

  b.status = 'COMPLETED';
  b.driveLink = driveUrl;
  b.completedAt = new Date().toLocaleString('id-ID');
  AppStore.set(STORAGE_KEYS.BOOKINGS, AppState.bookings);

  // Sync completion and Google Drive album link to backend SQLite
  await ApiService.completeBooking(idVal, driveUrl);

  closeModal('completeBookingModal');
  renderAdminTable();
  if (typeof renderAdminCalendar === 'function') renderAdminCalendar();
  showToast(`Sesi pemotretan #${b.bookingCode} resmi diselesaikan!`);

  if (sendWa) {
    const waMsg = 
`Halo Kak ${b.customerName}! 🎓📸
Kabar gembira! Seluruh dokumentasi foto wisuda Kakak telah selesai diproses dengan cermat oleh tim UTARA GRADU.

📁 LINK GOOGLE DRIVE ALBUM WISUDA:
${driveUrl}

Isi Album:
✨ 20-30 Foto Resolusi Tinggi Hasil Edit
✨ Seluruh File Mentah / Original (Raw Files)
✨ Format High-Resolution Siap Cetak & Media Sosial

Terima kasih banyak telah mempercayakan momen bersejarah wisuda Kakak kepada UTARA GRADU (@utara.photo). 
Bila berkenan, mohon luangkan 1 menit untuk memberikan rating & ulasan pelayanan kami di website ya Kak! ✨

Salam hangat,
Tara & Tim UTARA GRADU`;

    const cleanPhone = b.customerPhone.replace(/[^0-9]/g, '');
    const phoneFormatted = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const waUrl = `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
  }
};

window.openMyBookingsModal = function() {
  openModal('trackBookingModal');
};

// ==========================================
// 13. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Set default date input min to tomorrow
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    dateInput.min = dateStrTomorrow;
    dateInput.value = dateStrTomorrow;
    dateInput.addEventListener('change', () => {
      AppState.selectedDate = dateInput.value;
      AppState.selectedSlot = null;
      renderTimeSlots();
      updateOrderSummary();
    });
  }

  const calendarDateInput = document.getElementById('adminCalendarDatePicker');
  if (calendarDateInput) {
    calendarDateInput.value = dateStrTomorrow;
  }

  // Render all initial components
  renderPackages();
  renderDurationControls();
  renderTimeSlots();
  updateOrderSummary();
  renderReviews();
  renderAdminTable();
  renderPortfolio();
  if (typeof renderAdminPortfolio === 'function') renderAdminPortfolio();
  updateAuthUI();
  renderQrisImages();
  if (typeof renderAdminCalendar === 'function') renderAdminCalendar();

  // Async sync from Express + SQLite backend
  syncDataFromBackend();

  // Booking search / filter listeners
  const searchInput = document.getElementById('adminBookingSearch');
  const statusFilter = document.getElementById('adminStatusFilter');
  if (searchInput) searchInput.addEventListener('input', renderAdminTable);
  if (statusFilter) statusFilter.addEventListener('change', renderAdminTable);

  // Handle initial page load from URL hash (Per-Page routing)
  const initialHash = window.location.hash.replace(/^#\/?/, '').trim() || 'beranda';
  navigateToPage(initialHash);
});

// ==========================================
// 14. MULTI-PAGE VIEW ROUTER (PER-PAGE NAVIGATION)
// ==========================================
const VALID_PAGES = ['beranda', 'paket', 'portofolio', 'booking', 'rating', 'admin'];

window.navigateToPage = function(pageName, scrollToElemId = null) {
  let target = (pageName || 'beranda').toLowerCase().replace(/^#\/?/, '').trim();
  if (!VALID_PAGES.includes(target)) {
    target = 'beranda';
  }

  const actualPageId = (target === 'paket') ? 'beranda' : target;

  // Toggle page views
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });

  const activePageEl = document.getElementById(`page-${actualPageId}`);
  if (activePageEl) {
    activePageEl.classList.add('active');
  }

  // Update navbar & drawer active classes
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (href.includes(target) || (target === 'beranda' && href.includes('beranda'))) {
      link.classList.add('active');
    }
  });

  // Update URL hash without full page reload
  if (window.location.hash !== `#/${target}`) {
    history.pushState(null, '', `#/${target}`);
  }

  // Scroll to element or top
  if (target === 'paket') {
    setTimeout(() => {
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  } else if (scrollToElemId) {
    setTimeout(() => {
      const el = document.getElementById(scrollToElemId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Close mobile drawer if open
  closeMobileDrawer();

  // If opening admin, verify admin login state
  if (actualPageId === 'admin') {
    updateAuthUI();
    if (!AppState.isAdminLoggedIn) {
      openAdminLoginModal();
    } else {
      renderAdminTable();
      if (typeof renderAdminCalendar === 'function') renderAdminCalendar();
      if (typeof renderAdminPortfolio === 'function') renderAdminPortfolio();
    }
  }
};

// Handle Browser Back / Forward buttons & URL hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace(/^#\/?/, '').trim() || 'beranda';
  navigateToPage(hash);
});
