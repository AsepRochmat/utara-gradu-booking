/**
 * UTARA GRADU - Backend Engine & API Server
 * Powered by Node.js, Express & Dual Database (SQLite / Turso Cloud)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const DB = require('./server/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Logger (Development friendly)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'UTARA GRADU Backend Engine',
    database: process.env.TURSO_DATABASE_URL ? 'Turso Cloud SQLite' : 'Local SQLite',
    timestamp: new Date().toISOString()
  });
});

// 1. CONFIG & SETTINGS
app.get('/api/config', async (req, res) => {
  try {
    const config = await DB.getConfig();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/config', async (req, res) => {
  try {
    const updated = await DB.updateConfig(req.body);
    res.json({ success: true, config: updated, message: 'Pengaturan berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const updated = await DB.updateConfig(req.body);
    res.json({ success: true, config: updated, message: 'Pengaturan berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. PACKAGES
app.get('/api/packages', async (req, res) => {
  try {
    const pkgs = await DB.getPackages(true); // Active only
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/packages', async (req, res) => {
  try {
    const pkgs = await DB.getPackages(false); // All
    res.json(pkgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/packages', async (req, res) => {
  try {
    const saved = await DB.savePackage(req.body);
    res.status(201).json({ success: true, package: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/packages/:id', async (req, res) => {
  try {
    const saved = await DB.savePackage({ ...req.body, id: Number(req.params.id) });
    res.json({ success: true, package: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/packages/:id', async (req, res) => {
  try {
    await DB.deletePackage(Number(req.params.id));
    res.json({ success: true, message: 'Paket berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/packages/:id/toggle', async (req, res) => {
  try {
    const updated = await DB.togglePackage(Number(req.params.id));
    res.json({ success: true, package: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. BOOKINGS
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await DB.getBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get slots for specific date (anti-double booking check)
app.get('/api/bookings/slots', async (req, res) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) {
      return res.status(400).json({ error: 'Parameter date diperlukan (format: YYYY-MM-DD)' });
    }
    const bookedSlots = await DB.getBookedSlotsForDate(dateStr);
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Track single booking by Code
app.get('/api/bookings/track/:code', async (req, res) => {
  try {
    const booking = await DB.getBookingByCode(req.params.code);
    if (!booking) {
      return res.status(404).json({ error: 'Kode booking tidak ditemukan' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new booking with Overlap Conflict Prevention
app.post('/api/bookings', async (req, res) => {
  try {
    const b = req.body;
    if (!b.customerName || !b.customerPhone || !b.bookingDate || !b.sessionStart || !b.sessionEnd) {
      return res.status(400).json({ error: 'Data pemesanan belum lengkap' });
    }

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const newStartMin = toMinutes(b.sessionStart);
    const newEndMin = toMinutes(b.sessionEnd);

    const existingSlots = await DB.getBookedSlotsForDate(b.bookingDate);
    const hasConflict = existingSlots.some(s => {
      const exStartMin = toMinutes(s.sessionStart);
      const exEndMin = toMinutes(s.sessionEnd);
      return (newStartMin < exEndMin && newEndMin > exStartMin);
    });

    if (hasConflict) {
      return res.status(409).json({
        error: 'CONFLICT_SLOT_BOOKED',
        message: 'Maaf, slot jam sesi ini baru saja dipesan oleh wisudawan lain. Silakan pilih slot jam lainnya.'
      });
    }

    if (!b.bookingCode) {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const dateCompact = b.bookingDate.replace(/-/g, '');
      b.bookingCode = `WD-${dateCompact}-${randomNum}`;
    }

    const created = await DB.createBooking(b);
    res.status(201).json({
      success: true,
      booking: created,
      message: 'Jadwal sesi foto wisuda Anda berhasil dicatat dan diamankan di sistem resmi!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm DP status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await DB.updateBookingStatus(Number(req.params.id), status);
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload proof of payment
app.post('/api/bookings/:code/proof', async (req, res) => {
  try {
    const paymentProof = req.body.paymentProof || req.body.proof;
    if (!paymentProof) {
      return res.status(400).json({ error: 'Bukti transfer tidak boleh kosong' });
    }
    const updated = await DB.uploadPaymentProof(req.params.code, paymentProof);
    if (!updated) {
      return res.status(404).json({ error: 'Kode booking tidak ditemukan' });
    }
    res.json({ success: true, booking: updated, message: 'Bukti transfer berhasil disimpan.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete booking with Drive Link
app.patch('/api/bookings/:id/complete', async (req, res) => {
  try {
    const { driveLink } = req.body;
    const updated = await DB.completeBooking(Number(req.params.id), driveLink);
    res.json({ success: true, booking: updated, message: 'Sesi selesai dan link Google Drive tersimpan.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await DB.deleteBooking(Number(req.params.id));
    res.json({ success: true, message: 'Booking berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PORTFOLIO
app.get('/api/portfolio', async (req, res) => {
  try {
    const items = await DB.getPortfolio(req.query.category);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const saved = await DB.savePortfolioItem(req.body);
    res.status(201).json({ success: true, item: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/portfolio/:id', async (req, res) => {
  try {
    const saved = await DB.savePortfolioItem({ ...req.body, id: Number(req.params.id) });
    res.json({ success: true, item: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/portfolio/:id', async (req, res) => {
  try {
    await DB.deletePortfolioItem(Number(req.params.id));
    res.json({ success: true, message: 'Foto portofolio berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. REVIEWS
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await DB.getReviews(true); // Published only
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/reviews', async (req, res) => {
  try {
    const reviews = await DB.getReviews(false); // All
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const created = await DB.createReview(req.body);
    res.status(201).json({ success: true, review: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/reviews/:id/toggle', async (req, res) => {
  try {
    const updated = await DB.toggleReview(Number(req.params.id));
    res.json({ success: true, review: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// STATIC FRONTEND SERVING
// ==========================================
const publicDir = path.join(__dirname, 'public');
const staticDir = fs.existsSync(publicDir) ? publicDir : __dirname;
app.use(express.static(staticDir));

// Single Page Application Fallback
app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Export Express app for Vercel Serverless Functions
module.exports = app;

// Start Server locally if not running as a Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('===================================================');
    console.log('   UTARA GRADU - Backend Engine & API Server      ');
    console.log('===================================================');
    console.log(`🚀 Server aktif di: http://127.0.0.1:${PORT}/`);
    console.log(`📊 REST API ready di: http://127.0.0.1:${PORT}/api/`);
    console.log(`💾 Database Mode: ${process.env.TURSO_DATABASE_URL ? 'Turso Cloud SQLite' : 'Local SQLite'}`);
    console.log('===================================================');
  });
}
