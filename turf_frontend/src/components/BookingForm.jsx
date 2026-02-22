import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const BookingForm = () => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [activeGame, setActiveGame] = useState('CRICKET');
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [allVenues, setAllVenues] = useState([]);
  const [venues, setVenues] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: getTodayDate(),
    cityId: '',
    venueId: '',
    turfId: '',
    groundType: '',
    selectedSlots: []
  });

  const games = [
    { id: 'CRICKET', name: 'Cricket', icon: '/assets/images/g2.png' },
    { id: 'FOOTBALL', name: 'Football', icon: '/assets/images/g1.png' },
    { id: 'PICKLEBALL', name: 'Pickleball', icon: '/assets/images/g3.png' },
    { id: 'BADMINTON', name: 'Badminton', icon: '/assets/images/g5.png' },
    { id: 'TENNIS', name: 'Tennis', icon: '/assets/images/g6.png' }
  ];

  // Fetch cities on mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch venues when city changes
  useEffect(() => {
    if (formData.cityId) {
      fetchVenues(formData.cityId);
    }
  }, [formData.cityId]);

  // Filter venues when sport changes
  useEffect(() => {
    if (allVenues.length > 0) {
      filterVenuesBySport();
    }
  }, [activeGame, allVenues]);

  // Fetch turfs when venue or sport changes
  useEffect(() => {
    if (formData.venueId) {
      fetchTurfs(formData.venueId, activeGame);
    }
  }, [formData.venueId, activeGame]);

  // Fetch slots when turf and date change
  useEffect(() => {
    if (formData.turfId && formData.date) {
      fetchSlots(formData.turfId, formData.date);
    }
  }, [formData.turfId, formData.date]);

  const fetchCities = async () => {
    try {
      const response = await api.get('/api/cities');
      setCities(response.data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchVenues = async (cityId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/venues/city/${cityId}`);
      setAllVenues(response.data.venues || []);
      // Filter immediately after fetching
      const filteredVenues = (response.data.venues || []).filter(venue => 
        venue.turfs && venue.turfs.some(turf => turf.sportType === activeGame)
      );
      setVenues(filteredVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      setAllVenues([]);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const filterVenuesBySport = () => {
    const filteredVenues = allVenues.filter(venue => 
      venue.turfs && venue.turfs.some(turf => turf.sportType === activeGame)
    );
    setVenues(filteredVenues);
    // Reset venue selection if current venue doesn't have the sport
    if (formData.venueId) {
      const isVenueValid = filteredVenues.some(v => v._id === formData.venueId);
      if (!isVenueValid) {
        setFormData(prev => ({ ...prev, venueId: '', turfId: '' }));
        setTurfs([]);
        setSlots([]);
      }
    }
  };

  const fetchTurfs = async (venueId, sportType) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/turfs?venueId=${venueId}&sportType=${sportType}`);
      setTurfs(response.data.turfs || []);
    } catch (error) {
      console.error('Error fetching turfs:', error);
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (turfId, date) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/slots?turfId=${turfId}&date=${date}`);
      console.log('Fetched slots:', response.data.slots);
      setSlots(response.data.slots || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotToggle = (slot) => {
    setFormData(prev => {
      const isSelected = prev.selectedSlots.some(s => s._id === slot._id);
      if (isSelected) {
        return { ...prev, selectedSlots: prev.selectedSlots.filter(s => s._id !== slot._id) };
      } else {
        return { ...prev, selectedSlots: [...prev.selectedSlots, slot] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.selectedSlots.length === 0) {
      alert('Please select at least one time slot');
      return;
    }
    setShowModal(true);
  };

  const isSlotSelected = (slot) => {
    return formData.selectedSlots.some(s => s._id === slot._id);
  };

  const calculateSlotPrice = (slot) => {
    if (!slot.turf || !slot.turf.pricePerHour) return 0;
    
    // If slot has slotDurationMinutes from turf, use that
    if (slot.turf.slotDurationMinutes) {
      const durationHours = slot.turf.slotDurationMinutes / 60;
      return Math.round(slot.turf.pricePerHour * durationHours);
    }
    
    // Otherwise calculate from start and end time
    const [startHour, startMin] = slot.startTime.split(':').map(Number);
    const [endHour, endMin] = slot.endTime.split(':').map(Number);
    const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const durationHours = durationMinutes / 60;
    
    return Math.round(slot.turf.pricePerHour * durationHours);
  };

  return (
    <section className="book-court-section section-padding" id="booking">
      <div className="container">
        <div className="heading-part text-center">
          <h2>Book Your Court</h2>
          <p>Select your preferred game, date, and time slot to book your court</p>
        </div>

        <div className="court-form-area">
          <div className="nav-area">
            <h3>Choose Your Game</h3>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              {games.map((game) => (
                <li className="nav-item" role="presentation" key={game.id}>
                  <button
                    className={`nav-link ${activeGame === game.id ? 'active' : ''}`}
                    onClick={() => setActiveGame(game.id)}
                    type="button"
                    role="tab"
                  >
                    <img src={game.icon} alt={game.name} /> {game.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="tab-content">
              <div className="tab-pane active" role="tabpanel">
                <div className="booking-form-area">
                  <div className="row gx-5 gy-4">
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_date" className="form-label">
                          Select Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="b_date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_city" className="form-label">
                          Select Cities
                        </label>
                        <select
                          className="form-select form-control"
                          value={formData.cityId}
                          onChange={(e) => {
                            setFormData({ ...formData, cityId: e.target.value, venueId: '', turfId: '' });
                            setVenues([]);
                            setTurfs([]);
                            setSlots([]);
                          }}
                          required
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_venue" className="form-label">
                          Select Venues
                        </label>
                        <select
                          className="form-select form-control"
                          value={formData.venueId}
                          onChange={(e) => {
                            setFormData({ ...formData, venueId: e.target.value, turfId: '' });
                            setTurfs([]);
                            setSlots([]);
                          }}
                          required
                          disabled={!formData.cityId}
                        >
                          <option value="">Select Venue</option>
                          {venues.map((venue) => (
                            <option key={venue._id} value={venue._id}>
                              {venue.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg">
                      <div className="form-group">
                        <label htmlFor="b_turf" className="form-label">
                          Select Turf
                        </label>
                        <select
                          className="form-select form-control"
                          value={formData.turfId}
                          onChange={(e) => {
                            setFormData({ ...formData, turfId: e.target.value });
                            setSlots([]);
                          }}
                          required
                          disabled={!formData.venueId}
                        >
                          <option value="">Select Turf</option>
                          {turfs.map((turf) => (
                            <option key={turf._id} value={turf._id}>
                              {turf.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {formData.turfId && (
                    <div className="ground-part">
                      <div className="row top-part justify-content-between">
                        <div className="col-auto">
                          <h4>
                            {turfs.find(t => t._id === formData.turfId)?.name || activeGame}
                          </h4>
                          <div className="form-group">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="ground"
                                id="halfground"
                                value="half"
                                onChange={(e) => setFormData({ ...formData, groundType: e.target.value })}
                              />
                              <label className="form-check-label" htmlFor="halfground">
                                Half Ground
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="ground"
                                id="fullground"
                                value="full"
                                onChange={(e) => setFormData({ ...formData, groundType: e.target.value })}
                              />
                              <label className="form-check-label" htmlFor="fullground">
                                Full Ground
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="time-slot-main">
                      <h4>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg> Available Time Slots
                      </h4>
                      {loading ? (
                        <div className="text-center p-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : slots.length === 0 ? (
                        <p className="text-center p-4">No slots available. Please select date and turf.</p>
                      ) : (
                        <div className="time-slots">
                          {slots.map((slot) => (
                            <div 
                              className={`form-check ${isSlotSelected(slot) ? 'selected-slot' : ''}`} 
                              key={slot._id}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="time_slot"
                                id={`slot-${slot._id}`}
                                checked={isSlotSelected(slot)}
                                onChange={() => handleSlotToggle(slot)}
                                disabled={slot.status !== 'AVAILABLE'}
                              />
                              <label className="form-check-label" htmlFor={`slot-${slot._id}`}>
                                {slot.startTime} - {slot.endTime}
                                <br />
                                <span>₹{calculateSlotPrice(slot)}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-100 text-center mt-5">
              <button type="submit" className="btn btn-secondary">
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show booking-modal" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#08295E', color: 'white' }}>
                <h3 className="modal-title fs-5">Personal Information</h3>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-area">
                  <input type="text" className="form-control" placeholder="Full Name" required />
                  <input type="tel" className="form-control" placeholder="Phone Number" required />
                  <input type="email" className="form-control" placeholder="Email Address" required />
                  <input type="submit" value="Submit" className="btn btn-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
    </section>
  );
};

export default BookingForm;
