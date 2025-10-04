import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../utils/api';

// A simple Modal component for the success message
const SuccessModal = ({ isOpen, onClose, leadName }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          width: '400px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 id="success-title" style={{ color: '#27ae60', marginBottom: '15px' }}>Success! 🎉</h2>
        <p style={{ color: '#2c3e50', marginBottom: '20px', fontSize: '1.1rem' }}>
          The new lead <strong>"{leadName || 'New Lead'}"</strong> has been added successfully!
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={onClose} 
            style={{ 
              padding: '12px 25px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            View in Existing Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NewLeads() {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    email: '',
    company: '',
    designation: '',
    source: '',
    notes: '',
  });

  // State for controlling the success modal
  const [showModal, setShowModal] = useState(false);
  const [lastAddedName, setLastAddedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic Validation
    if (!formData.name || !formData.mobile || !formData.email) {
      alert('Please fill out Name, Mobile, and Email fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🔄 Starting lead creation process...');
      
      // Add default values for backend
      const leadData = {
        ...formData,
        status: "New",
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: "Not Assigned"
      };

      console.log('📤 Sending lead data to backend:', leadData);

      const response = await leadsAPI.create(leadData);
      
      console.log('✅ Lead creation response:', response);

      // Show success modal and store details
      setLastAddedName(formData.name);
      setShowModal(true);

      // Reset form
      setFormData({
        name: '',
        mobile: '',
        address: '',
        email: '',
        company: '',
        designation: '',
        source: '',
        notes: '',
      });

      console.log('🎯 Lead created successfully, form reset');

    } catch (error) {
      console.error('❌ Failed to create lead:', error);
      alert(`Failed to create lead: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to close the modal and navigate to Existing Leads
  const handleCloseModal = () => {
    console.log('🔗 Navigating to Existing Leads page');
    setShowModal(false);
    // Navigate to Existing Leads page
    navigate('/existing-leads');
  };

  // Styles
  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  const headerStyle = {
    color: '#2c3e50',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  };

  const formGroupStyle = {
    marginBottom: '0'
  };

  const fullWidthGroupStyle = {
    gridColumn: '1 / -1',
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '0.95rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #dcdfe6',
    borderRadius: '8px',
    color: '#2c3e50',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const buttonStyle = {
    padding: '14px 30px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    width: '200px',
    margin: '0 auto',
    display: 'block',
    opacity: isSubmitting ? 0.7 : 1
  };

  return (
    <main style={pageStyle} role="main">
      <h1 style={headerStyle}>Add New Lead</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        
        {/* Personal Information - First Row */}
        <div style={formGridStyle}>
          {/* Name Input */}
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          {/* Mobile Input */}
          <div style={formGroupStyle}>
            <label htmlFor="mobile" style={labelStyle}>Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Contact Information - Second Row */}
        <div style={formGridStyle}>
          {/* Email Input */}
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>

          {/* Company Input */}
          <div style={formGroupStyle}>
            <label htmlFor="company" style={labelStyle}>Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              style={inputStyle}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Address Input - Full Width */}
        <div style={fullWidthGroupStyle}>
          <label htmlFor="address" style={labelStyle}>Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Enter complete address"
            style={textareaStyle}
            disabled={isSubmitting}
          />
        </div>

        {/* Notes Input - Full Width */}
        <div style={fullWidthGroupStyle}>
          <label htmlFor="notes" style={labelStyle}>Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Enter any additional notes or comments"
            style={textareaStyle}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          style={buttonStyle}
          disabled={isSubmitting}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#219a52';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#27ae60';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {isSubmitting ? 'Adding Lead...' : 'Add New Lead'}
        </button>
      </form>
      
      {/* Success Pop-up/Modal */}
      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        leadName={lastAddedName}
      />
    </main>
  );
}