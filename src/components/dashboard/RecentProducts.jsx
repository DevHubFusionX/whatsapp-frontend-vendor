import { Package, Plus, Edit, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { productsAPI } from '../../services/api'

const RecentProducts = ({ products, onProductDeleted }) => {
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId)
        onProductDeleted(productId)
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }
  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No products yet</h3>
        <p className="text-gray-500 mb-6">Start building your catalog by adding your first product</p>
        <Link to="/add-product">
          <Button>
            <Plus className="w-4 h-4" />
            Add Your First Product
          </Button>
        </Link>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
        <Link to="/products" className="text-sm text-green-600 hover:text-green-700 font-medium">
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {products.slice(-3).map((product) => (
          <div key={product._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Package className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
              <p className="text-sm text-gray-600">${product.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to={`/edit-product/${product._id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleDelete(product._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RecentProducts