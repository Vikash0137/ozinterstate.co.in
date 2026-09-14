import { useState, useEffect } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import apiClient from '../../services/apiClient'
import ozLogo from '../../assets/oz-logo.png'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must contain at least 6 characters.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const apiData = response.data?.data
      const user = apiData?.user
      const token = apiData?.token

      if (!user || !token) {
        toast.error('Login failed. Please try again.')
        return
      }

      localStorage.setItem('ozAdminUser', JSON.stringify(user))
      localStorage.setItem('ozAdminToken', token)

      toast.success('Login successful.')
      navigate('/dashboard')
      return
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Unable to login. Please try again.'

      console.error('Admin login failed:', error)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-overlay" />

        <div className="login-brand-content">
          <Link to="/login" className="login-company-logo" aria-label="OZ Interstate Admin">
            <img src={ozLogo} alt="OZ Interstate Movers" />
          </Link>

          <p className="brand-eyebrow">OZ Interstate</p>

          <h1>Manage your moving business from one powerful dashboard.</h1>

          <p className="brand-description">
            Track customer quote requests, bookings, services, website content
            and SEO promotion from one secure admin panel.
          </p>

          <div className="brand-feature-list">
            <div className="brand-feature">
              <span>01</span>
              <div>
                <strong>Quote management</strong>
                <p>Track every customer request and follow-up.</p>
              </div>
            </div>

            <div className="brand-feature">
              <span>02</span>
              <div>
                <strong>Website CMS</strong>
                <p>Manage services, blogs, locations and reviews.</p>
              </div>
            </div>

            <div className="brand-feature">
              <span>03</span>
              <div>
                <strong>SEO promotion</strong>
                <p>Create location and route-based landing pages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="mobile-brand">
            <Link to="/login" className="mobile-brand-logo" aria-label="OZ Interstate Admin">
              <img src={ozLogo} alt="OZ Interstate Movers" />
            </Link>
          </div>

          <div className="login-heading">
            <p>Admin Portal</p>
            <h2>Welcome back</h2>
            <span>Enter your details to access the admin dashboard.</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <div
                className={`input-container ${
                  errors.email ? 'input-container-error' : ''
                }`}
              >
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@ozinterstate.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <p className="form-error-message">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={() =>
                    toast('Forgot password will be connected with backend.')
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div
                className={`input-container ${
                  errors.password ? 'input-container-error' : ''
                }`}
              >
                <LockKeyhole size={19} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="show-password-button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() =>
                    setShowPassword((previousValue) => !previousValue)
                  }
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p className="form-error-message">{errors.password}</p>
              )}
            </div>

            <label className="remember-checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />

              <span>Keep me signed in on this device</span>
            </label>

            <button
              type="submit"
              className="login-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
            </button>
          </form>

          <div className="temporary-login-details">
            <strong>Temporary login for testing</strong>
            <span>Email: admin@ozinterstate.com</span>
            <span>Password: admin123</span>
          </div>

          <p className="login-footer">
            © {new Date().getFullYear()} OZ Interstate. Admin access only.
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage