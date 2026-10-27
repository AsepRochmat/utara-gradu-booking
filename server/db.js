const fs = require('fs');
const path = require('path');

// Determine database mode: Turso Cloud vs Local SQLite
const isTurso = Boolean(process.env.TURSO_DATABASE_URL);

let tursoClient = null;
let db = null;

if (isTurso) {
  const { createClient } = require('@libsql/client/http');
  tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });
  console.log('⚡ Connected to Turso Cloud SQLite Database:', process.env.TURSO_DATABASE_URL);
} else {
  const { DatabaseSync } = require('node:sqlite');
  const glitchDataDir = path.join(__dirname, '..', '.data');
  const normalDataDir = path.join(__dirname, '..', 'data');
  const dataDir = fs.existsSync(glitchDataDir) ? glitchDataDir : normalDataDir;
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'utara_gradu.sqlite');
  db = new DatabaseSync(dbPath);
  console.log('💾 Connected to Local SQLite Database:', dbPath);
}

// Default Seed Data
const DEFAULT_CONFIG = {
  openingHour: '6',
  closingHour: '16',
  bankName: 'Bank BCA',
  bankAccount: '1234-5678-90',
  bankHolder: 'Tara (UTARA GRADU)',
  waNumber: '6282120776606',
  defaultDp: '100000',
  qrisImage: 'assets/qris_utara_gradu.svg'
};

const DEFAULT_PACKAGES = [
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
      'Prioritas Editing Kilat (Selesai 3 Hari Kerja)'
    ]),
    isPopular: 0,
    isActive: 1
  }
];

const DEFAULT_PORTFOLIO = [
  {
    id: 1,
    title: 'Keanggunan Momen Wisuda Balairung',
    category: 'family',
    categoryName: 'Wisuda & Keluarga',
    university: 'Universitas Indonesia',
    image: 'assets/hero_graduation.jpg'
  },
  {
    id: 2,
    title: 'Sukacita Bersama Keluarga Tercinta',
    category: 'family',
    categoryName: 'Wisuda & Keluarga',
    university: 'Universitas Padjadjaran',
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

const DEFAULT_REVIEWS = [
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
    comment: 'Fotografer dari UTARA GRADU top banget! Nggak kaku, seru, dan semua file mentah langsung dikirim via Google Drive malam itu juga. Cetakan 10R-nya rapi banget!',
    date: '2026-10-25',
    isVerified: 1,
    isPublished: 1
  }
];

// Initialize Tables & Seed
async function initSchema() {
  const schemaSqls = [
    `CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT);`,
    `CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      maxPersons INTEGER DEFAULT 1,
      description TEXT,
      features TEXT,
      isPopular INTEGER DEFAULT 0,
      isActive INTEGER DEFAULT 1
    );`,
    `CREATE TABLE IF NOT EXISTS bookings (
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
    );`,
    `CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      categoryName TEXT NOT NULL,
      university TEXT NOT NULL,
      image TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
      userId INTEGER,
      userName TEXT NOT NULL,
      university TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      date TEXT,
      isVerified INTEGER DEFAULT 1,
      isPublished INTEGER DEFAULT 1
    );`
  ];

  if (isTurso) {
    for (const sql of schemaSqls) {
      await tursoClient.execute(sql);
    }
    // Seed Turso if empty
    const checkCfg = await tursoClient.execute('SELECT count(*) as count FROM config');
    const cfgCount = Number(checkCfg.rows[0].count || 0);
    if (cfgCount === 0) {
      for (const [k, v] of Object.entries(DEFAULT_CONFIG)) {
        await tursoClient.execute({ sql: 'INSERT INTO config (key, value) VALUES (?, ?)', args: [k, String(v)] });
      }
      for (const p of DEFAULT_PACKAGES) {
        await tursoClient.execute({
          sql: 'INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [p.id, p.name, p.price, p.duration, p.maxPersons, p.description, p.features, p.isPopular, p.isActive]
        });
      }
      for (const item of DEFAULT_PORTFOLIO) {
        await tursoClient.execute({
          sql: 'INSERT INTO portfolio (id, title, category, categoryName, university, image) VALUES (?, ?, ?, ?, ?, ?)',
          args: [item.id, item.title, item.category, item.categoryName, item.university, item.image]
        });
      }
      for (const r of DEFAULT_REVIEWS) {
        await tursoClient.execute({
          sql: 'INSERT INTO reviews (id, userId, userName, university, rating, comment, date, isVerified, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [r.id, r.userId, r.userName, r.university, r.rating, r.comment, r.date, r.isVerified, r.isPublished]
        });
      }
      console.log('✅ Turso Database Seeded Successfully!');
    }
  } else {
    // Local SQLite
    for (const sql of schemaSqls) {
      db.exec(sql);
    }
    const cfgRow = db.prepare('SELECT count(*) as count FROM config').get();
    if (cfgRow.count === 0) {
      const stmt = db.prepare('INSERT INTO config (key, value) VALUES (?, ?)');
      for (const [k, v] of Object.entries(DEFAULT_CONFIG)) {
        stmt.run(k, String(v));
      }
      const pkgStmt = db.prepare('INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const p of DEFAULT_PACKAGES) {
        pkgStmt.run(p.id, p.name, p.price, p.duration, p.maxPersons, p.description, p.features, p.isPopular, p.isActive);
      }
      const portStmt = db.prepare('INSERT INTO portfolio (id, title, category, categoryName, university, image) VALUES (?, ?, ?, ?, ?, ?)');
      for (const item of DEFAULT_PORTFOLIO) {
        portStmt.run(item.id, item.title, item.category, item.categoryName, item.university, item.image);
      }
      const revStmt = db.prepare('INSERT INTO reviews (id, userId, userName, university, rating, comment, date, isVerified, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const r of DEFAULT_REVIEWS) {
        revStmt.run(r.id, r.userId, r.userName, r.university, r.rating, r.comment, r.date, r.isVerified, r.isPublished);
      }
    }
  }
}

// Auto-run schema init
initSchema().catch(err => console.error('Error during initSchema:', err));

// Unified DAO interface
const DB = {
  // Config
  async getConfig() {
    if (isTurso) {
      const res = await tursoClient.execute('SELECT key, value FROM config');
      const config = {};
      for (const r of res.rows) {
        if (r.key === 'openingHour' || r.key === 'closingHour' || r.key === 'defaultDp') {
          config[r.key] = Number(r.value);
        } else {
          config[r.key] = r.value;
        }
      }
      return config;
    } else {
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
    }
  },

  async updateConfig(updates) {
    if (isTurso) {
      for (const [k, v] of Object.entries(updates)) {
        await tursoClient.execute({
          sql: 'INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
          args: [k, String(v), String(v)]
        });
      }
    } else {
      const stmt = db.prepare('INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?');
      for (const [k, v] of Object.entries(updates)) {
        stmt.run(k, String(v), String(v));
      }
    }
    return this.getConfig();
  },

  // Packages
  async getPackages(activeOnly = false) {
    const sql = activeOnly
      ? 'SELECT * FROM packages WHERE isActive = 1 ORDER BY id ASC'
      : 'SELECT * FROM packages ORDER BY id ASC';
    if (isTurso) {
      const res = await tursoClient.execute(sql);
      return res.rows.map(r => ({
        id: Number(r.id),
        name: r.name,
        price: Number(r.price),
        duration: Number(r.duration),
        maxPersons: Number(r.maxPersons),
        description: r.description,
        features: r.features ? JSON.parse(r.features) : [],
        isPopular: Boolean(r.isPopular),
        isActive: Boolean(r.isActive)
      }));
    } else {
      const rows = db.prepare(sql).all();
      return rows.map(r => ({
        ...r,
        isPopular: Boolean(r.isPopular),
        isActive: Boolean(r.isActive),
        features: r.features ? JSON.parse(r.features) : []
      }));
    }
  },

  async getPackageById(id) {
    if (isTurso) {
      const res = await tursoClient.execute({ sql: 'SELECT * FROM packages WHERE id = ?', args: [Number(id)] });
      if (!res.rows[0]) return null;
      const r = res.rows[0];
      return {
        id: Number(r.id),
        name: r.name,
        price: Number(r.price),
        duration: Number(r.duration),
        maxPersons: Number(r.maxPersons),
        description: r.description,
        features: r.features ? JSON.parse(r.features) : [],
        isPopular: Boolean(r.isPopular),
        isActive: Boolean(r.isActive)
      };
    } else {
      const r = db.prepare('SELECT * FROM packages WHERE id = ?').get(Number(id));
      if (!r) return null;
      return {
        ...r,
        isPopular: Boolean(r.isPopular),
        isActive: Boolean(r.isActive),
        features: r.features ? JSON.parse(r.features) : []
      };
    }
  },

  async savePackage(pkg) {
    const id = pkg.id || Date.now();
    const name = pkg.name || 'Paket';
    const price = Number(pkg.price) || 0;
    const duration = Number(pkg.duration) || 1;
    const maxPersons = Number(pkg.maxPersons) || 1;
    const description = pkg.description || '';
    const featuresJson = JSON.stringify(pkg.features || []);
    const isPopular = pkg.isPopular ? 1 : 0;
    const isActive = pkg.isActive !== false ? 1 : 0;

    if (isTurso) {
      const existing = await tursoClient.execute({ sql: 'SELECT id FROM packages WHERE id = ?', args: [id] });
      if (existing.rows.length > 0) {
        await tursoClient.execute({
          sql: `UPDATE packages SET name = ?, price = ?, duration = ?, maxPersons = ?, description = ?, features = ?, isPopular = ?, isActive = ? WHERE id = ?`,
          args: [name, price, duration, maxPersons, description, featuresJson, isPopular, isActive, id]
        });
      } else {
        await tursoClient.execute({
          sql: `INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [id, name, price, duration, maxPersons, description, featuresJson, isPopular, isActive]
        });
      }
    } else {
      const existing = db.prepare('SELECT id FROM packages WHERE id = ?').get(id);
      if (existing) {
        db.prepare(`UPDATE packages SET name = ?, price = ?, duration = ?, maxPersons = ?, description = ?, features = ?, isPopular = ?, isActive = ? WHERE id = ?`)
          .run(name, price, duration, maxPersons, description, featuresJson, isPopular, isActive, id);
      } else {
        db.prepare(`INSERT INTO packages (id, name, price, duration, maxPersons, description, features, isPopular, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(id, name, price, duration, maxPersons, description, featuresJson, isPopular, isActive);
      }
    }
    return this.getPackageById(id);
  },

  async deletePackage(id) {
    if (isTurso) {
      await tursoClient.execute({ sql: 'DELETE FROM packages WHERE id = ?', args: [Number(id)] });
    } else {
      db.prepare('DELETE FROM packages WHERE id = ?').run(Number(id));
    }
    return true;
  },

  async togglePackage(id) {
    const p = await this.getPackageById(id);
    if (!p) return null;
    const newStatus = p.isActive ? 0 : 1;
    if (isTurso) {
      await tursoClient.execute({ sql: 'UPDATE packages SET isActive = ? WHERE id = ?', args: [newStatus, Number(id)] });
    } else {
      db.prepare('UPDATE packages SET isActive = ? WHERE id = ?').run(newStatus, Number(id));
    }
    return this.getPackageById(id);
  },

  // Bookings
  async getBookings() {
    if (isTurso) {
      const res = await tursoClient.execute('SELECT * FROM bookings ORDER BY id DESC');
      return res.rows.map(r => ({ ...r, id: Number(r.id), totalPrice: Number(r.totalPrice), downPayment: Number(r.downPayment) }));
    } else {
      return db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
    }
  },

  async getBookingByCode(code) {
    const normalized = (code || '').toUpperCase().replace(/^#/, '').trim();
    if (isTurso) {
      const res = await tursoClient.execute({ sql: 'SELECT * FROM bookings WHERE UPPER(bookingCode) = ?', args: [normalized] });
      return res.rows[0] ? { ...res.rows[0], id: Number(res.rows[0].id) } : null;
    } else {
      return db.prepare('SELECT * FROM bookings WHERE UPPER(bookingCode) = ?').get(normalized);
    }
  },

  async getBookingById(id) {
    if (isTurso) {
      const res = await tursoClient.execute({ sql: 'SELECT * FROM bookings WHERE id = ?', args: [Number(id)] });
      return res.rows[0] ? { ...res.rows[0], id: Number(res.rows[0].id) } : null;
    } else {
      return db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(id));
    }
  },

  async getBookedSlotsForDate(dateStr) {
    const sql = `SELECT sessionStart, sessionEnd, status, packageName, duration FROM bookings WHERE bookingDate = ? AND status != 'CANCELLED'`;
    if (isTurso) {
      const res = await tursoClient.execute({ sql, args: [dateStr] });
      return res.rows.map(r => ({ ...r, duration: Number(r.duration) }));
    } else {
      return db.prepare(sql).all(dateStr);
    }
  },

  async createBooking(booking) {
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

    const sql = `
      INSERT INTO bookings (
        id, bookingCode, packageId, packageName, duration, customerName, customerPhone,
        instagram, university, location, bookingDate, sessionStart, sessionEnd,
        totalPrice, downPayment, status, paymentProof, paymentProofUploadedAt,
        driveLink, notes, completedAt, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const args = [
      id, bookingCode, packageId, packageName, duration,
      customerName, customerPhone, instagram,
      university, location, bookingDate, sessionStart,
      sessionEnd, totalPrice, downPayment, status,
      paymentProof, paymentProofUploadedAt,
      driveLink, notes, completedAt, createdAt
    ];

    if (isTurso) {
      await tursoClient.execute({ sql, args });
    } else {
      db.prepare(sql).run(...args);
    }

    return this.getBookingById(id);
  },

  async updateBookingStatus(id, newStatus) {
    if (isTurso) {
      await tursoClient.execute({ sql: 'UPDATE bookings SET status = ? WHERE id = ?', args: [newStatus, Number(id)] });
    } else {
      db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(newStatus, Number(id));
    }
    return this.getBookingById(id);
  },

  async uploadPaymentProof(code, proofBase64) {
    const nowStr = new Date().toLocaleString('id-ID');
    const normalized = (code || '').toUpperCase().replace(/^#/, '').trim();
    const sql = `UPDATE bookings SET paymentProof = ?, paymentProofUploadedAt = ? WHERE UPPER(bookingCode) = ?`;
    if (isTurso) {
      await tursoClient.execute({ sql, args: [proofBase64, nowStr, normalized] });
    } else {
      db.prepare(sql).run(proofBase64, nowStr, normalized);
    }
    return this.getBookingByCode(normalized);
  },

  async completeBooking(id, driveLink) {
    const nowStr = new Date().toLocaleString('id-ID');
    const sql = `UPDATE bookings SET status = 'COMPLETED', driveLink = ?, completedAt = ? WHERE id = ?`;
    if (isTurso) {
      await tursoClient.execute({ sql, args: [driveLink || '', nowStr, Number(id)] });
    } else {
      db.prepare(sql).run(driveLink || '', nowStr, Number(id));
    }
    return this.getBookingById(id);
  },

  async deleteBooking(id) {
    if (isTurso) {
      await tursoClient.execute({ sql: 'DELETE FROM bookings WHERE id = ?', args: [Number(id)] });
    } else {
      db.prepare('DELETE FROM bookings WHERE id = ?').run(Number(id));
    }
    return true;
  },

  // Portfolio
  async getPortfolio(category = null) {
    if (category && category !== 'all') {
      const sql = 'SELECT * FROM portfolio WHERE category = ? ORDER BY id DESC';
      if (isTurso) {
        const res = await tursoClient.execute({ sql, args: [category] });
        return res.rows.map(r => ({ ...r, id: Number(r.id) }));
      } else {
        return db.prepare(sql).all(category);
      }
    }
    const sql = 'SELECT * FROM portfolio ORDER BY id DESC';
    if (isTurso) {
      const res = await tursoClient.execute(sql);
      return res.rows.map(r => ({ ...r, id: Number(r.id) }));
    } else {
      return db.prepare(sql).all();
    }
  },

  async getPortfolioById(id) {
    if (isTurso) {
      const res = await tursoClient.execute({ sql: 'SELECT * FROM portfolio WHERE id = ?', args: [Number(id)] });
      return res.rows[0] ? { ...res.rows[0], id: Number(res.rows[0].id) } : null;
    } else {
      return db.prepare('SELECT * FROM portfolio WHERE id = ?').get(Number(id));
    }
  },

  async savePortfolioItem(item) {
    const id = item.id || Date.now();
    const title = item.title || '';
    const category = item.category || 'other';
    const categoryName = item.categoryName || '';
    const university = item.university || '';
    const image = item.image || '';

    if (isTurso) {
      const existing = await tursoClient.execute({ sql: 'SELECT id FROM portfolio WHERE id = ?', args: [id] });
      if (existing.rows.length > 0) {
        await tursoClient.execute({
          sql: `UPDATE portfolio SET title = ?, category = ?, categoryName = ?, university = ?, image = ? WHERE id = ?`,
          args: [title, category, categoryName, university, image, id]
        });
      } else {
        await tursoClient.execute({
          sql: `INSERT INTO portfolio (id, title, category, categoryName, university, image) VALUES (?, ?, ?, ?, ?, ?)`,
          args: [id, title, category, categoryName, university, image]
        });
      }
    } else {
      const existing = db.prepare('SELECT id FROM portfolio WHERE id = ?').get(id);
      if (existing) {
        db.prepare(`UPDATE portfolio SET title = ?, category = ?, categoryName = ?, university = ?, image = ? WHERE id = ?`)
          .run(title, category, categoryName, university, image, id);
      } else {
        db.prepare(`INSERT INTO portfolio (id, title, category, categoryName, university, image) VALUES (?, ?, ?, ?, ?, ?)`)
          .run(id, title, category, categoryName, university, image);
      }
    }
    return this.getPortfolioById(id);
  },

  async deletePortfolioItem(id) {
    if (isTurso) {
      await tursoClient.execute({ sql: 'DELETE FROM portfolio WHERE id = ?', args: [Number(id)] });
    } else {
      db.prepare('DELETE FROM portfolio WHERE id = ?').run(Number(id));
    }
    return true;
  },

  // Reviews
  async getReviews(publishedOnly = true) {
    const sql = publishedOnly
      ? 'SELECT * FROM reviews WHERE isPublished = 1 ORDER BY id DESC'
      : 'SELECT * FROM reviews ORDER BY id DESC';
    if (isTurso) {
      const res = await tursoClient.execute(sql);
      return res.rows.map(r => ({
        id: Number(r.id),
        userId: r.userId ? Number(r.userId) : null,
        userName: r.userName,
        university: r.university,
        rating: Number(r.rating),
        comment: r.comment,
        date: r.date,
        isVerified: Boolean(r.isVerified),
        isPublished: Boolean(r.isPublished)
      }));
    } else {
      const rows = db.prepare(sql).all();
      return rows.map(r => ({
        ...r,
        isVerified: Boolean(r.isVerified),
        isPublished: Boolean(r.isPublished)
      }));
    }
  },

  async createReview(rev) {
    const id = rev.id || Date.now();
    const dateStr = rev.date || new Date().toISOString().split('T')[0];
    const userId = rev.userId || null;
    const userName = rev.userName || 'Wisudawan';
    const university = rev.university || '';
    const rating = Number(rev.rating) || 5;
    const comment = rev.comment || '';

    const sql = `INSERT INTO reviews (id, userId, userName, university, rating, comment, date, isVerified, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const args = [id, userId, userName, university, rating, comment, dateStr, 1, 1];

    if (isTurso) {
      await tursoClient.execute({ sql, args });
      const res = await tursoClient.execute({ sql: 'SELECT * FROM reviews WHERE id = ?', args: [id] });
      return res.rows[0] ? { ...res.rows[0], id: Number(res.rows[0].id) } : null;
    } else {
      db.prepare(sql).run(...args);
      return db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    }
  },

  async toggleReview(id) {
    const rev = await (isTurso 
      ? (async () => {
          const res = await tursoClient.execute({ sql: 'SELECT * FROM reviews WHERE id = ?', args: [Number(id)] });
          return res.rows[0];
        })()
      : db.prepare('SELECT * FROM reviews WHERE id = ?').get(Number(id)));
    if (!rev) return null;
    const newStatus = rev.isPublished ? 0 : 1;
    if (isTurso) {
      await tursoClient.execute({ sql: 'UPDATE reviews SET isPublished = ? WHERE id = ?', args: [newStatus, Number(id)] });
      const res = await tursoClient.execute({ sql: 'SELECT * FROM reviews WHERE id = ?', args: [Number(id)] });
      return res.rows[0];
    } else {
      db.prepare('UPDATE reviews SET isPublished = ? WHERE id = ?').run(newStatus, Number(id));
      return db.prepare('SELECT * FROM reviews WHERE id = ?').get(Number(id));
    }
  }
};

module.exports = DB;
