import { MessageCircle, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, onMessage }) => {
  const navigate = useNavigate()
  const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
  const stockColor = product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
  
  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  const handleWhatsAppClick = (e) => {
    e.stopPropagation()
    onMessage(product)
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer max-w-xs mx-auto" onClick={handleCardClick}>
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 md:w-10 md:h-10 text-gray-300" />
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockColor}`}>
          {stockStatus}
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <p className="text-base md:text-lg font-bold text-gray-900 mb-3">
          ₦{product.price?.toLocaleString() || '0'}
        </p>
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2 md:py-2.5 px-3 md:px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors min-h-[44px] text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Chat on WhatsApp</span>
          <span className="sm:hidden">Chat</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard