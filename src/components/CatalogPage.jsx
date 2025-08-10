import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MessageCircle, Package } from 'lucide-react'
import VendorHeader from './catalog/VendorHeader'
import ProductCard from './catalog/ProductCard'

const CatalogPage = () => {
  const { vendorId } = useParams()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setVendor({
        id: vendorId,
        businessName: 'Sample Business',
        name: 'John Doe',
        phoneNumber: '+1234567890',
        logo: null
      })
      
      setProducts([
        {
          id: 1,
          name: 'Premium Coffee Beans',
          price: '24.99',
          description: 'Freshly roasted premium coffee beans from Colombia',
          image: null
        },
        {
          id: 2,
          name: 'Organic Tea Set',
          price: '18.50',
          description: 'Collection of organic herbal teas',
          image: null
        },
        {
          id: 3,
          name: 'Artisan Chocolate',
          price: '12.99',
          description: 'Handcrafted dark chocolate with sea salt',
          image: null
        }
      ])
      setLoading(false)
    }, 1000)
  }, [vendorId])

  const handleMessageVendor = (product = null) => {
    if (!vendor) return
    
    let message = `Hi! I'm interested in your products.`
    if (product) {
      message = `Hi! I'm interested in "${product.name}" priced at $${product.price}. Can you provide more details?`
    }
    
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading catalog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <VendorHeader vendor={vendor} onMessage={handleMessageVendor} />

        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Products Yet</h2>
            <p className="text-gray-500 text-lg">This vendor hasn't added any products to their catalog.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Products ({products.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onMessage={handleMessageVendor}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => handleMessageVendor()}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  )
}

export default CatalogPage