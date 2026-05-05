import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the redirect URL from state or default to home
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, studentId);
      // Redirect to where they came from or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-icon">🍽️</span>
          <h1>Create Account</h1>
          <p>Join CanteenConnect today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Student/Employee ID</label>
            <input
              type="text"
              className="input-field"
              placeholder="STU001"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg btn-full"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
