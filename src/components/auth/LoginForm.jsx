import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
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

  const isValid = formData.email.includes('@') && formData.password.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        label="Password"
        name="password"
        type="password"
        icon={Lock}
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />
      
      <Button
        type="submit"
        disabled={loading || !isValid}
        loading={loading}
        className="w-full"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}

export default LoginForm