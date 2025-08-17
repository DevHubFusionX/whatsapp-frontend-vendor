import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, User, Building, Phone, Copy, Check, X, Settings as SettingsIcon, Link2, Save } from 'lucide-react'
import { useAuth } from '../App'
import { vendorsAPI } from '../services/api'

const Settings = () => {
  const { vendor, setVendor } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    ownerName: vendor?.ownerName || vendor?.name || '',
    businessName: vendor?.businessName || '',
    phoneNumber: vendor?.phoneNumber || '',
    about: vendor?.about || '',
    logo: vendor?.logo || null
  })
  const [logoPreview, setLogoPreview] = useState(vendor?.logo || null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null
    }))
    setLogoPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await vendorsAPI.updateProfile({
        ...formData,
        logo: logoPreview
      })
      setVendor(response.data.vendor)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
    setLoading(false)
  }

  const copyLink = () => {
    const link = `${window.location.origin}/catalog/${vendor?.catalogId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Profile</h1>
                <p className="text-sm text-gray-500">Manage your business information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Logo Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Business Logo</h2>
              <p className="text-sm text-gray-500">Upload your business logo to personalize your store</p>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-4">
                {logoPreview ? (
                  <div className="flex space-x-3">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-xl hover:bg-teal-200 transition-colors flex items-center space-x-2 text-sm font-medium">
                        <Upload className="w-4 h-4" />
                        <span>Change Logo</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center space-x-2 text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all flex items-center space-x-3 text-gray-600 hover:text-teal-600">
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">Upload Business Logo</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500">Recommended: Square image, at least 200x200px</p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Business Information</h2>
              <p className="text-sm text-gray-500">Update your business details</p>
            </div>
            
            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Business Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Enter your business name"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Owner's Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phone Number (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+234 801 234 5678"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* About Business */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  About Your Business
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell customers about your business..."
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Catalog Link Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <Link2 className="w-5 h-5 text-teal-600" />
                <span>Your Catalog Link</span>
              </h2>
              <p className="text-sm text-gray-500">Share this link with customers to showcase your products</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <code className="text-sm text-gray-700 break-all font-mono">
                  {window.location.origin}/catalog/{vendor?.catalogId}
                </code>
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="px-4 py-4 bg-teal-100 text-teal-700 rounded-2xl hover:bg-teal-200 transition-colors flex items-center justify-center"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-teal-600 mt-2 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Link copied to clipboard!</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 px-6 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.ownerName || !formData.businessName || !formData.phoneNumber}
              className="flex-1 py-4 px-6 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings