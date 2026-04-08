import { useState } from 'react'
import '../../style/RegisterForm.css'
import { loginUser, registerUser } from '../../services/authApi'
import type { AuthUser } from '../../services/authApi'

type RegisterFormProps = {
  onSignInSuccess: (user: AuthUser) => void
}

export default function RegisterForm({ onSignInSuccess }: RegisterFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [signinEmail, setSigninEmail] = useState('')
  const [signinPassword, setSigninPassword] = useState('')
  const [signinError, setSigninError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [isSignInLoading, setIsSignInLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('register')

  const handleSubmit = async () => {
    setRegisterError('')
    setRegisterSuccess('')

    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters.')
      return
    }

    try {
      setIsRegisterLoading(true)
      const response = await registerUser(fullName, email, password)
      setRegisterSuccess(response.message)
      setActiveTab('signin')
      setSigninEmail(email)
      setSigninPassword('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      let errorMessage = 'Registration failed.'

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setRegisterError(errorMessage)
    } finally {
      setIsRegisterLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!signinEmail.trim() || !signinPassword.trim()) {
      setSigninError('Please enter email and password.')
      return
    }

    try {
      setIsSignInLoading(true)
      setSigninError('')
      const response = await loginUser(signinEmail, signinPassword)
      onSignInSuccess(response.user)
    } catch (error) {
      let errorMessage = 'Sign in failed.'

      if (error instanceof Error) {
        errorMessage = error.message
      }

      setSigninError(errorMessage)
    } finally {
      setIsSignInLoading(false)
    }
  }

  let signinTabClassName = 'tab'
  if (activeTab === 'signin') {
    signinTabClassName += ' active'
  }

  let registerTabClassName = 'tab'
  if (activeTab === 'register') {
    registerTabClassName += ' active'
  }

  let passwordInputType = 'password'
  if (showPassword) {
    passwordInputType = 'text'
  }

  let passwordToggleLabel = 'Show'
  if (showPassword) {
    passwordToggleLabel = 'Hide'
  }

  let confirmPasswordInputType = 'password'
  if (showConfirmPassword) {
    confirmPasswordInputType = 'text'
  }

  let confirmPasswordToggleLabel = 'Show'
  if (showConfirmPassword) {
    confirmPasswordToggleLabel = 'Hide'
  }

  let registerSubmitLabel = 'Create My Account →'
  if (isRegisterLoading) {
    registerSubmitLabel = 'Creating Account...'
  }

  let signinSubmitLabel = 'Enter the Arena →'
  if (isSignInLoading) {
    signinSubmitLabel = 'Connecting...'
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
            className={signinTabClassName}
            onClick={() => {
              setActiveTab('signin')
              setRegisterSuccess('')
            }}
          >
            Sign In
          </button>
          <button
            className={registerTabClassName}
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
          {registerError && <p className="signin-error">{registerError}</p>}
          {registerSuccess && <p className="signin-success">{registerSuccess}</p>}

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
                type={passwordInputType}
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
                {passwordToggleLabel}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">*</span>
              <input
                type={confirmPasswordInputType}
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
                {confirmPasswordToggleLabel}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isRegisterLoading}>
            {registerSubmitLabel}
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
                value={signinEmail}
                onChange={e => setSigninEmail(e.target.value)}
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
                value={signinPassword}
                onChange={e => setSigninPassword(e.target.value)}
              />
            </div>
          </div>

          {signinError && <p className="signin-error">{signinError}</p>}

          <button
            type="button"
            className="submit-btn"
            onClick={handleSignIn}
            disabled={isSignInLoading}
          >
            {signinSubmitLabel}
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
