import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductList = ({ products, vendor }) => {
  return (
    <div className="space-y-3">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-md transition-all duration-200"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Package className="w-6 h-6 text-gray-300" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
            <p className="text-xl font-bold text-green-600">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductList