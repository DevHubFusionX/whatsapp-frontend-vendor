import { MessageCircle, Package, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const BuyerProductCard = ({ product, onMessage }) => {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
  const stockColor = product.stock > 10 ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-200' : product.stock > 0 ? 'bg-amber-500/10 text-amber-700 border border-amber-200' : 'bg-red-500/10 text-red-700 border border-red-200'
  
  const handleCardClick = () => {
    navigate(`/product/${product.id || product._id}`)
  }

  const handleWhatsAppClick = (e) => {
    e.stopPropagation()
    onMessage(product)
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }
  
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={handleCardClick}>
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Stock badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${stockColor}`}>
          {stockStatus}
        </div>
        
        {/* Like button */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full backdrop-blur-sm border transition-all duration-200 flex items-center justify-center ${
            isLiked 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-white/80 border-white/50 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-gray-900">
            ₦{product.price?.toLocaleString() || '0'}
          </p>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Available</span>
          </div>
        </div>
        
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] hover:from-[#20BA5A] hover:to-[#1DA851] text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </button>
      </div>
    </div>
  )
}

export default BuyerProductCard