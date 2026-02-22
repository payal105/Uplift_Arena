import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminHeader from '../components/AdminHeader';
import api from '../api/axios';

const Slots = ({ onLogout }) => {
  const [slots, setSlots] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  
  const [generateForm, setGenerateForm] = useState({
    turfId: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  const [editForm, setEditForm] = useState({
    status: '',
    blockedBy: ''
  });

  const [filters, setFilters] = useState({
    turfId: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (filters.turfId && filters.date) {
      fetchSlots();
    }
  }, [filters]);

  const fetchTurfs = async () => {
    try {
      const [turfsRes, venuesRes] = await Promise.all([
        api.get('/api/turfs'),
        api.get('/api/venues')
      ]);
      setTurfs(turfsRes.data.turfs);
      setVenues(venuesRes.data.venues);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch turfs'
      });
    }
  };

  const fetchSlots = async () => {
    if (!filters.turfId || !filters.date) return;
    
    setLoading(true);
    try {
      const response = await api.get('/api/slots', {
        params: filters
      });
      setSlots(response.data.slots);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch slots'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSlots = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/slots/generate', generateForm);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Slot created successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      setFilters({
        turfId: generateForm.turfId,
        date: generateForm.date
      });
      
      closeGenerateModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create slot'
      });
    }
  };

  const handleUpdateSlot = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/slots/${editingSlot._id}`, editForm);
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Slot updated successfully',
        timer: 1500,
        showConfirmButton: false
      });
      
      fetchSlots();
      closeEditModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update slot'
      });
    }
  };

  const handleDeleteSlot = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Slot?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/slots/${id}`);
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Slot deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        
        fetchSlots();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete slot'
        });
      }
    }
  };

  const openGenerateModal = () => {
    setGenerateForm({
      turfId: filters.turfId || '',
      date: filters.date || new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: ''
    });
    setShowGenerateModal(true);
  };

  const closeGenerateModal = () => {
    setShowGenerateModal(false);
  };

  const openEditModal = (slot) => {
    setEditingSlot(slot);
    setEditForm({
      status: slot.status,
      blockedBy: slot.blockedBy || ''
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSlot(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      AVAILABLE: 'bg-success',
      BLOCKED: 'bg-warning',
      BOOKED: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getTurfWithVenueCity = (turfId) => {
    const turf = turfs.find(t => t._id === turfId);
    if (!turf) return 'Unknown';
    const venueName = turf.venue?.name || 'Unknown Venue';
    const cityName = turf.venue?.city?.name || 'Unknown City';
    return `${turf.name} - ${venueName} (${cityName})`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminHeader title="Slots Management" onLogout={onLogout} />
      
      <div className="container py-4">
        {/* Filters */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">View Slots</h5>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Select Turf *</label>
                <select
                  className="form-select"
                  value={filters.turfId}
                  onChange={(e) => setFilters({ ...filters, turfId: e.target.value })}
                >
                  <option value="">Choose a turf</option>
                  {turfs.map((turf) => (
                    <option key={turf._id} value={turf._id}>
                      {turf.name} - {turf.venue?.name} ({turf.venue?.city?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Select Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button 
                  onClick={openGenerateModal}
                  className="btn btn-primary w-100"
                  disabled={!filters.turfId || !filters.date}
                >
                  <i className="fas fa-plus me-2"></i>Add New Slot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slots Display */}
        {filters.turfId && filters.date && (
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                Slots for {filters.date}
                <span className="badge bg-primary ms-2">{slots.length} slots</span>
              </h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No slots found. Add slots to get started.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Time Slot</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Blocked By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.map((slot) => (
                        <tr key={slot._id}>
                          <td className="fw-semibold">
                            {slot.startTime} - {slot.endTime}
                          </td>
                          <td>
                            {(() => {
                              const [startH, startM] = slot.startTime.split(':').map(Number);
                              const [endH, endM] = slot.endTime.split(':').map(Number);
                              const duration = (endH * 60 + endM) - (startH * 60 + startM);
                              return `${duration} mins`;
                            })()}
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(slot.status)}`}>
                              {slot.status}
                            </span>
                          </td>
                          <td>{slot.blockedBy || '-'}</td>
                          <td>
                            <button 
                              onClick={() => openEditModal(slot)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteSlot(slot._id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate Slots Modal */}
      {showGenerateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Slot</h5>
                <button type="button" className="btn-close" onClick={closeGenerateModal}></button>
              </div>
              <form onSubmit={handleGenerateSlots}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Turf *</label>
                    <select
                      className="form-select"
                      value={generateForm.turfId}
                      onChange={(e) => setGenerateForm({ ...generateForm, turfId: e.target.value })}
                      required
                    >
                      <option value="">Select a turf</option>
                      {turfs.map((turf) => (
                        <option key={turf._id} value={turf._id}>
                          {turf.name} - {turf.venue?.name} ({turf.venue?.city?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={generateForm.date}
                      onChange={(e) => setGenerateForm({ ...generateForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={generateForm.startTime}
                        onChange={(e) => setGenerateForm({ ...generateForm, startTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">End Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={generateForm.endTime}
                        onChange={(e) => setGenerateForm({ ...generateForm, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeGenerateModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && editingSlot && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Slot Status</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <form onSubmit={handleUpdateSlot}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Time Slot</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${editingSlot.startTime} - ${editingSlot.endTime}`}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      required
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="BLOCKED">Blocked</option>
                      <option value="BOOKED">Booked</option>
                    </select>
                  </div>
                  {editForm.status === 'BLOCKED' && (
                    <div className="mb-3">
                      <label className="form-label">Blocked By</label>
                      <select
                        className="form-select"
                        value={editForm.blockedBy}
                        onChange={(e) => setEditForm({ ...editForm, blockedBy: e.target.value })}
                      >
                        <option value="">None</option>
                        <option value="SYSTEM">System</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TURF_MANAGER">Turf Manager</option>
                      </select>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;
