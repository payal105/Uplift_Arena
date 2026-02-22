import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AdminHeader from '../components/AdminHeader';
import api from '../api/axios';

const Cities = ({ onLogout }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    country: 'India'
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await api.get('/api/cities');
      setCities(response.data.cities);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch cities'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCity) {
        await api.put(`/api/cities/${editingCity._id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'City updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        await api.post('/api/cities', formData);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'City created successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
      fetchCities();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to save city'
      });
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      state: city.state || '',
      country: city.country || 'India'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete City?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/cities/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'City deleted successfully',
          timer: 1500,
          showConfirmButton: false
        });
        fetchCities();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete city'
        });
      }
    }
  };

  const openModal = () => {
    setEditingCity(null);
    setFormData({ name: '', state: '', country: 'India' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCity(null);
    setFormData({ name: '', state: '', country: 'India' });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <AdminHeader title="Cities Management" onLogout={onLogout} />
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>All Cities ({cities.length})</h4>
          <button onClick={openModal} className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add New City
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
                      <th>Name</th>
                      <th>State</th>
                      <th>Country</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No cities found. Add your first city!
                        </td>
                      </tr>
                    ) : (
                      cities.map((city) => (
                        <tr key={city._id}>
                          <td className="fw-semibold">{city.name}</td>
                          <td>{city.state || '-'}</td>
                          <td>{city.country}</td>
                          <td>
                            <span className={`badge ${city.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {city.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button 
                              onClick={() => handleEdit(city)}
                              className="btn btn-sm btn-outline-primary me-2"
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(city._id)}
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
                  {editingCity ? 'Edit City' : 'Add New City'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">City Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCity ? 'Update' : 'Create'}
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

export default Cities;
