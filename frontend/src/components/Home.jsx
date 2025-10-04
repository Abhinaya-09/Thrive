import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/new-leads'); // Directly navigate to New Leads page
  };

  return (
    <main 
      role="main"
      style={{
        backgroundColor: '#ffffff', // Pure white background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px'
      }}
    >
      {/* Company Name and Welcome Message - Top Section */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        color: '#2c3e50', // Dark blue-grey for text
        marginTop: '4rem'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '700',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          THRIVA GROUP OF SOLUTIONS
        </h1>
        
        {/* White card with shadow for paragraph */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: '400',
            lineHeight: '1.8',
            color: '#495057', // Professional dark grey text
            margin: 0
          }}>
            Transforming businesses with innovative solutions and strategic growth partnerships. 
            We deliver excellence through cutting-edge technology and expert consulting services 
            that drive sustainable success and create lasting value for our clients across 
            diverse industries and global markets.
          </p>
        </div>
      </div>

      {/* Footer Section with Get Started Button */}
      <footer style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        {/* Why Choose Us - 3 Points */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '3rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#2c3e50'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>🚀</div>
            <h4 style={{
              marginBottom: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#2c3e50'
            }}>Innovative Solutions</h4>
            <p style={{
              fontSize: '1rem',
              color: '#6c757d',
              maxWidth: '200px'
            }}>Cutting-edge technology and modern approaches</p>
          </div>

          <div style={{
            textAlign: 'center',
            color: '#2c3e50'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>⭐</div>
            <h4 style={{
              marginBottom: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#2c3e50'
            }}>Expert Team</h4>
            <p style={{
              fontSize: '1rem',
              color: '#6c757d',
              maxWidth: '200px'
            }}>Professional consultants with industry expertise</p>
          </div>

          <div style={{
            textAlign: 'center',
            color: '#2c3e50'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>📈</div>
            <h4 style={{
              marginBottom: '0.5rem',
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#2c3e50'
            }}>Proven Results</h4>
            <p style={{
              fontSize: '1rem',
              color: '#6c757d',
              maxWidth: '200px'
            }}>Guaranteed success and measurable outcomes</p>
          </div>
        </div>

        {/* Get Started Button */}
        <div>
          <button
            onClick={handleGetStarted}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '18px 50px',
              fontSize: '1.3rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '700',
              transition: 'all 0.4s ease',
              boxShadow: '0 10px 30px rgba(52, 152, 219, 0.3)',
              letterSpacing: '0.5px',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 15px 40px rgba(52, 152, 219, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.3)';
            }}
          >
            Get Started
          </button>
          
          {/* Instruction text */}
          <p style={{
            color: '#6c757d',
            fontSize: '1.1rem',
            fontStyle: 'italic',
            marginBottom: '2rem'
          }}>
          </p>
        </div>

        {/* Contact Info in Footer */}
        <div style={{
          color: '#6c757d',
          fontSize: '1rem',
          borderTop: '1px solid #e9ecef',
          paddingTop: '2rem',
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <p>📧 info@thrivagroup.com | 📞 +91 9854763214</p>
        </div>
      </footer>
    </main>
  );
}