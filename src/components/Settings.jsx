import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, User, Building, Phone, Copy, Check, X, Settings as SettingsIcon, Link2, Save, Camera, Mail, MapPin, Globe, Shield, Bell, Palette } from 'lucide-react'
import { useAuth } from '../App'
import { vendorsAPI } from '../services/api'
import Toast from './ui/Toast'
import { useToast } from '../hooks/useToast'

const Settings = () => {
  const { vendor, setVendor } = useAuth()
  const navigate = useNavigate()
  const { toasts, success, error, removeToast } = useToast()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    businessName: vendor?.businessName || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    about: vendor?.about || '',
    logo: vendor?.logo || null,
    address: vendor?.address || '',
    website: vendor?.website || ''
  })
  const [logoPreview, setLogoPreview] = useState(vendor?.logo || null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        businessName: vendor.businessName || '',
        phone: vendor.phone || '',
        email: vendor.email || '',
        about: vendor.about || '',
        logo: vendor.logo || null,
        address: vendor.address || '',
        website: vendor.website || ''
      })
      setLogoPreview(vendor.logo || null)
    }
  }, [vendor])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        error('Please select a valid image file')
        return
      }

      setImageUploading(true)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target.result
        setLogoPreview(base64)
        setFormData(prev => ({
          ...prev,
          logo: base64
        }))
        setImageUploading(false)
        success('Image uploaded successfully!')
      }
      reader.onerror = () => {
        error('Failed to read image file')
        setImageUploading(false)
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
      const response = await vendorsAPI.updateProfile(formData)
      setVendor(response.data.vendor)
      success('Profile updated successfully!')
    } catch (err) {
      console.error('Failed to update profile:', err)
      error('Failed to update profile. Please try again.')
    }
    setLoading(false)
  }

  const copyLink = async () => {
    const link = `${window.location.origin.replace('5173', '5174')}/store/${vendor?._id}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      success('Store link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      error('Failed to copy link')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-12 h-12 rounded-2xl bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <SettingsIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600">Manage your business profile and preferences</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{vendor?.businessName}</p>
                <p className="text-sm text-gray-500">{vendor?.email}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {vendor?.businessName?.charAt(0) || 'V'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Picture Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-blue-500" />
                    Profile Picture
                  </h2>
                  <p className="text-gray-600">Upload your business logo to personalize your store</p>
                </div>
                
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-12">
                  <div className="relative group">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Profile"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <Building className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    {logoPreview ? (
                      <div className="flex flex-wrap gap-3">
                        <label className="cursor-pointer group">
                          <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                            <Upload className="w-4 h-4" />
                            <span>Change Photo</span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleLogoChange}
                            disabled={imageUploading}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="px-6 py-3 bg-red-100 text-red-700 rounded-2xl hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 font-medium hover:scale-105"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer group">
                        <div className="px-8 py-6 border-2 border-dashed border-gray-300 rounded-3xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 flex flex-col items-center space-y-3 text-gray-600 hover:text-blue-600">
                          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Upload className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">Upload Business Logo</p>
                            <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                          </div>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                          disabled={imageUploading}
                        />
                      </label>
                    )}
                    <div className="bg-blue-50/50 rounded-2xl p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Square format recommended (1:1 ratio)</li>
                        <li>• Minimum size: 200x200 pixels</li>
                        <li>• Maximum file size: 5MB</li>
                        <li>• Supported formats: JPG, PNG, GIF</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-500" />
                    Personal Information
                  </h2>
                  <p className="text-gray-600">Your personal details and contact information</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 801 234 5678"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="City, State, Country"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <>
              {/* Business Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-purple-500" />
                    Business Information
                  </h2>
                  <p className="text-gray-600">Details about your business and services</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    About Your Business
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your business, what makes you special, your story..."
                    rows={6}
                    className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">This will be displayed on your store page to help customers learn about your business.</p>
                </div>
              </div>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              {/* Store Link Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Link2 className="w-5 h-5 mr-2 text-green-500" />
                    Your Store Link
                  </h2>
                  <p className="text-gray-600">Share this link with customers to showcase your products</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200/50">
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
                      <code className="text-sm text-gray-700 break-all font-mono">
                        {window.location.origin.replace('5173', '5174')}/store/{vendor?._id}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                    Notification Preferences
                  </h2>
                  <p className="text-gray-600">Choose how you want to be notified about your business</p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50">
                    <div>
                      <h3 className="font-semibold text-gray-900">New Orders</h3>
                      <p className="text-sm text-gray-600">Get notified when customers place orders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50">
                    <div>
                      <h3 className="font-semibold text-gray-900">Product Views</h3>
                      <p className="text-sm text-gray-600">Get notified when customers view your products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200/50">
                    <div>
                      <h3 className="font-semibold text-gray-900">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly business performance reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-red-500" />
                    Account Security
                  </h2>
                  <p className="text-gray-600">Manage your account security settings</p>
                </div>
                
                <div className="space-y-4">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition-all duration-200 font-medium"
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto px-6 py-3 bg-red-100 text-red-700 rounded-2xl hover:bg-red-200 transition-all duration-200 font-medium ml-0 sm:ml-3"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 -mx-4 -mb-8">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 px-6 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.businessName || !formData.phone}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default Settings