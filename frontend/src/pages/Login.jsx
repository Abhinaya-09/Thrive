import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const ok = await login(identifier, password);
    if (!ok) {
      setError('Invalid email/username or password. Please try again.');
    }
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="auth-wrapper">
      <section className="auth-card" aria-labelledby="login-title">
        {/* Logo Section */}
        <div className="logo-container">
          <h1 id="login-title">Welcome to THRIVE GROUP SOLUTIONS</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div role="alert" className="alert">
            <span className="alert-icon">⚠</span>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onSubmit} noValidate>
          {/* Email/Username Field */}
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <div className="input-with-icon">
              <span className="input-icon">✉</span>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={isLoading}
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or continue with</span>
        </div>

        {/* Social Login */}
        <div className="social-login">
          <button type="button" className="social-btn">
            <span className="social-icon">G</span>
            <span>Google</span>
          </button>
          <button type="button" className="social-btn">
            <span className="social-icon">f</span>
            <span>Facebook</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="auth-footer-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </main>
  );
}