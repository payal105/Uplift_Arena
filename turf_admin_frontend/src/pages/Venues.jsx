import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminHeader from '../components/AdminHeader';
import api from '../api/axios';

const Venues = ({ onLogout }) => {
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
    name: '',
    address: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesRes, citiesRes] = await Promise.all([
        api.get('/api/venues'),
        api.get('/api/cities')
      ]);
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

    try {
      if (editingVenue) {
        await api.put(`/api/venues/${editingVenue._id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Venue updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await api.post('/api/venues', formData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Venue created successfully',
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
        text: error.response?.data?.message || 'Failed to save venue'
      });
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      city: venue.city._id,
      name: venue.name,
      address: venue.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Venue?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/venues/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Venue deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete venue'
        });
      }
    }
  };

  const openModal = () => {
    setEditingVenue(null);
    setFormData({ city: '', name: '', address: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVenue(null);
    setFormData({ city: '', name: '', address: '' });
  };

  const getCityName = (cityId) => {
    const city = cities.find(c => c._id === cityId);
    return city ? city.name : '';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminHeader title="Venues Management" onLogout={onLogout} />
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>All Venues ({venues.length})</h4>
          <button onClick={openModal} className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add New Venue
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
                      <th>Venue Name</th>
                      <th>City</th>
                      <th>Address</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venues.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No venues found. Add your first venue!
                        </td>
                      </tr>
                    ) : (
                      venues.map((venue) => (
                        <tr key={venue._id}>
                          <td className="fw-semibold">{venue.name}</td>
                          <td>
                            <span className="badge bg-info">
                              {venue.city?.name || 'Unknown'}
                            </span>
                          </td>
                          <td>{venue.address || '-'}</td>
                          <td>
                            <span className={`badge ${venue.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {venue.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleEdit(venue)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(venue._id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="fas fa-trash"></i> Delete
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
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingVenue ? 'Edit Venue' : 'Add New Venue'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">City *</label>
                    <select
                      className="form-select"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Venue Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingVenue ? 'Update' : 'Create'}
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

export default Venues;
