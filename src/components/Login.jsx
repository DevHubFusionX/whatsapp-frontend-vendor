import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useAuth } from '../App'
import RegisterForm from './auth/RegisterForm'
import LoginForm from './auth/LoginForm'
import EmailOtpInput from './auth/EmailOtpInput'
import CompleteProfile from './CompleteProfile'
import Card from './ui/Card'
import { authAPI } from '../services/api'

const Login = () => {
  const [mode, setMode] = useState('register') // 'login', 'register', 'verify', 'complete-profile'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [newVendor, setNewVendor] = useState(null)
  const { login } = useAuth()

  const handleRegister = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.register(formData)
      setEmail(formData.email)
      setMode('verify')
    } catch (error) {
      console.log('Registration error:', error.response?.data)
      if (error.response?.data?.errors) {
        setError(error.response.data.errors.map(e => e.msg).join(', '))
      } else {
        setError(error.response?.data?.message || 'Registration failed')
      }
    }
    setLoading(false)
  }

  const handleLogin = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.login(formData)
      localStorage.setItem('token', response.data.token)
      login(response.data.vendor)
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleVerifyOtp = async (otp) => {
    setLoading(true)
    setError('')
    try {
      const response = await authAPI.verifyOTP(email, otp)
      localStorage.setItem('token', response.data.token)
      setNewVendor(response.data.vendor)
      
      // Check if profile is complete
      if (!response.data.vendor.about && !response.data.vendor.logo) {
        setMode('complete-profile')
      } else {
        login(response.data.vendor)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Verification failed')
    }
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    setError('')
    try {
      await authAPI.resendOTP(email)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend code')
    }
    setResendLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">VendorTool</h1>
          <p className="text-gray-600">WhatsApp Catalog for Nigerian Businesses</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {mode === 'login' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your vendor account</p>
              </div>
              <LoginForm onSubmit={handleLogin} loading={loading} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode('register')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Don't have an account? Register here
                </button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Start selling with WhatsApp</p>
              </div>
              <RegisterForm onSubmit={handleRegister} loading={loading} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode('login')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          )}

          {mode === 'verify' && (
            <EmailOtpInput
              email={email}
              onSubmit={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setMode('register')}
              loading={loading}
              resendLoading={resendLoading}
            />
          )}

          {mode === 'complete-profile' && (
            <CompleteProfile
              onComplete={() => login(newVendor)}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Login