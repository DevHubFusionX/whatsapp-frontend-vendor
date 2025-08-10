import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Package, Store } from 'lucide-react'
import Button from '../ui/Button'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setProduct({
        id: productId,
        name: 'Premium Coffee Beans',
        price: '24.99',
        description: 'Freshly roasted premium coffee beans from Colombia. Rich, full-bodied flavor with notes of chocolate and caramel. Perfect for espresso or drip coffee.',
        image: null,
        category: 'beverages'
      })
      
      setVendor({
        id: '1',
        businessName: 'Fresh Market Store',
        name: 'John Doe',
        phoneNumber: '+1234567890'
      })
      
      setLoading(false)
    }, 500)
  }, [productId])

  const handleMessageVendor = () => {
    if (!vendor || !product) return
    
    const message = `Hi! I'm interested in "${product.name}" priced at $${product.price}. Can you provide more details?`
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
          <h1 className="text-lg font-semibold text-gray-800">Product Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-20 h-20 text-gray-300" />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-green-600 mb-4">${product.price}</p>
          
          {product.description && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        {/* Vendor Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{vendor.businessName}</h3>
              <p className="text-sm text-gray-600">by {vendor.name}</p>
            </div>
          </div>
          <Link
            to={`/vendor/${vendor.id}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            View Vendor Profile →
          </Link>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <Button
          onClick={handleMessageVendor}
          className="w-full"
          size="lg"
        >
          <MessageCircle className="w-5 h-5" />
          Message Vendor
        </Button>
      </div>
    </div>
  )
}

export default ProductDetail