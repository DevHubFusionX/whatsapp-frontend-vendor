import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Store, User, Building, Phone, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { useAuth } from '../App'
import { authAPI } from '../services/api'
import EmailVerification from './EmailVerification'
import SmartForm from './ui/SmartForm'
import HelpTooltip from './ui/HelpTooltip'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login', 'signup', 'verify'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    ownerName: '',
    phoneNumber: ''
  })

  const loginValidation = {
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { minLength: 6, message: 'Password must be at least 6 characters' }
    ]
  }

  const signupValidation = {
    businessName: [
      { required: true, message: 'Business name is required' },
      { minLength: 2, message: 'Business name must be at least 2 characters' }
    ],
    ownerName: [
      { required: true, message: 'Owner name is required' },
      { minLength: 2, message: 'Name must be at least 2 characters' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { minLength: 8, message: 'Password must be at least 8 characters for security' }
    ],
    phoneNumber: [
      { required: true, message: 'Phone number is required' },
      { pattern: /^\+?[1-9]\d{1,14}$/, message: 'Please enter a valid phone number' }
    ]
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleLogin = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.login({
        email: data.email,
        password: data.password
      })
      
      console.log('Login response:', response.data)
      
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        login(response.data.user)
        navigate('/dashboard', { replace: true })
      } else {
        setError('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      if (error.response?.data?.message === 'Please verify your email first') {
        setEmail(data.email)
        setMode('verify')
      } else {
        setError(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed')
      }
    }
    setLoading(false)
  }

  const handleSignup = async (data) => {
    setLoading(true)
    setError('')
    
    try {
      await authAPI.register({
        businessName: data.businessName,
        name: data.ownerName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber
      })
      
      setEmail(data.email)
      setMode('verify')
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const handleVerificationSuccess = (vendorData, token) => {
    localStorage.setItem('token', token)
    login(vendorData)
    navigate('/dashboard')
  }

  if (mode === 'verify') {
    return <EmailVerification email={email} onSuccess={handleVerificationSuccess} onBack={() => setMode('signup')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-success rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Welcome Back! 👋' : 'Create Your Store 🎆'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Sign in to manage your business and track your success' 
              : 'Join thousands of successful vendors. Start selling online in just 3 minutes!'}
          </p>
          
          {mode === 'signup' && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200/50">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-primary">Free to start</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-primary">No monthly fees</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span className="text-primary">Easy setup</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <SmartForm 
            onSubmit={mode === 'login' ? handleLogin : handleSignup} 
            validation={mode === 'login' ? loginValidation : signupValidation}
            className="space-y-6"
          >
            {({ errors: formErrors }) => (
              <>
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-200 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Oops! Something went wrong</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200/50">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">Quick Setup Tips</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Use your real business name for customer trust</li>
                            <li>• Choose a strong password to keep your account secure</li>
                            <li>• Use your WhatsApp number for easy customer contact</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <SmartForm.Field
                      label="Business Name"
                      name="businessName"
                      placeholder="e.g., Sarah's Fashion Store"
                      icon={Building}
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      error={formErrors.businessName}
                      helpTooltip="This is how customers will see your store name. Make it memorable and professional!"
                    />

                    <SmartForm.Field
                      label="Owner's Full Name"
                      name="ownerName"
                      placeholder="e.g., Sarah Johnson"
                      icon={User}
                      required
                      value={formData.ownerName}
                      onChange={handleChange}
                      error={formErrors.ownerName}
                      helpText="Your legal name for account verification"
                    />
                  </>
                )}

                <SmartForm.Field
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={formErrors.email}
                  helpText={mode === 'signup' ? "We'll send you a verification code here" : ""}
                />

                <SmartForm.Field
                  label="Password"
                  name="password"
                  type="password"
                  placeholder={mode === 'signup' ? "Create a strong password (8+ characters)" : "Enter your password"}
                  icon={Lock}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                  helpText={mode === 'signup' ? "Use a mix of letters, numbers, and symbols for better security" : ""}
                />

                {mode === 'signup' && (
                  <SmartForm.Field
                    label="WhatsApp Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    icon={Phone}
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={formErrors.phoneNumber}
                    helpTooltip="Customers will contact you on this number. Make sure it's your active WhatsApp number!"
                    helpText="Include country code (e.g., +234 for Nigeria)"
                  />
                )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-primary hover:opacity-80"
                >
                  Forgot password?
                </button>
              </div>
            )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-success text-white py-4 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{mode === 'login' ? 'Signing you in...' : 'Setting up your store...'}</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create My Store 🎆'}</span>
                    </span>
                  )}
                </button>
                
                {mode === 'signup' && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By creating an account, you agree to provide accurate information and use our platform responsibly.
                    </p>
                  </div>
                )}
              </>
            )}
          </SmartForm>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              {mode === 'login' ? "New to our platform?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError('')
                  setFormData({
                    email: '',
                    password: '',
                    businessName: '',
                    ownerName: '',
                    phoneNumber: ''
                  })
                }}
                className="text-primary font-semibold hover:opacity-80 transition-all"
              >
                {mode === 'login' ? 'Create Your Store →' : '← Back to Sign In'}
              </button>
            </p>
            
            {mode === 'login' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 mb-2">🎆 <strong>New here?</strong> Join thousands of successful vendors!</p>
                <div className="flex justify-center space-x-4 text-xs text-gray-500">
                  <span>• Free to start</span>
                  <span>• Easy setup</span>
                  <span>• Instant store</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login