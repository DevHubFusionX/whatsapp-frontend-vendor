import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const ProductGrid = ({ products, vendor }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
        >
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-8 h-8 text-gray-300" />
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-green-600">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ProductGrid