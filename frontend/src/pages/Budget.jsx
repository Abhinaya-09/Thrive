import React, { useState } from 'react';
import { budgetAPI } from '../utils/api';

// --- Reusing the simple Modal component for the success message ---
const SuccessModal = ({ isOpen, onClose, itemName }) => {
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
          borderRadius: '8px',
          textAlign: 'center',
          width: '350px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 id="success-title" style={{ color: '#17a2b8' }}>Budget Saved!</h2>
        <p>The budget tracking for **{itemName || 'New Budget'}** has been saved successfully.</p>
        <button 
          onClick={onClose} 
          style={{ 
            marginTop: '15px', 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// --- Main SetBudget Component ---

// --- CSS STYLES ---
const DARK_TEXT_COLOR = '#343a40'; 
const PRIMARY_COLOR = '#17a2b8';

// Style for all form labels to ensure they are dark and bold
const formLabelStyle = { 
    display: 'block', 
    marginBottom: '5px', 
    fontWeight: 'bold', 
    color: DARK_TEXT_COLOR 
};

// Style for all input/select/textarea elements
const inputStyle = {
    width: '100%', 
    padding: '10px', 
    boxSizing: 'border-box',
    border: '1px solid #ddd', 
    color: DARK_TEXT_COLOR,
    backgroundColor: '#ffffff',
};

export default function SetBudget() {
  const [budgetData, setBudgetData] = useState({
    budgetName: '',
    estimatedAmount: '',
    actualAmount: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [lastAddedName, setLastAddedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!budgetData.budgetName || !budgetData.estimatedAmount || !budgetData.startDate) {
      alert('Please fill out Budget Name, Estimated Budget, and Start Date fields.');
      setIsSubmitting(false);
      return;
    }
    
    if (isNaN(budgetData.estimatedAmount) || parseFloat(budgetData.estimatedAmount) <= 0) {
        alert('Please enter a valid positive Estimated Budget Amount.');
        setIsSubmitting(false);
        return;
    }

    try {
      // Convert amounts to numbers
      const submitData = {
        ...budgetData,
        estimatedAmount: parseFloat(budgetData.estimatedAmount),
        actualAmount: budgetData.actualAmount ? parseFloat(budgetData.actualAmount) : 0
      };

      await budgetAPI.create(submitData);

      setLastAddedName(budgetData.budgetName);
      setShowModal(true);

      // Reset form
      setBudgetData({
        budgetName: '',
        estimatedAmount: '',
        actualAmount: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  // Placeholder styles
  const placeholderStyles = `
    ::placeholder { 
      color: #999 !important;
      opacity: 1;
    }
    :-ms-input-placeholder {
      color: #999 !important;
    }
    ::-ms-input-placeholder {
      color: #999 !important;
    }
    #estimatedAmount {
        background-color: #f0fff0 !important;
    }
    #actualAmount {
        background-color: #fff0f0 !important;
    }
  `;

  return (
    <main className="page" role="main">
      {/* Injecting placeholder styles */}
      <style>{placeholderStyles}</style> 
      
      <h1>Set New Budget Tracking Item</h1>
      <p>Define the estimated cost and track the actual spending for this budget item.</p>
      
      <form onSubmit={handleSubmit} style={{ 
          maxWidth: '600px', 
          margin: '20px auto', 
          padding: '25px', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          backgroundColor: '#ffffff'
      }}>
        
        {/* Budget Name Input */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="budgetName" style={formLabelStyle}>Budget Item Name*</label>
          <input
            type="text"
            id="budgetName"
            name="budgetName"
            value={budgetData.budgetName}
            onChange={handleChange}
            required
            placeholder="e.g., Q4 Marketing, Project Alpha Costs"
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>

        {/* Estimated and Actual Budget Amounts */}
        <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
                <label htmlFor="estimatedAmount" style={formLabelStyle}>Estimated Budget (INR)*</label>
                <input
                    type="number" 
                    id="estimatedAmount"
                    name="estimatedAmount"
                    value={budgetData.estimatedAmount}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="e.g., 100000"
                    style={inputStyle}
                    disabled={isSubmitting}
                />
            </div>
            <div style={{ flex: 1 }}>
                <label htmlFor="actualAmount" style={formLabelStyle}>Actual Budget (INR)</label>
                <input
                    type="number"
                    id="actualAmount"
                    name="actualAmount"
                    value={budgetData.actualAmount}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g., 85000 (Optional for later update)"
                    style={inputStyle}
                    disabled={isSubmitting}
                />
            </div>
        </div>
        
        {/* Time Period Inputs (Start and End Date) */}
        <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
                <label htmlFor="startDate" style={formLabelStyle}>Start Date*</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={budgetData.startDate}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    disabled={isSubmitting}
                />
            </div>
            <div style={{ flex: 1 }}>
                <label htmlFor="endDate" style={formLabelStyle}>End Date</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={budgetData.endDate}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={isSubmitting}
                />
            </div>
        </div>

        {/* Notes/Justification */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="notes" style={formLabelStyle}>Notes (Scope/Assumptions)</label>
          <textarea
            id="notes"
            name="notes"
            value={budgetData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Document the scope of this budget or any assumptions made."
            style={inputStyle}
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          style={{ 
            padding: '12px 25px', 
            backgroundColor: PRIMARY_COLOR, 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            opacity: isSubmitting ? 0.7 : 1
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Budget...' : 'Save Budget Tracking'}
        </button>
      </form>
      
      {/* Success Pop-up/Modal */}
      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        itemName={lastAddedName}
      />
    </main>
  );
}