import React, { useState, useCallback } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/axios';

/* static turf definitions */
const TURFS = [
  { id: 'futsal-turf',       label: 'Futsal Turf',         sport: 'FUTSAL',      emoji: '⚽' },
  { id: 'big-turf',          label: 'Big Turf',             sport: 'BIG_TURF',    emoji: '🏏' },
  { id: 'badminton-court1',  label: 'Badminton (Court 1)',  sport: 'BADMINTON',   emoji: '🏸' },
  { id: 'badminton-court4',  label: 'Badminton (Court 4)',  sport: 'BADMINTON',   emoji: '🏸' },
  { id: 'pickleball-court2', label: 'Pickleball (Court 2)', sport: 'PICKLEBALL',  emoji: '🏓' },
  { id: 'pickleball-court3', label: 'Pickleball (Court 3)', sport: 'PICKLEBALL',  emoji: '🏓' },
  { id: 'tennis-court1',     label: 'Tennis (Court 1)',     sport: 'TENNIS',      emoji: '🎾' },
  { id: 'tennis-court2',     label: 'Tennis (Court 2)',     sport: 'TENNIS',      emoji: '🎾' },
];

const FIXED_SLOTS = [
  { startTime: '06:00', endTime: '07:00' },
  { startTime: '07:00', endTime: '08:00' },
  { startTime: '08:00', endTime: '09:00' },
  { startTime: '09:00', endTime: '10:00' },
  { startTime: '17:30', endTime: '18:30' },
  { startTime: '18:30', endTime: '19:30' },
  { startTime: '19:30', endTime: '20:30' },
  { startTime: '20:30', endTime: '21:30' },
];

const todayStr = () => new Date().toISOString().split('T')[0];

const addDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

const getDatesInRange = (from, to) => {
  const dates = [];
  let cur = from;
  while (cur <= to) { dates.push(cur); cur = addDays(cur, 1); }
  return dates;
};

const formatDate = (dateStr) =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

const isSlotBooked = (bookingsForTurf, fixedSlot) =>
  bookingsForTurf.some((b) =>
    b.slots.some((s) => s.startTime < fixedSlot.endTime && s.endTime > fixedSlot.startTime)
  );

const SlotChip = ({ slot, booked, bookedBy }) => {
  const p = booked
    ? { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', label: 'Booked' }
    : { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', label: 'Free' };
  return (
    <div title={booked && bookedBy ? `Booked by: ${bookedBy}` : ''}
      style={{ ...styles.chip, background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
      <span style={styles.chipTime}>{slot.startTime}–{slot.endTime}</span>
      <span style={styles.chipLabel}>{p.label}</span>
    </div>
  );
};

const BookingReport = ({ onLogout }) => {
  const [fromDate, setFromDate] = useState(todayStr());
  const [toDate, setToDate]     = useState(todayStr());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [openDates, setOpenDates] = useState({});

  const toggleDate = (d) => setOpenDates((prev) => ({ ...prev, [d]: !prev[d] }));

  const handleGenerate = useCallback(async () => {
    if (!fromDate || !toDate) return;
    if (fromDate > toDate) { setError('From date cannot be after To date.'); return; }
    const dates = getDatesInRange(fromDate, toDate);
    if (dates.length > 31) { setError('Please select a range of 31 days or fewer.'); return; }
    setError(''); setLoading(true); setReportData(null);
    try {
      const res = await api.get('/api/form-bookings/all');
      const allBookings = res.data.bookings || [];
      const results = {};
      dates.forEach((date) => {
        results[date] = {};
        TURFS.forEach((t) => { results[date][t.id] = []; });
      });
      allBookings.forEach((b) => {
        if (b.status === 'cancelled') return;
        if (results[b.bookingDate] && results[b.bookingDate][b.turfId] !== undefined) {
          results[b.bookingDate][b.turfId].push(b);
        }
      });
      setReportData(results);
      const opened = {};
      dates.forEach((d) => { opened[d] = true; });
      setOpenDates(opened);
    } catch (e) {
      setError(e.response?.status === 401
        ? 'Session expired. Please log out and log in again.'
        : 'Failed to fetch report data. Please try again.');
    } finally { setLoading(false); }
  }, [fromDate, toDate]);

  const dates = reportData ? Object.keys(reportData).sort() : [];

  const summaryFor = (date) => {
    let booked = 0, free = 0;
    TURFS.forEach((t) => {
      const tb = reportData[date][t.id] || [];
      FIXED_SLOTS.forEach((s) => { if (isSlotBooked(tb, s)) booked++; else free++; });
    });
    return { booked, free };
  };

  return (
    <div style={styles.page}>
      <NavBar onLogout={onLogout} />
      <main style={styles.main}>
        <h2 style={styles.pageTitle}>📊 Booking Report</h2>
        <p style={styles.pageSubtitle}>View slot availability across all turfs for a selected date range.</p>

        <div style={styles.filterCard}>
          <div style={styles.filterRow}>
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>From Date</label>
              <input type="date" value={fromDate} max={toDate}
                onChange={(e) => setFromDate(e.target.value)} style={styles.dateInput} />
            </div>
            <div style={styles.filterField}>
              <label style={styles.filterLabel}>To Date</label>
              <input type="date" value={toDate} min={fromDate}
                onChange={(e) => setToDate(e.target.value)} style={styles.dateInput} />
            </div>
            <button onClick={handleGenerate} disabled={loading}
              style={{ ...styles.generateBtn, opacity: loading ? 0.6 : 1 }}>
              {loading ? '⏳ Loading…' : '🔍 Generate Report'}
            </button>
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Fetching bookings…</p>
          </div>
        )}

        {!loading && reportData && dates.map((date) => {
          const summary = summaryFor(date);
          const isOpen  = openDates[date];
          return (
            <div key={date} style={styles.dateBlock}>
              <button style={styles.dateHeader} onClick={() => toggleDate(date)}>
                <div style={styles.dateHeaderLeft}>
                  <span style={styles.dateHeaderIcon}>📅</span>
                  <span style={styles.dateHeaderText}>{formatDate(date)}</span>
                </div>
                <div style={styles.dateSummary}>
                  <span style={{ ...styles.badge, background: '#fee2e2', color: '#991b1b' }}>🔴 {summary.booked} Booked</span>
                  <span style={{ ...styles.badge, background: '#d1fae5', color: '#065f46' }}>🟢 {summary.free} Free</span>
                  <span style={styles.chevron}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div style={styles.dateBody}>
                  {TURFS.map((turf) => {
                    const turfBookings = reportData[date][turf.id] || [];
                    const bookedCount = FIXED_SLOTS.filter((s) => isSlotBooked(turfBookings, s)).length;
                    return (
                      <div key={turf.id} style={styles.turfRow}>
                        <div style={styles.turfInfo}>
                          <span style={styles.turfEmoji}>{turf.emoji}</span>
                          <div>
                            <p style={styles.turfName}>{turf.label}</p>
                            <p style={styles.turfSport}>{turf.sport}</p>
                          </div>
                          <div style={styles.turfMiniStats}>
                            <span style={styles.miniStatBooked}>{bookedCount} booked</span>
                            <span style={styles.miniStatFree}>{FIXED_SLOTS.length - bookedCount} free</span>
                          </div>
                        </div>
                        <div style={styles.slotGrid}>
                          {FIXED_SLOTS.map((slot) => {
                            const booked = isSlotBooked(turfBookings, slot);
                            const booking = booked
                              ? turfBookings.find((b) => b.slots.some((s) => s.startTime < slot.endTime && s.endTime > slot.startTime))
                              : null;
                            return (
                              <SlotChip key={slot.startTime} slot={slot} booked={booked}
                                bookedBy={booking ? `${booking.customerName} (${booking.phone})` : null} />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, padding: '36px 32px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  pageTitle: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '28px' },
  filterCard: { background: '#fff', borderRadius: '14px', padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '28px' },
  filterRow: { display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' },
  filterField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  filterLabel: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  dateInput: { padding: '10px 14px', border: '1.5px solid #d1d5db', borderRadius: '8px', fontSize: '14px', outline: 'none', minWidth: '175px' },
  generateBtn: { padding: '11px 26px', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  errorText: { color: '#dc2626', fontSize: '13px', marginTop: '10px' },
  loadingBox: { textAlign: 'center', padding: '60px 0' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #0f3460', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' },
  loadingText: { color: '#6b7280', fontSize: '15px' },
  dateBlock: { background: '#fff', borderRadius: '14px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' },
  dateHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #f3f4f6' },
  dateHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  dateHeaderIcon: { fontSize: '20px' },
  dateHeaderText: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  dateSummary: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  chevron: { fontSize: '12px', color: '#9ca3af', marginLeft: '4px' },
  dateBody: { padding: '8px 0' },
  turfRow: { padding: '16px 24px', borderBottom: '1px solid #f9fafb' },
  turfInfo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  turfEmoji: { fontSize: '24px' },
  turfName: { fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 },
  turfSport: { fontSize: '12px', color: '#6b7280', margin: 0 },
  turfMiniStats: { display: 'flex', gap: '8px', marginLeft: 'auto' },
  miniStatBooked: { background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  miniStatFree: { background: '#d1fae5', color: '#065f46', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  slotGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', minWidth: '90px', cursor: 'default' },
  chipTime: { fontSize: '11px', fontWeight: '600' },
  chipLabel: { fontSize: '10px', marginTop: '2px', fontWeight: '500', opacity: 0.85 },
};

export default BookingReport;
