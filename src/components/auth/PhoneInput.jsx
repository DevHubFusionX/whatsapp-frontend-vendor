import { Phone } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const PhoneInput = ({ phoneNumber, setPhoneNumber, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Input
        label="Phone Number"
        icon={Phone}
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+1 (555) 123-4567"
        required
      />
      <Button
        type="submit"
        disabled={loading || phoneNumber.length < 10}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </Button>
    </form>
  )
}

export default PhoneInput