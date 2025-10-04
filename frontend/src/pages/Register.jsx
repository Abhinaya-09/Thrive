import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const { email, password, confirmPassword, fullName } = formData;

    if (!email || !password || !confirmPassword || !fullName) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.register({ email, password, fullName });
      
      setMessage('Registration successful! Redirecting to login...');
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <section className="auth-card" aria-labelledby="register-title">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 id="register-title" style={{ 
            color: 'white',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Create Account
          </h1>
          <p className="subtitle">Join THRIVE GROUP OF SOLUTIONS today</p>
        </div>

        {error && (
          <div role="alert" className="alert" style={{ 
            backgroundColor: 'rgba(255, 200, 200, 0.2)', 
            border: '1px solid rgba(255, 150, 150, 0.3)',
            color: 'white'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="alert" style={{ 
            backgroundColor: 'rgba(200, 255, 200, 0.2)', 
            border: '1px solid rgba(150, 255, 150, 0.3)',
            color: 'white'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              id="fullName" 
              name="fullName" 
              type="text" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>
          <button 
            type="submit" 
            className="submit" 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </main>
  );
}