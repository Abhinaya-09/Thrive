import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import logoUrl from '../assets/logo.svg';
import './Header.css';

export default function Header() {
  const { logout } = useAuth();

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <div className="brand">
          <img src={logoUrl} alt="THRIVE GROUP SOLUTIONS logo" className="logo" />
          <span className="brand-name" aria-label="Site name">THRIVE GROUP SOLUTIONS</span>
        </div>

        <input type="checkbox" id="nav-toggle" className="nav-toggle" aria-label="Toggle navigation" />
        <label htmlFor="nav-toggle" className="hamburger" aria-controls="primary-navigation" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav id="primary-navigation" className="nav" role="navigation">
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/new-leads" className={({ isActive }) => isActive ? 'active' : undefined}>New Leads</NavLink>
            </li>
            <li>
              <NavLink to="/existing-leads" className={({ isActive }) => isActive ? 'active' : undefined}>Existing Leads</NavLink>
            </li>
            <li>
              <NavLink to="/project-deadline" className={({ isActive }) => isActive ? 'active' : undefined}>Add Project</NavLink>
            </li>
            <li>
              <NavLink to="/budget" className={({ isActive }) => isActive ? 'active' : undefined}>Budget</NavLink>
            </li>
            <li>
              <NavLink to="/payslips" className={({ isActive }) => isActive ? 'active' : undefined}>Payslips</NavLink>
            </li>
          </ul>
          <button type="button" className="logout" onClick={logout} aria-label="Log out">Logout</button>
        </nav>
      </div>
    </header>
  );
}