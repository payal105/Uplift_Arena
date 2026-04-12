import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ViewBookings.css';

// Fixed slots from booking form
const FIXED_SLOTS = [
  { label: '6:00 - 7:00 AM',   startTime: '06:00', endTime: '07:00' },
  { label: '7:00 - 8:00 AM',   startTime: '07:00', endTime: '08:00' },
  { label: '8:00 - 9:00 AM',   startTime: '08:00', endTime: '09:00' },
  { label: '9:00 - 10:00 AM',  startTime: '09:00', endTime: '10:00' },
  { label: '6:00 - 7:00 PM',   startTime: '18:00', endTime: '19:00' },
  { label: '7:00 - 8:00 PM',   startTime: '19:00', endTime: '20:00' },
  { label: '8:00 - 9:00 PM',   startTime: '20:00', endTime: '21:00' },
  { label: '9:00 - 10:00 PM',  startTime: '21:00', endTime: '22:00' },
];

const GAMES = [
  { id: 'CRICKET', name: 'Cricket' },
  { id: 'FUTSAL', name: 'Futsal' },
  { id: 'BIG_TURF', name: 'Big Turf' },
  { id: 'PICKLEBALL', name: 'Pickleball' },
  { id: 'BADMINTON', name: 'Badminton' },
  { id: 'TENNIS', name: 'Tennis' },
];

const TURF_OPTIONS_BY_GAME = {
  CRICKET:    [{ value: 'futsal-turf', label: 'Futsal Turf' }],
  FUTSAL:     [{ value: 'futsal-turf', label: 'Futsal Turf' }],
  BIG_TURF:   [{ value: 'big-turf',   label: 'Big Turf' }],
  PICKLEBALL: [{ value: 'pickleball-court2', label: 'Pickleball (Court 2)' }, { value: 'pickleball-court3', label: 'Pickleball (Court 3)' }],
  BADMINTON:  [{ value: 'badminton-court1', label: 'Badminton (Court 1)' }, { value: 'badminton-court4', label: 'Badminton (Court 4)' }],
  TENNIS:     [{ value: 'tennis-court1', label: 'Tennis (Court 1)' }, { value: 'tennis-court2', label: 'Tennis (Court 2)' }],
};

// Booking Details Modal Component
const BookingDetailsModal = ({ isOpen, isLoading, slotDetailsData, slot, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="booking-details-modal">
        <div className="modal-header">
          <h5 className="modal-title">Booking Details</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner-small"></div>
              <p>Loading...</p>
            </div>
          ) : slotDetailsData ? (
            <div className="booking-details-content">
              <div className="detail-row">
                <span className="detail-label">Booked by:</span>
                <span className="detail-value">{slotDetailsData.customerName || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email id:</span>
                <span className="detail-value">{slotDetailsData.email || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Slot booked:</span>
                <span className="detail-value">{slot?.label || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <p className="no-details">No booking details found</p>
          )}
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn-close-modal" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

const ViewBookings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSport, setSelectedSport] = useState('CRICKET');
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [slotDetailsData, setSlotDetailsData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userInfo);
    if (userData.isAdmin !== 1) {
      navigate('/');
      return;
    }
    setUser(userData);
    fetchBookings(selectedDate);
  }, [navigate, selectedDate, selectedSport]);

  const fetchBookings = async (date) => {
    try {
      setBookingsLoading(true);
      console.log('Fetching bookings for date:', date);
      // Fetch bookings for the selected date and sport using the correct admin endpoint
      const response = await api.get(`/api/form-bookings/all?date=${date}`);
      console.log('API Response:', response);
      // Handle different response formats: bookings array, nested under 'bookings' property, or nested under 'data'
      let bookingsList = [];
      if (Array.isArray(response.data)) {
        bookingsList = response.data;
      } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
        bookingsList = response.data.bookings;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        bookingsList = response.data.data;
      }
      console.log('Total bookings from API:', bookingsList.length);
        
      // Filter bookings by selected date and sport if needed
      const filteredBookings = bookingsList.filter(booking => {
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString() === new Date(date).toLocaleDateString();
        const bookingSport = booking.sport === selectedSport;
        return bookingDate && bookingSport;
      });
      
      console.log('Filtered bookings for date:', filteredBookings.length);
      filteredBookings.forEach((booking, index) => {
        console.log(`Booking ${index}:`, {
          turf: booking.turfName,
          turfId: booking.turfId,
          time: `${booking.fromTime} - ${booking.toTime}`,
          sport: booking.sport,
          customer: booking.customerName,
          date: booking.bookingDate
        });
      });
      
      setBookings(filteredBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTurfsForSport = () => {
    return TURF_OPTIONS_BY_GAME[selectedSport] || [];
  };

  const isSlotBooked = (turfId, slotStartTime) => {
    return bookings.some(booking => {
      // Match by turfId - the API returns turfId as a string
      const matchesTurf = booking.turfId === turfId;
      
      // Match by time - API returns fromTime in 24-hour format (e.g., "20:00")
      // slotStartTime also comes in 24-hour format from FIXED_SLOTS
      const matchesSlot = booking.fromTime === slotStartTime;
      
      if (matchesTurf && matchesSlot) {
        console.log(`✓ SLOT BOOKED: ${booking.turfName} (${turfId}) at ${slotStartTime}`);
      }
      
      return matchesTurf && matchesSlot;
    });
  };

  const getBookingDetailsForSlot = (turfId, slotStartTime) => {
    return bookings.find(booking => 
      booking.turfId === turfId && booking.fromTime === slotStartTime
    );
  };

  const hasTurfBookedSlots = (turfId) => {
    return bookings.some(booking => booking.turfId === turfId);
  };

  return (
    <div className="view-bookings-page">
      <div className="bookings-page-header"></div>

      <div className="container bookings-page-container">
        <div className="bookings-card">
          <div className="bookings-header mb-4">
            <div>
              <h2>Booking Management</h2>
              <p className="text-muted">Select a date to view all bookings or available slots</p>
            </div>
          </div>

          <div className="date-picker-section mb-4">
            <label className="form-label fw-bold">Select Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
          </div>

          <div className="filters-section mb-4">
            <div className="row">
              <div className="col-md-6 col-lg-3 mb-3">
                <label className="form-label fw-bold">Filter by Sport</label>
                <select 
                  className="form-select"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                >
                  {GAMES.map(game => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {bookingsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="bookings-grid">
              <h4 className="mb-4">
                <i className="fa-solid fa-clock me-2"></i>
                Time Slots - {GAMES.find(g => g.id === selectedSport)?.name || selectedSport}
              </h4>
              <p className="text-muted mb-4">Date: {new Date(selectedDate).toLocaleDateString()}</p>
              
              {getTurfsForSport().length > 0 ? (
                getTurfsForSport().map((turf) => {
                  const hasBookings = hasTurfBookedSlots(turf.value);
                  return (
                    <div key={turf.value} className={`turf-section mb-5 ${hasBookings ? 'has-bookings' : ''}`}>
                      <h5 className="mb-3">{turf.label}</h5>
                      <div className="slots-timeline">
                        {FIXED_SLOTS.map((slot, index) => {
                          const booked = isSlotBooked(turf.value, slot.startTime);
                          const bookingDetails = booked ? getBookingDetailsForSlot(turf.value, slot.startTime) : null;
                          
                          const handleSlotClick = async (e) => {
                            if (booked) {
                              e.stopPropagation();
                              setModalOpen(true);
                              setModalLoading(true);
                              setSelectedSlot(slot);
                              setSlotDetailsData(null);
                              
                              try {
                                const response = await api.get(`/api/form-bookings/slot-details/${turf.value}`, {
                                  params: {
                                    date: selectedDate,
                                    startTime: slot.startTime
                                  }
                                });
                                setSlotDetailsData(response.data);
                              } catch (error) {
                                console.error('Error fetching slot details:', error);
                                setSlotDetailsData(null);
                              } finally {
                                setModalLoading(false);
                              }
                            }
                          };

                          const handleModalClose = () => {
                            setModalOpen(false);
                            setSlotDetailsData(null);
                            setSelectedSlot(null);
                          };
                          
                          return (
                            <div 
                              key={index} 
                              className={`time-slot ${booked ? 'booked-slot' : 'available-slot'}`}
                              onClick={handleSlotClick}
                              style={{ cursor: booked ? 'pointer' : 'default' }}
                            >
                              <div className="slot-time">{slot.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="alert alert-info w-100">
                  No turfs available for this sport.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BookingDetailsModal 
        isOpen={modalOpen}
        isLoading={modalLoading}
        slotDetailsData={slotDetailsData}
        slot={selectedSlot}
        onClose={() => {
          setModalOpen(false);
          setSlotDetailsData(null);
          setSelectedSlot(null);
        }}
      />
    </div>
  );
};

export default ViewBookings;
