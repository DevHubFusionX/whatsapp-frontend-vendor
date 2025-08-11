import { useState } from 'react'
import { Upload, Building, CreditCard, Save } from 'lucide-react'
import { useAuth } from '../App'
import { vendorsAPI } from '../services/api'
import Header from './ui/Header'

const CompleteProfile = ({ onComplete }) => {
  const { vendor } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    about: '',
    logo: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    paystackKey: '',
    flutterwaveKey: ''
  })

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await vendorsAPI.updateProfile(formData)
      onComplete()
    } catch (error) {
      console.error('Profile update failed:', error)
      alert('Failed to update profile. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Complete Your Profile"
        subtitle="Set up your store details and payment methods"
      />

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Store Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Building className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Store Details</h2>
          </div>

          <div className="space-y-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Building className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <label className="flex items-center space-x-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-teal-100 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell customers about your store..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Setup */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <CreditCard className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Payment Setup</h2>
          </div>

          <div className="space-y-4">
            {/* Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="Bank Name"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="Account Number"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleInputChange}
              placeholder="Account Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />

            {/* Payment Gateway Keys */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Payment Gateway Integration (Optional)</p>
              <input
                type="password"
                name="paystackKey"
                value={formData.paystackKey}
                onChange={handleInputChange}
                placeholder="Paystack Secret Key"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <input
                type="password"
                name="flutterwaveKey"
                value={formData.flutterwaveKey}
                onChange={handleInputChange}
                placeholder="Flutterwave Secret Key"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50"
        >
          <Save className="w-6 h-6" />
          <span>{loading ? 'Saving...' : 'Complete Setup'}</span>
        </button>

        {/* Skip Option */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full text-gray-600 py-3 font-medium hover:text-gray-800 transition-colors"
        >
          Skip for now (you can complete this later)
        </button>
      </form>
    </div>
  )
}

export default CompleteProfile