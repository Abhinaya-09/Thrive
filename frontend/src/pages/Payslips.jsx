import React, { useState, useEffect } from 'react';
import { paymentsAPI } from '../utils/api';

// Simple Modal for the success message
const SuccessModal = ({ isOpen, onClose, customerName }) => {
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
        <h2 id="success-title" style={{ color: '#27ae60', marginBottom: '15px' }}>Payment Recorded!</h2>
        <p style={{ color: '#2c3e50', marginBottom: '20px' }}>A new payment from <strong>{customerName || 'Customer'}</strong> has been successfully logged.</p>
        <button 
          onClick={onClose} 
          style={{ 
            padding: '10px 25px', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function PaymentTracker() {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    customer: '',
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    status: 'Completed',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [lastAddedCustomer, setLastAddedCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await paymentsAPI.getAll();
        setPayments(response.payments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleNewPaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewPaymentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newPayment.customer || !newPayment.amount || !newPayment.date) {
      alert('Please fill out Customer Name, Amount, and Date.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(newPayment.amount) || parseFloat(newPayment.amount) <= 0) {
      alert('Please enter a valid positive Amount.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const paymentData = {
        ...newPayment,
        amount: parseFloat(newPayment.amount),
      };

      await paymentsAPI.create(paymentData);
      
      // Refresh payments list
      const response = await paymentsAPI.getAll();
      setPayments(response.payments);
      
      setLastAddedCustomer(newPayment.customer);
      setShowModal(true);

      // Reset form
      setNewPayment({
        customer: '',
        date: new Date().toISOString().slice(0, 10),
        amount: '',
        status: 'Completed',
      });
    } catch (error) {
      console.error('Failed to create payment:', error);
      alert('Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return { 
        backgroundColor: '#27ae60', 
        color: 'white', 
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontWeight: '600',
        fontSize: '0.85rem'
      };
      case 'Pending': return { 
        backgroundColor: '#f39c12', 
        color: 'white', 
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontWeight: '600',
        fontSize: '0.85rem'
      };
      case 'Cancelled': return { 
        backgroundColor: '#e74c3c', 
        color: 'white', 
        padding: '6px 12px', 
        borderRadius: '20px', 
        fontWeight: '600',
        fontSize: '0.85rem'
      };
      default: return {};
    }
  };

  // --- STYLES ---
  const pageStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };

  const headerStyle = {
    color: '#2c3e50',
    marginBottom: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center'
  };

  const sectionHeaderStyle = {
    color: '#34495e',
    margin: '2.5rem 0 1.5rem 0',
    paddingBottom: '0.5rem',
    borderBottom: '3px solid #3498db',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  const formContainerStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    alignItems: 'end'
  };

  const formGroupStyle = {
    marginBottom: '0'
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

  const buttonStyle = {
    padding: '12px 30px', 
    backgroundColor: '#3498db', 
    color: 'white', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    gridColumn: '1 / -1',
    justifySelf: 'start',
    opacity: isSubmitting ? 0.7 : 1
  };

  const tableContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    marginTop: '1rem'
  };

  const tableHeaderStyle = { 
    padding: '16px', 
    textAlign: 'left', 
    borderBottom: '2px solid #e9ecef',
    color: '#2c3e50',
    fontWeight: '600',
    backgroundColor: '#f8f9fa'
  };

  const tableCellStyle = { 
    padding: '14px 16px', 
    borderBottom: '1px solid #e9ecef',
    color: '#2c3e50'
  };

  if (isLoading) {
    return (
      <main style={pageStyle} role="main">
        <h1 style={headerStyle}>Payment Management 💰</h1>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading payments...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle} role="main">
      <h1 style={headerStyle}>Payment Management 💰</h1>
      
      {/* New Payment Form */}
      <section>
        <h2 style={sectionHeaderStyle}>Add New Payment</h2>
        <div style={formContainerStyle}>
          <form onSubmit={handleNewPaymentSubmit} style={formGridStyle}>
            <div style={formGroupStyle}>
              <label htmlFor="customer" style={formLabelStyle}>Customer Name*</label>
              <input 
                type="text" 
                id="customer" 
                name="customer" 
                value={newPayment.customer} 
                onChange={handleNewPaymentChange} 
                required 
                placeholder="Enter customer name"
                style={inputStyle}
                disabled={isSubmitting}
              />
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="amount" style={formLabelStyle}>Amount (INR)*</label>
              <input 
                type="number" 
                id="amount" 
                name="amount" 
                value={newPayment.amount} 
                onChange={handleNewPaymentChange} 
                required 
                min="1" 
                placeholder="Enter amount"
                style={inputStyle}
                disabled={isSubmitting}
              />
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="date" style={formLabelStyle}>Payment Date*</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                value={newPayment.date} 
                onChange={handleNewPaymentChange} 
                required 
                style={inputStyle}
                disabled={isSubmitting}
              />
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="status" style={formLabelStyle}>Status</label>
              <select 
                id="status" 
                name="status" 
                value={newPayment.status} 
                onChange={handleNewPaymentChange} 
                style={inputStyle}
                disabled={isSubmitting}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
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
              {isSubmitting ? 'Recording Payment...' : 'Add Payment Record'}
            </button>
          </form>
        </div>
      </section>

      {/* Payment History Table */}
      <section>
        <h2 style={sectionHeaderStyle}>Payment History</h2>
        {payments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#7f8c8d',
            backgroundColor: 'white',
            borderRadius: '8px',
            marginTop: '2rem',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ color: 'black' }}>No Payments Found</h3>
            <p style={{ color: 'black' }}>Start by adding new payments using the form above.</p>
          </div>
        ) : (
          <div style={tableContainerStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={tableHeaderStyle}>ID</th>
                  <th style={tableHeaderStyle}>Customer/Client</th>
                  <th style={tableHeaderStyle}>Date</th>
                  <th style={{...tableHeaderStyle, textAlign: 'right'}}>Amount (INR)</th>
                  <th style={tableHeaderStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} style={{ transition: 'background-color 0.2s' }}>
                    <td style={tableCellStyle}>{payment.id}</td>
                    <td style={tableCellStyle}>
                      <strong>{payment.customer}</strong>
                    </td>
                    <td style={tableCellStyle}>{payment.date}</td>
                    <td style={{...tableCellStyle, textAlign: 'right', fontWeight: '600', color: '#27ae60'}}>
                      ₹ {payment.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={tableCellStyle}>
                      <span style={getStatusStyle(payment.status)}>{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <SuccessModal 
        isOpen={showModal} 
        onClose={handleCloseModal} 
        customerName={lastAddedCustomer}
      />
    </main>
  );
}