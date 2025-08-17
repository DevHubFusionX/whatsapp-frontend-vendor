import { useState, useEffect } from 'react'
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react'
import { authAPI } from '../services/api'

const EmailVerification = ({ email, onSuccess, onBack }) => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.verifyOTP(email, otp)
      onSuccess(response.data.vendor, response.data.token)
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid verification code')
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setResendLoading(true)
    setError('')
    
    try {
      await authAPI.resendOTP(email)
      setResendTimer(60)
      setCanResend(false)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend code')
    }
    setResendLoading(false)
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-600">
            We sent a 6-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                className="w-full px-4 py-4 text-center text-2xl font-mono border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors border-gray-200 bg-gray-50 hover:bg-white tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend || resendLoading}
              className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
              <span>
                {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification