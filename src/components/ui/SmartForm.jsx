import { useState } from 'react'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import HelpTooltip from './HelpTooltip'

const SmartForm = ({ 
  children, 
  onSubmit, 
  validation = {}, 
  showProgress = false,
  className = "" 
}) => {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = (name, value) => {
    const rules = validation[name]
    if (!rules) return null

    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        return rule.message || `${name} is required`
      }
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message || `${name} must be at least ${rule.minLength} characters`
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message || `${name} must be no more than ${rule.maxLength} characters`
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${name} format is invalid`
      }
      if (rule.custom && !rule.custom(value)) {
        return rule.message || `${name} is invalid`
      }
    }
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())
    
    // Validate all fields
    const newErrors = {}
    Object.keys(validation).forEach(field => {
      const error = validateField(field, data[field])
      if (error) newErrors[field] = error
    })

    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children({ errors, touched, setTouched, validateField })}
    </form>
  )
}

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required = false,
  helpText,
  helpTooltip,
  icon: Icon,
  error,
  success,
  onBlur,
  onChange,
  className = "",
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasError = !!error
  const hasSuccess = !!success

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-semibold text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helpTooltip && <HelpTooltip content={helpTooltip} />}
        </div>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          onChange={onChange}
          className={`
            w-full px-4 py-4 border rounded-2xl transition-all duration-200 text-gray-900 placeholder-gray-400
            ${Icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${hasError 
              ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
              : hasSuccess
                ? 'border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                : focused
                  ? 'border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white'
            }
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {hasError && (
          <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
        )}
        
        {hasSuccess && (
          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center space-x-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {helpText && !error && !success && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

SmartForm.Field = FormField

export default SmartForm