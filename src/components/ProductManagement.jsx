import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Share2, Upload, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from './ui/Header'
import { productsAPI } from '../services/api'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts()
        setProducts(response.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.deleteProduct(productId)
        setProducts(prev => prev.filter(p => p._id !== productId))
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleShareProduct = (product) => {
    const message = `🛍️ *${product.name}*\n\n${product.description}\n\n💰 *Price: ₦${product.price.toLocaleString()}*\n\n📱 Order now via WhatsApp!`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getStockStatus = (product) => {
    const stock = product.stock || 0
    if (stock > 10) return { label: 'In Stock', color: 'bg-green-100 text-green-800' }
    if (stock > 0) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const stock = product.stock || 0
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'in-stock' && stock > 0) ||
      (filterStatus === 'out-of-stock' && stock === 0)
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Product Management"
        subtitle={`${products.length} products in your catalog`}
      />

      <div className="p-4 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/add-product"
              className="flex items-center justify-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
            
            <button className="flex items-center justify-center space-x-2 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Upload className="w-5 h-5" />
              <span>Bulk Upload</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product to your catalog</p>
            <Link
              to="/add-product"
              className="inline-flex items-center space-x-2 bg-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product)
              return (
                <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl">📦</div>
                    )}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                      {stockStatus.label}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-teal-600 mb-3">₦{product.price.toLocaleString()}</p>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleShareProduct(product)}
                        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="w-7 h-7" />
      </Link>
    </div>
  )
}

export default ProductManagement