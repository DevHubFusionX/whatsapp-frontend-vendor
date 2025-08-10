import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, MessageCircle, Package, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const VendorProfile = () => {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setVendor({
        id: vendorId,
        businessName: 'Fresh Market Store',
        name: 'John Doe',
        phoneNumber: '+1234567890',
        logo: null,
        about: 'We are a family-owned business specializing in fresh, organic products. Our mission is to provide high-quality items at affordable prices while supporting local farmers and sustainable practices.',
        location: 'Downtown Market District',
        established: '2018',
        totalProducts: 25
      })
      setLoading(false)
    }, 500)
  }, [vendorId])

  const handleContactVendor = () => {
    if (!vendor) return
    
    const message = `Hi! I found your business profile and I'm interested in your products.`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center space-x-3">
          <Link
            to={`/catalog/${vendor.id}`}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">Vendor Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Vendor Header */}
        <Card className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {vendor.logo ? (
              <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Package className="w-12 h-12 text-green-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{vendor.businessName}</h1>
          <p className="text-gray-600 mb-4">by {vendor.name}</p>
          
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-6">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{vendor.phoneNumber}</span>
          </div>

          <Button onClick={handleContactVendor} className="w-full">
            <MessageCircle className="w-5 h-5" />
            Contact Vendor
          </Button>
        </Card>

        {/* About Section */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
          <p className="text-gray-600 leading-relaxed">{vendor.about}</p>
        </Card>

        {/* Business Info */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-800">{vendor.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="font-medium text-gray-800">{vendor.totalProducts} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Established</p>
                <p className="font-medium text-gray-800">{vendor.established}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to={`/catalog/${vendor.id}`}
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Package className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">Browse Products</span>
            </Link>
            <button
              onClick={handleContactVendor}
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-700">Send Message</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorProfile