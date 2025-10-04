import React, { useState, useEffect } from 'react';
import { leadsAPI } from '../utils/api';

// Simple Modal for editing leads
const EditModal = ({ isOpen, onClose, lead, onSave }) => {
  const [editedLead, setEditedLead] = useState({
    status: lead?.status || 'New',
    nextFollowUp: lead?.nextFollowUp || new Date().toISOString().split('T')[0],
    assignedTo: lead?.assignedTo || 'Not Assigned'
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !lead) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLead(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editedLead.status || !editedLead.nextFollowUp) {
      alert("Status and Next Follow-up Date are required!");
      return;
    }

    setIsSaving(true);
    try {
      console.log('🔄 Saving lead changes:', editedLead);
      await onSave(editedLead);
    } catch (error) {
      console.error('❌ Failed to save lead:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-title"
    >
      <div 
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: 'black',
        }}
      >
        <h2 id="edit-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', color: 'black' }}>
          Edit Lead: {lead.name}
        </h2>
        
        {/* Current Lead Info */}
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Email:</strong> {lead.email}</p>
          <p><strong>Company:</strong> {lead.company || 'Not specified'}</p>
        </div>
        
        {/* Lead Status Dropdown */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', color: 'black', marginBottom: '5px' }}>Status*</label>
          <select
            name="status"
            value={editedLead.status}
            onChange={handleChange}
            required
            disabled={isSaving}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              color: 'black',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed Won">Closed - Won</option>
            <option value="Closed Lost">Closed - Lost</option>
          </select>
        </div>

        {/* Next Follow-up Date */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', color: 'black', marginBottom: '5px' }}>Next Follow-up Date*</label>
          <input
            type="date"
            name="nextFollowUp"
            value={editedLead.nextFollowUp}
            onChange={handleChange}
            required
            disabled={isSaving}
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              color: 'black',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Assigned To */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', color: 'black', marginBottom: '5px' }}>Assigned To</label>
          <input
            type="text"
            name="assignedTo"
            value={editedLead.assignedTo}
            onChange={handleChange}
            disabled={isSaving}
            placeholder="Enter assignee name"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              color: 'black',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={onClose} 
            disabled={isSaving}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: isSaving ? '#6c757d' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Sample data to initialize the database
const sampleLeads = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@abccorp.com",
    mobile: "+91 9876543210",
    address: "123 MG Road, Bangalore, Karnataka 560001",
    company: "ABC Corporation",
    designation: "Project Manager",
    source: "Referral",
    notes: "Interested in enterprise solutions. Met at tech conference.",
    status: "New",
    nextFollowUp: "2024-10-10",
    assignedTo: "Sales Team A"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@xyztech.com",
    mobile: "+91 8765432109",
    address: "456 Park Street, Mumbai, Maharashtra 400001",
    company: "XYZ Technologies",
    designation: "CTO",
    source: "Website",
    notes: "Looking for AI integration services. High budget project.",
    status: "Contacted",
    nextFollowUp: "2024-10-12",
    assignedTo: "Enterprise Sales"
  },
  {
    name: "Amit Patel",
    email: "amit.patel@startupinnov.com",
    mobile: "+91 7654321098",
    address: "789 Tech Park, Hyderabad, Telangana 500081",
    company: "Startup Innovations",
    designation: "Founder & CEO",
    source: "Social Media",
    notes: "Early stage startup, needs MVP development.",
    status: "Qualified",
    nextFollowUp: "2024-10-08",
    assignedTo: "Startup Team"
  }
];

export default function ExistingLeads() {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dataInitialized, setDataInitialized] = useState(false);

  // Load leads from backend API and initialize sample data if empty
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        const response = await leadsAPI.getAll();
        
        if (response.leads && response.leads.length === 0) {
          // No leads found, initialize with sample data
          console.log('Initializing with sample data...');
          await initializeSampleData();
          setDataInitialized(true);
        } else {
          setLeads(response.leads);
          setDataInitialized(true);
        }
        setError('');
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        setError('Failed to load leads. Please try again.');
        
        // Fallback: Use sample data directly
        setLeads(sampleLeads.map((lead, index) => ({
          ...lead,
          id: `sample-${index + 1}`,
          createdAt: new Date().toISOString()
        })));
        setDataInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Function to initialize sample data in the database
  const initializeSampleData = async () => {
    try {
      const createdLeads = [];
      for (const sampleLead of sampleLeads) {
        try {
          const response = await leadsAPI.create(sampleLead);
          if (response.lead) {
            createdLeads.push(response.lead);
          }
        } catch (err) {
          console.error('Error creating sample lead:', err);
        }
      }
      setLeads(createdLeads);
      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
      throw error;
    }
  };

  // Function to fetch leads from backend
  const fetchLeads = async () => {
    try {
      console.log('🔄 Fetching leads from backend...');
      setIsLoading(true);
      const response = await leadsAPI.getAll();
      
      console.log('✅ Leads fetched successfully:', response);
      console.log('📊 Number of leads:', response.leads ? response.leads.length : 0);
      
      if (response.leads) {
        setLeads(response.leads);
        console.log('🎯 Leads state updated with:', response.leads.length, 'leads');
      } else {
        console.warn('⚠️ No leads array in response:', response);
        setLeads([]);
      }
      
      setError('');
    } catch (error) {
      console.error('❌ Failed to fetch leads:', error);
      setError(`Failed to load leads: ${error.message}`);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open the modal and set the lead to be edited
  const handleEdit = (lead) => {
    try {
      console.log('✏️ Opening edit modal for lead:', lead);
      setSelectedLead(lead);
      setIsModalOpen(true);
    } catch (error) {
      console.error('❌ Error opening edit modal:', error);
      alert('Error opening edit form. Please try again.');
    }
  };

  // Function to save the changes back to backend
  const handleSaveLead = async (updateData) => {
    try {
      console.log('🔄 Starting lead update process...');
      console.log('📤 Update data:', updateData);
      console.log('🎯 Lead ID to update:', selectedLead.id);

      // Send the update to the backend
      const response = await leadsAPI.update(selectedLead.id, updateData);
      console.log('✅ Lead update response:', response);

      // Refresh the leads list to get updated data
      await fetchLeads();
      
      // Close the modal
      setIsModalOpen(false);
      setSelectedLead(null);
      
      // Show success message
      alert('Lead updated successfully!');
      
    } catch (error) {
      console.error('❌ Failed to update lead:', error);
      throw new Error(error.message || 'Failed to update lead');
    }
  };

  // Function to delete a lead
  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        console.log('🔄 Deleting lead:', leadId);
        await leadsAPI.delete(leadId);
        
        // Refresh the leads list
        await fetchLeads();
        console.log('✅ Lead deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete lead:', error);
        alert('Failed to delete lead. Please try again.');
      }
    }
  };

  // Function to add sample data manually
  const handleAddSampleData = async () => {
    if (window.confirm('This will add sample leads to the database. Continue?')) {
      setIsLoading(true);
      try {
        await initializeSampleData();
        alert('Sample data added successfully!');
      } catch (error) {
        console.error('Failed to add sample data:', error);
        alert('Failed to add sample data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to refresh leads manually
  const handleRefresh = () => {
    console.log('🔄 Manually refreshing leads...');
    fetchLeads();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { backgroundColor: '#3498db', color: 'white' };
      case 'Contacted': return { backgroundColor: '#f39c12', color: 'white' };
      case 'Qualified': return { backgroundColor: '#9b59b6', color: 'white' };
      case 'Proposal Sent': return { backgroundColor: '#e67e22', color: 'white' };
      case 'Closed Won': return { backgroundColor: '#27ae60', color: 'white' };
      case 'Closed Lost': return { backgroundColor: '#e74c3c', color: 'white' };
      default: return { backgroundColor: '#95a5a6', color: 'white' };
    }
  };

  // Simple styling objects for the table
  const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    color: 'black',
    fontWeight: 'bold'
  };

  const tableCellStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    color: 'black',
  };

  if (isLoading) {
    return (
      <main className="page" role="main" style={{ color: 'black', padding: '20px' }}>
        <h1 style={{ color: 'black' }}>Existing Leads Management</h1>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading leads...</p>
          {!dataInitialized && <p>Initializing sample data...</p>}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page" role="main" style={{ color: 'black', padding: '20px' }}>
        <h1 style={{ color: 'black' }}>Existing Leads Management</h1>
        <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          {error}
          <br />
          <button 
            onClick={handleRefresh}
            style={{ 
              marginTop: '10px',
              padding: '8px 16px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page" role="main" style={{ color: 'black', padding: '20px' }}>
      <h1 style={{ color: 'black' }}>Existing Leads Management</h1>
      
      {/* Add Sample Data Button */}
      {leads.length === 0 && (
        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #b3d9ff'
        }}>
          <h3 style={{ color: '#0066cc', marginBottom: '10px' }}>No Leads Found</h3>
          <p style={{ color: '#0066cc', marginBottom: '15px' }}>
            It looks like this is your first time using the system. Would you like to add some sample leads to get started?
          </p>
          <button 
            onClick={handleAddSampleData}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#0066cc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Add Sample Leads
          </button>
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: 'black', margin: 0 }}>
          Total Leads: {leads.length}
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleRefresh}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      
      {leads.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#7f8c8d',
          backgroundColor: 'white',
          borderRadius: '8px',
          marginTop: '2rem',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ color: 'black' }}>No Leads Found</h3>
          <p style={{ color: 'black' }}>Start by adding new leads from the "New Leads" page.</p>
          <button 
            onClick={handleRefresh}
            style={{ 
              marginTop: '15px',
              padding: '10px 20px', 
              backgroundColor: '#27ae60', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer'
            }}
          >
            Check Again
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: 'black' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Mobile</th>
                <th style={tableHeaderStyle}>Company</th>
                <th style={tableHeaderStyle}>Designation</th>
                <th style={tableHeaderStyle}>Current Status</th>
                <th style={tableHeaderStyle}>Follow Up Date</th>
                <th style={tableHeaderStyle}>Assigned To</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr 
                  key={lead.id} 
                  style={{ 
                    borderBottom: '1px solid #ddd',
                    backgroundColor: 'white',
                  }}
                >
                  <td style={tableCellStyle}>
                    <strong style={{ color: 'black' }}>{lead.name}</strong>
                  </td>
                  <td style={tableCellStyle}>{lead.email}</td>
                  <td style={tableCellStyle}>{lead.mobile}</td>
                  <td style={tableCellStyle}>{lead.company || '-'}</td>
                  <td style={tableCellStyle}>{lead.designation || '-'}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      ...getStatusStyle(lead.status)
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{lead.nextFollowUp}</td>
                  <td style={tableCellStyle}>{lead.assignedTo}</td>
                  <td style={tableCellStyle}>
                    <button 
                      onClick={() => handleEdit(lead)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#ffc107', 
                        color: 'black', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        marginRight: '5px',
                        marginBottom: '5px'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(lead.id)}
                      style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal for updating lead details */}
      <EditModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }} 
        lead={selectedLead}
        onSave={handleSaveLead}
      />
    </main>
  );
}