import { Package, MessageCircle } from 'lucide-react'

const ProductList = ({ products, vendor }) => {
  const handleProductMessage = (product) => {
    if (!vendor) return
    
    const message = `Hi! I'm interested in "${product.name}" priced at ₦${product.price?.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-3">
      {products.map((product) => {
        const stockStatus = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'
        const stockColor = product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
        
        return (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-1">
                  ₦{product.price?.toLocaleString()}
                </p>
                <p className={`text-sm font-medium ${stockColor}`}>
                  {stockStatus}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleProductMessage(product)}
              className="w-full mt-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ProductList