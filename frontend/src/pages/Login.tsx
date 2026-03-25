import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../app/store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setAuth({ email, isAuthenticated: true });
    navigate('/collection');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    } as React.CSSProperties,
    card: {
      backgroundColor: '#12122a',
      borderRadius: '16px',
      padding: '48px 40px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,140,0,0.1)',
      border: '1px solid rgba(255,140,0,0.2)',
    } as React.CSSProperties,
    logoArea: {
      textAlign: 'center' as const,
      marginBottom: '36px',
    },
    logoIcon: {
      fontSize: '56px',
      display: 'block',
      marginBottom: '12px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #ff8c00, #ffd700)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0 0 4px 0',
      letterSpacing: '2px',
    } as React.CSSProperties,
    subtitle: {
      color: '#8888aa',
      fontSize: '14px',
      margin: 0,
      letterSpacing: '3px',
      textTransform: 'uppercase' as const,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
    },
    label: {
      color: '#aaaacc',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
    },
    input: {
      backgroundColor: '#1a1a35',
      border: '1px solid rgba(255,140,0,0.25)',
      borderRadius: '8px',
      padding: '14px 16px',
      color: '#ffffff',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s',
    } as React.CSSProperties,
    errorMsg: {
      color: '#ff6b6b',
      fontSize: '13px',
      textAlign: 'center' as const,
      backgroundColor: 'rgba(255,107,107,0.1)',
      padding: '10px',
      borderRadius: '6px',
    },
    button: {
      background: 'linear-gradient(135deg, #ff8c00, #ff6000)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '1px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 20px rgba(255,140,0,0.4)',
      marginTop: '8px',
    } as React.CSSProperties,
    divider: {
      borderTop: '1px solid rgba(255,255,255,0.08)',
      margin: '8px 0',
    },
    hint: {
      color: '#666688',
      fontSize: '12px',
      textAlign: 'center' as const,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>🏀</span>
          <h1 style={styles.title}>TCG ARENA</h1>
          <p style={styles.subtitle}>Basketball Card Collection</p>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.errorMsg}>{error}</div>}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="coach@tcgarena.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.7)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.25)')}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.7)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,140,0,0.25)')}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 8px 30px rgba(255,140,0,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(255,140,0,0.4)';
            }}
          >
            SIGN IN
          </button>
          <hr style={styles.divider} />
          <p style={styles.hint}>Enter any email &amp; password to enter the arena</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
