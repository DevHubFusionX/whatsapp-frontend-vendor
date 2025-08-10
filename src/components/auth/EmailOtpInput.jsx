import { useState } from 'react'
import { Mail, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'

const EmailOtpInput = ({ email, onSubmit, onResend, onBack, loading, resendLoading }) => {
  const [otp, setOtp] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.length === 6) {
      onSubmit(otp)
    }
  }

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
        <p className="text-gray-600">
          We sent a verification code to<br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent tracking-widest"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <p className="text-sm text-gray-500 mt-2">Enter the 6-digit code from your email</p>
        </div>

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back to Registration
        </button>
        
        <button
          onClick={onResend}
          disabled={resendLoading}
          className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${resendLoading ? 'animate-spin' : ''}`} />
          <span>{resendLoading ? 'Sending...' : 'Resend Code'}</span>
        </button>
      </div>
    </div>
  )
}

export default EmailOtpInput