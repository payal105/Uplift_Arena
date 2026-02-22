import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminHeader from '../components/AdminHeader';
import api from '../api/axios';

const Turfs = ({ onLogout }) => {
  const [turfs, setTurfs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [formData, setFormData] = useState({
    venue: '',
    name: '',
    sportType: '',
    pricePerHour: '',
    amenities: ''
  });

  const sportTypes = ['CRICKET', 'FOOTBALL', 'BADMINTON', 'BASKETBALL', 'PICKLEBALL'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [turfsRes, venuesRes, citiesRes] = await Promise.all([
        api.get('/api/turfs'),
        api.get('/api/venues'),
        api.get('/api/cities')
      ]);
      setTurfs(turfsRes.data.turfs);
      setVenues(venuesRes.data.venues);
      setCities(citiesRes.data.cities);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      pricePerHour: Number(formData.pricePerHour),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      if (editingTurf) {
        await api.put(`/api/turfs/${editingTurf._id}`, submitData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Turf updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await api.post('/api/turfs', submitData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Turf created successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
      fetchData();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save turf'
      });
    }
  };

  const handleEdit = (turf) => {
    setEditingTurf(turf);
    setFormData({
      venue: turf.venue._id,
      name: turf.name,
      sportType: turf.sportType,
      pricePerHour: turf.pricePerHour,
      amenities: turf.amenities ? turf.amenities.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Turf?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/turfs/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Turf deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete turf'
        });
      }
    }
  };

  const openModal = () => {
    setEditingTurf(null);
    setFormData({
      venue: '',
      name: '',
      sportType: '',
      pricePerHour: '',
      amenities: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTurf(null);
  };

  const getVenueWithCity = (venueId) => {
    const venue = venues.find(v => v._id === venueId);
    if (!venue) return 'Unknown';
    const cityName = venue.city?.name || 'Unknown City';
    return `${venue.name} (${cityName})`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminHeader title="Turfs Management" onLogout={onLogout} />
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>All Turfs ({turfs.length})</h4>
          <button onClick={openModal} className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add New Turf
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Turf Name</th>
                      <th>Venue</th>
                      <th>City</th>
                      <th>Sport Type</th>
                      <th>Price/Hour</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turfs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          No turfs found. Add your first turf!
                        </td>
                      </tr>
                    ) : (
                      turfs.map((turf) => (
                        <tr key={turf._id}>
                          <td className="fw-semibold">{turf.name}</td>
                          <td>{turf.venue?.name || '-'}</td>
                          <td>
                            <span className="badge bg-info">
                              {turf.venue?.city?.name || 'Unknown'}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {turf.sportType}
                            </span>
                          </td>
                          <td>₹{turf.pricePerHour}</td>
                          <td>
                            <span className={`badge ${turf.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {turf.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleEdit(turf)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDelete(turf._id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingTurf ? 'Edit Turf' : 'Add New Turf'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Venue (City) *</label>
                      <select
                        className="form-select"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                      >
                        <option value="">Select a venue</option>
                        {venues.map((venue) => (
                          <option key={venue._id} value={venue._id}>
                            {venue.name} ({venue.city?.name || 'Unknown'})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Turf Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sport Type *</label>
                      <select
                        className="form-select"
                        value={formData.sportType}
                        onChange={(e) => setFormData({ ...formData, sportType: e.target.value })}
                        required
                      >
                        <option value="">Select sport type</option>
                        {sportTypes.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price per Hour (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.pricePerHour}
                        onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amenities (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.amenities}
                      onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                      placeholder="e.g., Parking, Restroom, Drinking Water"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTurf ? 'Update' : 'Create'}
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

export default Turfs;
