import { useState } from 'react'
import { User, Mail, Phone, Building, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Store, Sparkles } from 'lucide-react'
import Button from '../ui/Button'

const RegisterForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')

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

  const getFieldValidation = (field, value) => {
    switch (field) {
      case 'name':
        return value.length > 1
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'phoneNumber':
        return value.replace(/\D/g, '').length >= 10
      case 'businessName':
        return value.length > 1
      case 'password':
        return value.length >= 6
      default:
        return false
    }
  }

  const isFieldValid = (field) => getFieldValidation(field, formData[field])
  const isFormValid = Object.keys(formData).every(field => isFieldValid(field))
  const completedFields = Object.keys(formData).filter(field => isFieldValid(field)).length
  const progressPercentage = (completedFields / Object.keys(formData).length) * 100

  const InputField = ({ label, name, type = 'text', icon: Icon, placeholder, hint }) => {
    const isValid = isFieldValid(name)
    const isFocused = focusedField === name
    const hasValue = formData[name].length > 0

    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className={`w-5 h-5 transition-colors ${
              isFocused ? 'text-green-500' : hasValue && isValid ? 'text-green-500' : 'text-gray-400'
            }`} />
          </div>
          <input
            type={name === 'password' && showPassword ? 'text' : type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField('')}
            placeholder={placeholder}
            className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl transition-all duration-200 focus:outline-none ${
              isFocused 
                ? 'border-green-500 bg-green-50/50 shadow-lg shadow-green-500/10' 
                : hasValue && isValid 
                  ? 'border-green-300 bg-green-50/30' 
                  : hasValue 
                    ? 'border-red-300 bg-red-50/30'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            required
          />
          
          {/* Password Toggle */}
          {name === 'password' && (
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
          )}
          
          {/* Validation Icon */}
          {hasValue && name !== 'password' && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        
        {hint && (
          <p className="text-xs text-gray-500 ml-1">{hint}</p>
        )}
        
        {/* Password Strength */}
        {name === 'password' && hasValue && (
          <div className="ml-1">
            <div className="flex space-x-1 mb-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    formData.password.length >= level * 1.5
                      ? formData.password.length >= 8
                        ? 'bg-green-500'
                        : formData.password.length >= 6
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs ${
              formData.password.length >= 8
                ? 'text-green-600'
                : formData.password.length >= 6
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {formData.password.length >= 8
                ? 'Strong password'
                : formData.password.length >= 6
                  ? 'Good password'
                  : 'Password too short'
              }
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          <Store className="w-4 h-4" />
          <span>Create Your Store</span>
          <Sparkles className="w-4 h-4" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Setup Progress</span>
            <span className="font-semibold text-green-600">{completedFields}/5 completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="name"
            icon={User}
            placeholder="Enter your full name"
            hint="This will be displayed on your store"
          />
          
          <InputField
            label="Email Address"
            name="email"
            type="email"
            icon={Mail}
            placeholder="your.email@example.com"
            hint="We'll send your verification code here"
          />
          
          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            icon={Phone}
            placeholder="+234 801 234 5678"
            hint="Customers will use this to contact you via WhatsApp"
          />
          
          <InputField
            label="Business Name"
            name="businessName"
            icon={Building}
            placeholder="Your Amazing Store"
            hint="This will be your store's display name"
          />
        </div>
        
        <InputField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="Create a secure password"
          hint="Minimum 6 characters required"
        />
        
        {/* Terms */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-green-600 hover:text-green-700 font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</a>
          </p>
        </div>
        
        <Button
          type="submit"
          disabled={loading || !isFormValid}
          loading={loading}
          className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
            isFormValid
              ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Your Store...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Store className="w-5 h-5" />
              <span>Create My Store</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}

export default RegisterForm