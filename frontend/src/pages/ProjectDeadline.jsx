import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../utils/api';

const SuccessModal = ({ isOpen, onClose, onNavigateToBudget, itemName }) => {
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
          width: '350px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 id="success-title" style={{ color: '#27ae60', marginBottom: '15px' }}>Project Added!</h2>
        <p style={{ color: '#2c3e50', marginBottom: '20px' }}>The project <strong>{itemName || 'New Project'}</strong> has been created successfully.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={onClose} 
            style={{ 
              padding: '10px 25px', 
              backgroundColor: '#95a5a6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
          >
            Close
          </button>
          <button 
            onClick={onNavigateToBudget} 
            style={{ 
              padding: '10px 25px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Set Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NewProject() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    projectName: '',
    details: '',
    deadline: '',
    priority: 'Medium',
  });

  const [showModal, setShowModal] = useState(false);
  const [lastAddedProject, setLastAddedProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.projectName || !formData.deadline) {
      alert('Please fill out Project Name and Deadline fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await projectsAPI.create(formData);
      
      setLastAddedProject(response.project);
      setShowModal(true);

      // Reset form
      setFormData({
        projectName: '',
        details: '',
        deadline: '',
        priority: 'Medium',
      });

    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleNavigateToBudget = () => {
    if (lastAddedProject) {
      navigate('/budget', { 
        state: { 
          project: lastAddedProject 
        } 
      });
    }
    setShowModal(false);
  };

  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  const headerStyle = {
    color: '#2c3e50',
    marginBottom: '0.5rem',
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center'
  };

  const subtitleStyle = {
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.1rem'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  };

  const formGroupStyle = {
    marginBottom: '1.5rem'
  };

  const formLabelStyle = {
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
    minHeight: '100px'
  };

  const buttonStyle = {
    padding: '14px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
    marginTop: '1rem',
    opacity: isSubmitting ? 0.7 : 1
  };

  return (
    <main style={pageStyle} role="main">
      <h1 style={headerStyle}>Add New Project</h1>
      <p style={subtitleStyle}>Create and manage your project deadlines</p>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label htmlFor="projectName" style={formLabelStyle}>Project Name*</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            placeholder="Enter project name"
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="details" style={formLabelStyle}>Project Details</label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the project scope, requirements, etc."
            style={textareaStyle}
            disabled={isSubmitting}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="deadline" style={formLabelStyle}>Deadline*</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="priority" style={formLabelStyle}>Priority Level</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={inputStyle}
            disabled={isSubmitting}
          >
            <option value="High">High (Urgent)</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button 
          type="submit"
          style={buttonStyle}
          disabled={isSubmitting}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
      
      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        onNavigateToBudget={handleNavigateToBudget}
        itemName={lastAddedProject?.projectName}
      />
    </main>
  );
}