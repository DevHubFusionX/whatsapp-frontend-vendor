import { useState, useEffect } from 'react'
import { ArrowLeft, Share2, Copy, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { productsAPI } from '../services/api'

const StorePreview = () => {
  const { vendor } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const storeUrl = `${window.location.origin.replace('5173', '5174')}/store/${vendor?._id}`

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts()
        setProducts(response.data.filter(p => p.isActive !== false))
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const copyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl)
    alert('Store link copied to clipboard!')
  }

  const shareOnWhatsApp = () => {
    const message = `🛍️ Check out my store catalog: ${storeUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const openStore = () => {
    window.open(storeUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Store Preview</h1>
                <p className="text-sm text-gray-500">How buyers see your store</p>
              </div>
            </div>
            <button
              onClick={openStore}
              className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-teal-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Store</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Store Link Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-2">Your Store Link</h2>
          <p className="text-green-100 text-sm mb-4">Share this link to get customers</p>
          <div className="bg-white/20 rounded-xl p-3 mb-4">
            <p className="text-sm font-mono break-all">{storeUrl}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={copyStoreLink}
              className="flex items-center space-x-2 flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors justify-center"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center space-x-2 flex-1 bg-white/20 hover:bg-white/30 py-3 rounded-xl font-medium transition-colors justify-center"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Store Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Store Preview</h2>
            <span className="text-sm text-gray-500">{products.length} products</span>
          </div>

          {/* Store Header Preview */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center">
                {vendor?.logo ? (
                  <img src={vendor.logo} alt={vendor.businessName} className="w-14 h-14 object-cover rounded-lg" />
                ) : (
                  <span className="text-2xl">🏪</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{vendor?.businessName}</h3>
                <p className="text-gray-600">⭐ 4.8 • {products.length} products</p>
              </div>
            </div>
            {vendor?.about && (
              <p className="text-gray-600 text-sm">{vendor.about}</p>
            )}
          </div>

          {/* Products Preview */}
          {products.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Add products to see how your store will look</p>
              <button
                onClick={() => navigate('/add-product')}
                className="bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h4>
                    <p className="text-teal-600 font-bold">₦{product.price?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 6 && (
            <div className="text-center mt-6">
              <p className="text-gray-500">+ {products.length - 6} more products in your store</p>
            </div>
          )}
        </div>

        {/* Sharing Tips */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Sharing Tips</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="font-bold">📱</span>
              <p><strong>WhatsApp Status:</strong> "Check out my full catalog 👇 [link]"</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold">💬</span>
              <p><strong>Direct Messages:</strong> "Hi! Here's my store link with all products"</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-bold">📱</span>
              <p><strong>Social Media Bio:</strong> Add the link to your Instagram/Facebook bio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StorePreview