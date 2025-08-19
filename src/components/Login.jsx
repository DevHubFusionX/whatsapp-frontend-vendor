import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Store, User, Building, Phone } from 'lucide-react'
import { useAuth } from '../App'
import { authAPI } from '../services/api'
import EmailVerification from './EmailVerification'

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      })
      
      console.log('Login response:', response.data)
      
      if (response.data.token && response.data.user && response.data.user.role === 'vendor') {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('loginTime', Date.now().toString())
        login(response.data.user)
        navigate('/dashboard', { replace: true })
      } else {
        console.log('Missing token or user:', { token: !!response.data.token, user: !!response.data.user, role: response.data.user?.role })
        setError('Invalid response from server')
      }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      if (error.response?.data?.message === 'Please verify your email first') {
        setEmail(formData.email)
        setMode('verify')
      } else {
        setError(error.response?.data?.message || 'Login failed')
      }
    }
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await authAPI.register({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber
      })
      
      setEmail(formData.email)
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
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Store'}
          </h1>
          <p className="text-gray-600">
            {mode === 'login' ? 'Sign in to manage your business' : 'Start selling online in minutes'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-200">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Owner's Full Name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number (WhatsApp)"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white"
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{mode === 'login' ? 'Signing In...' : 'Creating Store...'}</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create My Store'
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have a store?" : "Already have a store?"}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-green-600 font-semibold hover:text-green-700"
              >
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login