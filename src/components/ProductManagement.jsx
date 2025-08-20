import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Share2, Upload, Search, Filter, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
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
    const storeUrl = `${window.location.origin.replace('5173', '5174')}/product/${product._id}`
    const message = `🛍️ Check out this product: ${product.name} - ₦${product.price.toLocaleString()}\n\n${storeUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getProductStatus = (product) => {
    return product.isActive !== false 
      ? { label: 'Active', color: 'bg-green-100 text-green-800' }
      : { label: 'Hidden', color: 'bg-gray-100 text-gray-800' }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && product.isActive !== false) ||
      (filterStatus === 'hidden' && product.isActive === false)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-2">
            <Package className="w-6 h-6 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          </div>
          <p className="text-gray-600">{products.length} products in your store catalog</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Enhanced Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/50">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your amazing products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 font-medium"
              >
                <option value="all">All Products</option>
                <option value="active">✅ Active</option>
                <option value="hidden">👁️ Hidden</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/add-product"
              className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add New Product</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{filteredProducts.filter(p => p.isActive !== false).length} Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>{filteredProducts.filter(p => p.isActive === false).length} Hidden</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 shadow-sm border border-white/50 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Start building your amazing catalog by adding your first product. Your customers are waiting!</p>
            <Link
              to="/add-product"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const productStatus = getProductStatus(product)
              return (
                <div key={product._id} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/50 hover:scale-105">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-8xl opacity-50">📦</div>
                    )}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-2xl text-xs font-semibold backdrop-blur-sm ${productStatus.color} border border-white/30`}>
                      {productStatus.label}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">₦{product.price.toLocaleString()}</p>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-product/${product._id}`}
                          className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-110"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleShareProduct(product)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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

      {/* Enhanced Floating Add Button */}
      <Link
        to="/add-product"
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </Link>
    </div>
  )
}

export default ProductManagement