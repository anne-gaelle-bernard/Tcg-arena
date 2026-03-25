import { useState } from 'react'
import '../../style/RegisterForm.css'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('register')

  const handleSubmit = () => {
    console.log('Form submitted:', {
      fullName,
      email,
      password,
      confirmPassword,
    })
  }

  return (
    <div className="register-container">
      {/* Left Side - Hero Section */}
      <div className="hero-section" />

      {/* Right Side - Registration Form */}
      <div className="form-section">
        <div className="form-header">
          <h2>Create Account</h2>
          <p>Join the arena and build your basketball legacy.</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'register' && (
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
          className="register-form"
        >
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">U</span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Michael Jordan"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="player@hoopstgc.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create My Account →
          </button>
        </form>
        )}

        {activeTab === 'signin' && (
        <div className="signin-form">
          <div className="form-group">
            <label htmlFor="signin-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
              <input
                type="email"
                id="signin-email"
                placeholder="player@hoopstgc.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signin-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                type="password"
                id="signin-password"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button type="button" className="submit-btn">
            Enter the Arena →
          </button>
        </div>
        )}

        <div className="continue-section">
          <p>OR CONTINUE WITH</p>
          <div className="social-buttons">
            <button className="social-btn google">Google</button>
            <button className="social-btn apple">Apple</button>
            <button className="social-btn discord">Discord</button>
          </div>
        </div>
      </div>
    </div>
  )
}
