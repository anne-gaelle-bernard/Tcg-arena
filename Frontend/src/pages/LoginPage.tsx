import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/hoops');
    } else {
      setMessage('Invalid credentials. Please try again.');
    }
  }

  return (
    <main className="page">
      <section className="left-side" aria-label="Basketball promo visual" />

      <section className="right-side">
        <h2>Welcome Back</h2>
        <p className="subtext">Ready to hit the court? Sign in to your account.</p>

        <div className="tabs" role="tablist" aria-label="Account tabs">
          <span className="tab is-active" role="tab" aria-selected="true">Sign In</span>
          <span className="tab" role="tab" aria-selected="false">Create Account</span>
        </div>

        <form id="loginForm" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email Address</label>
          <div className="field">
            <span className="field-icon">@</span>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="coach@hoopstgc.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="label-line">
            <label htmlFor="password">Password</label>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>
          <div className="field">
            <span className="field-icon">*</span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              id="togglePassword"
              className="ghost-icon"
              type="button"
              aria-label="Show password"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="primary-btn" type="submit">Enter the Arena →</button>
          <p id="formMessage" className="form-message" aria-live="polite">{message}</p>
        </form>

        <p className="divider">OR CONTINUE WITH</p>

        <div className="social-row">
          <button className="social-btn" type="button">Google</button>
          <button className="social-btn" type="button">Apple</button>
        </div>

        <p className="terms">
          By continuing, you agree to the Terms of Service and Privacy Policy.
        </p>
      </section>
    </main>
  );
}
