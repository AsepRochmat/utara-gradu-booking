const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'utara_gradu.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize Tables
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      maxPersons INTEGER DEFAULT 1,
      description TEXT,
      features TEXT,
      isPopular INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY,
      bookingCode TEXT UNIQUE NOT NULL,
      packageId INTEGER,
      packageName TEXT,
      duration INTEGER,
      customerName TEXT,
      customerPhone TEXT,
      instagram TEXT,
      university TEXT,
      location TEXT,
      bookingDate TEXT,
      sessionStart TEXT,
      sessionEnd TEXT,
      totalPrice INTEGER,
      downPayment INTEGER,
      status TEXT DEFAULT 'PENDING_DP',
      paymentProof TEXT,
      paymentProofUploadedAt TEXT,
      driveLink TEXT,
      notes TEXT,
      completedAt TEXT,
      createdAt TEXT
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      categoryName TEXT NOT NULL,
      university TEXT NOT NULL,
      image TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      userName TEXT NOT NULL,
      university TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      date TEXT,
      isVerified INTEGER DEFAULT 1,
      isPublished INTEGER DEFAULT 1
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // 1. Seed Config
  const configRows = db.prepare('SELECT count(*) as count FROM config').get();
  if (configRows.count === 0) {
    const defaultConfig = {
      openingHour: '6',
      closingHour: '16',
      bankName: 'Bank BCA',
      bankAccount: '1234-5678-90',
      bankHolder: 'Tara (UTARA GRADU)',
      waNumber: '6282120776606',
      defaultDp: '100000',
      qrisImage: 'assets/qris_utara_gradu.svg'
    };
    const stmt = db.prepare('INSERT INTO config (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(defaultConfig)) {
      stmt.run(k, String(v));
    }
  }

  // 2. Seed Packages
  const pkgRows = db.prepare('SELECT count(*) as count FROM packages').get();
  if (pkgRows.count === 0) {
    const defaultPackages = [
      {
        id: 1,
        name: 'Basic',
        price: 350000,
        duration: 1,
        maxPersons: 1,
        description: 'Dokumentasi personal wisudawan solo on-location di kampus / outdoor pilihan Anda.',
        features: JSON.stringify([
          '1 Orang Wisudawan (Solo)',
          'Durasi Sesi: 1 Jam Penuh (Jam Bulat)',
          '20 Foto Diedit (High-Resolution)',
          'Semua File Original / Mentah (Google Drive)',
          'Bebas Pilih Spot Foto di Kampus / Outdoor Pilihan'
        ]),
        isPopular: 0,
        isActive: 1
      },
      {
        id: 2,
        name: 'Combo',
        price: 500000,
        duration: 2,
        maxPersons: 5,
        description: 'Pilihan paling diminati untuk sesi bersama keluarga inti atau sahabat terdekat.',
        features: JSON.stringify([
          'Wisudawan + Maks. 4 Orang Keluarga / Sahabat',
          'Durasi Sesi: 2 Jam Santai (Jam Bulat)',
          '30 Foto Diedit (High-Resolution)',
          '1 Buah Cetak 10R + Bingkai Minimalis Elegan',
          'Semua File Original / Mentah (Google Drive)',
          'Eksplorasi Multi-Spot di Kampus / Area Outdoor'
        ]),
        isPopular: 1,
        isActive: 1
      },
      {
        id: 3,
        name: 'Premium',
        price: 550000,
        duration: 2,
        maxPersons: 9,
        description: 'Paket terlengkap untuk keluarga besar dengan ekstra cetakan eksklusif dan editing kilat.',
        features: JSON.stringify([
          'Wisudawan + Maks. 8 Orang Keluarga / Sahabat',
          'Durasi Sesi: 2 Jam Ekstra Luas (Jam Bulat)',
          '30 Foto Diedit (High-Resolution)',
          '1 Buah Cetak 12R/16R + Bingkai Kayu Eksklusif',
          'Semua File Original / Mentah (Google Drive)',
          'Prioritas Editing Kilat (Selesai 3 Hari Kerja)',
          'Bebas Ganti Konsep & Properti Foto Khusus'
        ]),
        isPopular: 0,
        isActive: 1
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of defaultPackages) {
      stmt.run(p.id, p.name, p.price, p.duration, p.maxPersons, p.description, p.features, p.isPopular, p.isActive);
    }
  }

  // 3. Seed Portfolio
  const portRows = db.prepare('SELECT count(*) as count FROM portfolio').get();
  if (portRows.count === 0) {
    const defaultPortfolio = [
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

    const stmt = db.prepare(`
      INSERT INTO portfolio (id, title, category, categoryName, university, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const item of defaultPortfolio) {
      stmt.run(item.id, item.title, item.category, item.categoryName, item.university, item.image);
    }
  }

  // 4. Seed Reviews
  const revRows = db.prepare('SELECT count(*) as count FROM reviews').get();
  if (revRows.count === 0) {
    const defaultReviews = [
      {
        id: 1,
        userId: 2,
        userName: 'Sarah Amalia, S.Ked',
        university: 'Universitas Indonesia',
        rating: 5,
        comment: 'Pelayanannya super ramah dan sabar banget mengarahkan pose wisuda buat aku dan keluarga! Hasil fotonya jernih banget, editingnya natural, dan slot waktunya bener-bener tepat waktu.',
        date: '2026-10-20',
        isVerified: 1,
        isPublished: 1
      },
      {
        id: 2,
        userId: 3,
        userName: 'Dimas Anggara, S.T',
        university: 'Institut Teknologi Bandung',
        rating: 5,
        comment: 'Puas banget ambil paket Combo 2 jam. Kakak fotografernya tau spot-spot estetik di kampus ITB, anak-anak sekelompok pada suka hasilnya. Konfirmasi via WA juga cepet dan jelas.',
        date: '2026-10-22',
        isVerified: 1,
        isPublished: 1
      },
      {
        id: 3,
        userId: 4,
        userName: 'Nabila Putri, S.I.Kom',
        university: 'Universitas Padjadjaran',
        rating: 5,
        comment: 'Rekomendasi terbaik buat foto wisuda outdoor! Cetakan bingkainya rapi dan tebal, file drive dikirim lengkap tanpa ada yang kurang.',
        date: '2026-10-24',
        isVerified: 1,
        isPublished: 1
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO reviews (id, userId, userName, university, rating, comment, date, isVerified, isPublished)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of defaultReviews) {
      stmt.run(r.id, r.userId, r.userName, r.university, r.rating, r.comment, r.date, r.isVerified, r.isPublished);
    }
  }

  // 5. Seed Initial Bookings
  const bookRows = db.prepare('SELECT count(*) as count FROM bookings').get();
  if (bookRows.count === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStrTomorrow = tomorrow.toISOString().split('T')[0];

    const defaultBookings = [
      {
        id: 1,
        bookingCode: 'WD-20261027-101',
        packageId: 2,
        packageName: 'Combo',
        duration: 2,
        customerName: 'Rian Pratama',
        customerPhone: '081345678912',
        instagram: 'rianpratama_',
        university: 'Universitas Indonesia',
        location: 'Taman Danau Rektorat UI Depok',
        bookingDate: dateStrTomorrow,
        sessionStart: '08:00',
        sessionEnd: '10:00',
        totalPrice: 500000,
        downPayment: 100000,
        status: 'CONFIRMED',
        notes: 'Membawa 1 lansia kursi roda',
        createdAt: '2026-10-25 09:30'
      },
      {
        id: 2,
        bookingCode: 'WD-20261027-102',
        packageId: 1,
        packageName: 'Basic',
        duration: 1,
        customerName: 'Anindita Zahra',
        customerPhone: '081288899911',
        instagram: 'aninditazhr',
        university: 'Universitas Negeri Jakarta',
        location: 'Depan Gedung Rektorat UNJ Rawamangun',
        bookingDate: dateStrTomorrow,
        sessionStart: '13:00',
        sessionEnd: '14:00',
        totalPrice: 350000,
        downPayment: 100000,
        status: 'PENDING_DP',
        notes: 'Foto solo dengan toga dan selempang gelar',
        createdAt: '2026-10-25 14:15'
      }
    ];

    const stmt = db.prepare(`
      INSERT INTO bookings (id, bookingCode, packageId, packageName, duration, customerName, customerPhone, instagram, university, location, bookingDate, sessionStart, sessionEnd, totalPrice, downPayment, status, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const b of defaultBookings) {
      stmt.run(b.id, b.bookingCode, b.packageId, b.packageName, b.duration, b.customerName, b.customerPhone, b.instagram, b.university, b.location, b.bookingDate, b.sessionStart, b.sessionEnd, b.totalPrice, b.downPayment, b.status, b.notes, b.createdAt);
    }
  }
}

// Initialize Schema immediately
initSchema();

// DAO / Operations Interface
const DB = {
  // Config
  getConfig() {
    const rows = db.prepare('SELECT key, value FROM config').all();
    const config = {};
    for (const r of rows) {
      if (r.key === 'openingHour' || r.key === 'closingHour' || r.key === 'defaultDp') {
        config[r.key] = Number(r.value);
      } else {
        config[r.key] = r.value;
      }
    }
    return config;
  },

  updateConfig(updates) {
    const stmt = db.prepare('INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?');
    for (const [k, v] of Object.entries(updates)) {
      stmt.run(k, String(v), String(v));
    }
    return this.getConfig();
  },

  // Packages
  getPackages(activeOnly = false) {
    const sql = activeOnly 
      ? 'SELECT * FROM packages WHERE isActive = 1 ORDER BY id ASC'
      : 'SELECT * FROM packages ORDER BY id ASC';
    const rows = db.prepare(sql).all();
    return rows.map(r => ({
      ...r,
      isPopular: Boolean(r.isPopular),
      isActive: Boolean(r.isActive),
      features: r.features ? JSON.parse(r.features) : []
    }));
  },

  getPackageById(id) {
    const r = db.prepare('SELECT * FROM packages WHERE id = ?').get(id);
    if (!r) return null;
    return {
      ...r,
      isPopular: Boolean(r.isPopular),
      isActive: Boolean(r.isActive),
      features: r.features ? JSON.parse(r.features) : []
    };
  },

  savePackage(pkg) {
    const id = pkg.id || Date.now();
    const name = pkg.name || 'Paket';
    const price = Number(pkg.price) || 0;
    const duration = Number(pkg.duration) || 1;
    const maxPersons = Number(pkg.maxPersons) || 1;
    const description = pkg.description || '';
    const featuresJson = JSON.stringify(pkg.features || []);
    const isPopular = pkg.isPopular ? 1 : 0;
    const isActive = pkg.isActive !== false ? 1 : 0;

    const existing = db.prepare('SELECT id FROM packages WHERE id = ?').get(id);
    if (existing) {
      db.prepare(`
        UPDATE packages 
        SET name = ?, price = ?, duration = ?, maxPersons = ?, description = ?, features = ?, isPopular = ?, isActive = ?
        WHERE id = ?
      `).run(name, price, duration, maxPersons, description, featuresJson, isPopular, isActive, id);
    } else {
      db.prepare(`
        INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, name, price, duration, maxPersons, description, featuresJson, isPopular, isActive);
    }
    return this.getPackageById(id);
  },

  deletePackage(id) {
    db.prepare('DELETE FROM packages WHERE id = ?').run(id);
    return true;
  },

  togglePackage(id) {
    const p = this.getPackageById(id);
    if (!p) return null;
    const newStatus = p.isActive ? 0 : 1;
    db.prepare('UPDATE packages SET isActive = ? WHERE id = ?').run(newStatus, id);
    return this.getPackageById(id);
  },

  // Bookings
  getBookings() {
    return db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
  },

  getBookingByCode(code) {
    const normalized = (code || '').toUpperCase().replace(/^#/, '').trim();
    return db.prepare('SELECT * FROM bookings WHERE UPPER(bookingCode) = ?').get(normalized);
  },

  getBookingById(id) {
    return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  },

  getBookedSlotsForDate(dateStr) {
    return db.prepare(`
      SELECT sessionStart, sessionEnd, status, packageName, duration 
      FROM bookings 
      WHERE bookingDate = ? AND status != 'CANCELLED'
    `).all(dateStr);
  },

  createBooking(booking) {
    const id = booking.id || Date.now();
    const createdAt = booking.createdAt || new Date().toLocaleString('id-ID');
    const status = booking.status || 'PENDING_DP';
    const bookingCode = booking.bookingCode || `WD-${Date.now().toString().slice(-6)}`;
    const packageId = Number(booking.packageId) || 1;
    const packageName = booking.packageName || 'Basic';
    const duration = Number(booking.duration) || 1;
    const customerName = booking.customerName || '';
    const customerPhone = booking.customerPhone || '';
    const instagram = booking.instagram || '';
    const university = booking.university || '';
    const location = booking.location || '';
    const bookingDate = booking.bookingDate || '';
    const sessionStart = booking.sessionStart || '';
    const sessionEnd = booking.sessionEnd || '';
    const totalPrice = Number(booking.totalPrice) || 0;
    const downPayment = Number(booking.downPayment || booking.dpAmount) || 0;
    const paymentProof = booking.paymentProof || null;
    const paymentProofUploadedAt = booking.paymentProofUploadedAt || null;
    const driveLink = booking.driveLink || null;
    const notes = booking.notes || '';
    const completedAt = booking.completedAt || null;

    db.prepare(`
      INSERT INTO bookings (
        id, bookingCode, packageId, packageName, duration, customerName, customerPhone,
        instagram, university, location, bookingDate, sessionStart, sessionEnd,
        totalPrice, downPayment, status, paymentProof, paymentProofUploadedAt,
        driveLink, notes, completedAt, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, bookingCode, packageId, packageName, duration,
      customerName, customerPhone, instagram,
      university, location, bookingDate, sessionStart,
      sessionEnd, totalPrice, downPayment, status,
      paymentProof, paymentProofUploadedAt,
      driveLink, notes, completedAt, createdAt
    );

    return this.getBookingById(id);
  },

  updateBookingStatus(id, newStatus) {
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(newStatus, id);
    return this.getBookingById(id);
  },

  uploadPaymentProof(code, proofBase64) {
    const nowStr = new Date().toLocaleString('id-ID');
    const normalized = (code || '').toUpperCase().replace(/^#/, '').trim();
    db.prepare(`
      UPDATE bookings 
      SET paymentProof = ?, paymentProofUploadedAt = ? 
      WHERE UPPER(bookingCode) = ?
    `).run(proofBase64, nowStr, normalized);
    return this.getBookingByCode(normalized);
  },

  completeBooking(id, driveLink) {
    const nowStr = new Date().toLocaleString('id-ID');
    db.prepare(`
      UPDATE bookings 
      SET status = 'COMPLETED', driveLink = ?, completedAt = ? 
      WHERE id = ?
    `).run(driveLink || '', nowStr, id);
    return this.getBookingById(id);
  },

  deleteBooking(id) {
    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    return true;
  },

  // Portfolio
  getPortfolio(category = null) {
    if (category && category !== 'all') {
      return db.prepare('SELECT * FROM portfolio WHERE category = ? ORDER BY id DESC').all(category);
    }
    return db.prepare('SELECT * FROM portfolio ORDER BY id DESC').all();
  },

  getPortfolioById(id) {
    return db.prepare('SELECT * FROM portfolio WHERE id = ?').get(id);
  },

  savePortfolioItem(item) {
    const id = item.id || Date.now();
    const title = item.title || '';
    const category = item.category || 'other';
    const categoryName = item.categoryName || '';
    const university = item.university || '';
    const image = item.image || '';

    const existing = db.prepare('SELECT id FROM portfolio WHERE id = ?').get(id);
    if (existing) {
      db.prepare(`
        UPDATE portfolio 
        SET title = ?, category = ?, categoryName = ?, university = ?, image = ? 
        WHERE id = ?
      `).run(title, category, categoryName, university, image, id);
    } else {
      db.prepare(`
        INSERT INTO portfolio (id, title, category, categoryName, university, image) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, title, category, categoryName, university, image);
    }
    return this.getPortfolioById(id);
  },

  deletePortfolioItem(id) {
    db.prepare('DELETE FROM portfolio WHERE id = ?').run(id);
    return true;
  },

  // Reviews
  getReviews(publishedOnly = true) {
    const sql = publishedOnly
      ? 'SELECT * FROM reviews WHERE isPublished = 1 ORDER BY id DESC'
      : 'SELECT * FROM reviews ORDER BY id DESC';
    const rows = db.prepare(sql).all();
    return rows.map(r => ({
      ...r,
      isVerified: Boolean(r.isVerified),
      isPublished: Boolean(r.isPublished)
    }));
  },

  createReview(rev) {
    const id = rev.id || Date.now();
    const dateStr = rev.date || new Date().toISOString().split('T')[0];
    const userId = rev.userId || null;
    const userName = rev.userName || 'Wisudawan';
    const university = rev.university || '';
    const rating = Number(rev.rating) || 5;
    const comment = rev.comment || '';

    db.prepare(`
      INSERT INTO reviews (id, userId, userName, university, rating, comment, date, isVerified, isPublished)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, userName, university, rating, comment, dateStr, 1, 1);
    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  },

  toggleReview(id) {
    const rev = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!rev) return null;
    const newStatus = rev.isPublished ? 0 : 1;
    db.prepare('UPDATE reviews SET isPublished = ? WHERE id = ?').run(newStatus, id);
    return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
  }
};

module.exports = DB;
