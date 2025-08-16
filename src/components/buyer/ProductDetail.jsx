import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Package, Store, MapPin, Star } from 'lucide-react'
import { productsAPI, vendorsAPI } from '../../services/api'
import BuyerProductCard from './BuyerProductCard'

const ProductDetail = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageZoomed, setImageZoomed] = useState(false)

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      // In a real app, you'd have a single endpoint that returns product + vendor + related products
      // For now, we'll simulate this with the existing APIs
      const response = await productsAPI.getProducts()
      const allProducts = response.data
      const currentProduct = allProducts.find(p => p._id === productId)
      
      if (currentProduct) {
        setProduct({...currentProduct, id: currentProduct._id})
        
        // Mock vendor data - in real app this would come from the product or separate API
        setVendor({
          id: currentProduct.vendorId || '1',
          businessName: 'Fashion Hub Lagos',
          name: 'Adunni Fashions',
          phoneNumber: '+2348000000000',
          location: 'Lagos Island, Lagos',
          rating: 4.8,
          totalReviews: 124
        })

        // Related products from same category
        const related = allProducts
          .filter(p => p._id !== productId && p.category === currentProduct.category)
          .slice(0, 4)
          .map(p => ({...p, id: p._id}))
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Failed to fetch product data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderWhatsApp = () => {
    if (!vendor || !product) return
    
    const message = `Hi! I want to order "${product.name}" priced at ₦${product.price?.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleRelatedProductMessage = (relatedProduct) => {
    const message = `Hi! I'm interested in "${relatedProduct.name}" priced at ₦${relatedProduct.price?.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
  const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Product Details</h1>
        </div>
      </div>

      <div className="space-y-0">
        {/* Product Image - Full Width */}
        <div 
          className={`relative bg-white ${imageZoomed ? 'fixed inset-0 z-50 flex items-center justify-center' : 'aspect-square'}`}
          onClick={() => setImageZoomed(!imageZoomed)}
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className={`${imageZoomed ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'} cursor-pointer`} 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center cursor-pointer">
              <Package className="w-20 h-20 text-gray-300" />
            </div>
          )}
          {imageZoomed && (
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                setImageZoomed(false)
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            ₦{product.price?.toLocaleString()}
          </p>
          <p className={`text-sm font-medium mb-4 ${stockColor}`}>
            {stockStatus}
          </p>
          
          {product.description && (
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>

        {/* Vendor Info */}
        <div className="bg-white border-t border-gray-100 p-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-[#25D366] bg-opacity-10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6 text-[#25D366]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{vendor.businessName}</h3>
              <p className="text-gray-600 mb-2">{vendor.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{vendor.rating} ({vendor.totalReviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white border-t border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Related Products</h3>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <BuyerProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                  onMessage={handleRelatedProductMessage} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button
          onClick={handleOrderWhatsApp}
          disabled={product.stock === 0}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors min-h-[56px] flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Order on WhatsApp</span>
        </button>
      </div>
    </div>
  )
}

export default ProductDetail