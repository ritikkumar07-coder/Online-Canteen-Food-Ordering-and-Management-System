import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');

  const getRoleBadge = (role) => {
    const badges = {
      user: { label: 'Student', color: 'var(--color-accent)' },
      staff: { label: 'Canteen Staff', color: 'var(--color-secondary)' },
      admin: { label: 'Admin', color: 'var(--color-warning)' },
    };
    return badges[role] || badges.user;
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-large">
          {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
        </div>
        <h2 className="profile-name">{user?.name}</h2>
        <span className="role-badge" style={{ background: roleInfo.color }}>
          {roleInfo.label}
        </span>
        <p className="profile-email">{user?.email}</p>
      </div>

      {/* Profile Details */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Account Details</h3>
          <button 
            className="btn btn-ghost"
            onClick={() => setEditing(!editing)}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="detail-card">
          {editing ? (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Student/Employee ID</label>
                <input 
                  type="text"
                  className="input-field"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-full">
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div className="detail-row">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user?.name || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{user?.phone || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Student/Employee ID</span>
                <span className="detail-value">{user?.studentId || '-'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="profile-section">
        <h3>Your Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-text">Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">₹2,450</span>
            <span className="stat-text">Spent</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.8★</span>
            <span className="stat-text">Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
