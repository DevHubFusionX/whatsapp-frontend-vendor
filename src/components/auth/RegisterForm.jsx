import { useState } from 'react'
import { User, Mail, Phone, Building, Lock } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isValid = formData.name.length > 1 && 
                  formData.email.includes('@') && 
                  formData.phoneNumber.length >= 10 &&
                  formData.businessName.length > 1 &&
                  formData.password.length >= 6

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        icon={User}
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
      />
      
      <Input
        label="Email Address"
        name="email"
        type="email"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />
      
      <Input
        label="Phone Number"
        name="phoneNumber"
        type="tel"
        icon={Phone}
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="+234 801 234 5678"
        required
      />
      
      <Input
        label="Business Name"
        name="businessName"
        icon={Building}
        value={formData.businessName}
        onChange={handleChange}
        placeholder="Enter your business name"
        required
      />
      
      <Input
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password (min 6 characters)"
        required
      />
      
      <Button
        type="submit"
        disabled={loading || !isValid}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}

export default RegisterForm