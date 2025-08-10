import { useState } from 'react'
import { Upload, User, Building, Phone, Copy, Check } from 'lucide-react'
import { useAuth } from '../App'
import Header from './ui/Header'
import Button from './ui/Button'
import Input from './ui/Input'
import Card from './ui/Card'
import { vendorsAPI } from '../services/api'

const Settings = () => {
  const { vendor, setVendor } = useAuth()
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    businessName: vendor?.businessName || '',
    phoneNumber: vendor?.phoneNumber || '',
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
    const link = `${window.location.origin}/catalog/${vendor?.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Settings"
        backTo="/dashboard"
      />

      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <Card>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Business Logo
            </label>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                {logoPreview ? (
                  <div className="flex space-x-2">
                    <label>
                      <Button variant="secondary" size="sm">
                        <Upload className="w-4 h-4" />
                        Change Logo
                      </Button>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={removeLogo}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                      Upload Logo
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </Card>

          {/* Profile Information */}
          <Card className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
            
            <Input
              label="Your Name"
              icon={User}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />

            <Input
              label="Business Name"
              icon={Building}
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Enter business name"
              required
            />

            <Input
              label="Phone Number"
              icon={Phone}
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              required
            />
          </Card>

          {/* Catalog Link */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Catalog Link</h2>
            <p className="text-sm text-gray-600 mb-4">
              Share this link with customers to showcase your products
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <code className="text-sm text-gray-700 break-all">
                  {window.location.origin}/catalog/{vendor?.catalogId}
                </code>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={copyLink}
                className="flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </Card>

          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.businessName || !formData.phoneNumber}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Settings