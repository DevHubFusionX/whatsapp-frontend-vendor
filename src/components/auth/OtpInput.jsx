import Button from '../ui/Button'
import Input from '../ui/Input'
import { User, Building } from 'lucide-react'

const OtpInput = ({ otp, setOtp, phoneNumber, onSubmit, onBack, loading, isNewUser, name, setName, businessName, setBusinessName }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Enter OTP sent to {phoneNumber}
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl tracking-widest font-medium"
          maxLength={6}
          required
        />
      </div>
      {isNewUser && (
        <>
          <Input
            label="Your Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <Input
            label="Business Name"
            icon={Building}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter business name"
            required
          />
        </>
      )}
      <Button
        type="submit"
        disabled={loading || otp.length !== 6 || (isNewUser && (!name || !businessName))}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Verifying...' : isNewUser ? 'Create Account' : 'Verify & Login'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full"
      >
        Change Phone Number
      </Button>
    </form>
  )
}

export default OtpInput