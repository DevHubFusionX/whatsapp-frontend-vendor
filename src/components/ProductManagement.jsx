import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Share2, Upload, Search, Filter, Package, HelpCircle, TrendingUp, Eye, Users, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { productsAPI } from '../services/api'
import HelpTooltip from './ui/HelpTooltip'
import { useToast } from '../hooks/useToast'
import Toast from './ui/Toast'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const { toasts, success, error, removeToast } = useToast()

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
    try {
      await productsAPI.deleteProduct(productId)
      setProducts(prev => prev.filter(p => p._id !== productId))
      // Show success message with helpful tip
      const remainingCount = products.length - 1
      if (remainingCount === 0) {
        success('🗑️ Product deleted! Ready to add your next amazing product?')
      } else {
        success(`🗑️ Product deleted! You now have ${remainingCount} product${remainingCount === 1 ? '' : 's'} in your store.`)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      error('❌ Failed to delete product. Please try again.')
    }
  }

  const handleShareProduct = (product) => {
    const storeUrl = `https://vendly-buyer.vercel.app/product/${product._id}`
    const message = `🛍️ Check out this amazing product!\n\n📦 ${product.name}\n💰 ₦${product.price.toLocaleString()}${product.description ? `\n\n${product.description}` : ''}\n\n🔗 View details: ${storeUrl}\n\n#OnlineShopping #QualityProducts`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    success('📱 WhatsApp opened! Share this product with your customers to boost sales!')
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
      {/* Enhanced Page Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Package className="w-6 h-6 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                <HelpTooltip 
                  title="Managing Your Products"
                  content={
                    <div className="space-y-3">
                      <p>Here you can manage all your products:</p>
                      <ul className="space-y-1 text-sm">
                        <li>• ✏️ Edit product details and prices</li>
                        <li>• 📱 Share products directly on WhatsApp</li>
                        <li>• 👁️ Hide/show products from your store</li>
                        <li>• 🗑️ Remove products you no longer sell</li>
                      </ul>
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-blue-800 text-xs">💡 Tip: Keep your product list updated for better sales!</p>
                      </div>
                    </div>
                  }
                />
              </div>
              <p className="text-gray-600">
                {products.length} products in your store catalog
                {products.length === 0 && " - Let's add your first product!"}
              </p>
            </div>
            
            {/* Quick Stats */}
            {products.length > 0 && (
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold text-lg">{products.filter(p => p.isActive !== false).length}</span>
                  </div>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-bold text-lg">{products.filter(p => p.isActive === false).length}</span>
                  </div>
                  <p className="text-xs text-gray-500">Hidden</p>
                </div>
              </div>
            )}
          </div>
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
                placeholder={products.length === 0 ? "You'll be able to search once you add products..." : "Search your amazing products..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={products.length === 0}
                className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="group flex items-center justify-center space-x-3 bg-gradient-energy text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add New Product</span>
            </Link>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{filteredProducts.filter(p => p.isActive !== false).length} Active</span>
                <HelpTooltip content="Active products are visible to customers in your store" position="top" />
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>{filteredProducts.filter(p => p.isActive === false).length} Hidden</span>
                <HelpTooltip content="Hidden products are not visible to customers but you can reactivate them anytime" position="top" />
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
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {products.length === 0 ? "Ready to Start Selling? 🚀" : "No products found"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {products.length === 0 
                ? "Add your first product and start your journey to online success. It only takes a few minutes!"
                : searchQuery 
                  ? `No products match "${searchQuery}". Try a different search term.`
                  : "No products match your current filter. Try changing the filter options."
              }
            </p>
            
            {products.length === 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <div className="text-2xl mb-2">📸</div>
                    <p className="text-sm font-medium text-blue-900">Add Photos</p>
                    <p className="text-xs text-blue-700">Upload clear product images</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-2xl">
                    <div className="text-2xl mb-2">✍️</div>
                    <p className="text-sm font-medium text-green-900">Write Details</p>
                    <p className="text-xs text-green-700">Add name, price & description</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl">
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-sm font-medium text-purple-900">Start Selling</p>
                    <p className="text-xs text-purple-700">Share with customers</p>
                  </div>
                </div>
              </div>
            )}
            
            <Link
              to="/add-product"
              className="inline-flex items-center space-x-3 bg-gradient-energy text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>{products.length === 0 ? "Add Your First Product" : "Add New Product"}</span>
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
                          className="group p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 hover:scale-110 relative"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Edit details
                          </div>
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (window.confirm('⚠️ Are you sure you want to delete this product?\n\nThis action cannot be undone. The product will be permanently removed from your store.')) {
                              handleDeleteProduct(product._id)
                            }
                          }}
                          className="group p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 hover:scale-110 relative"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Delete forever
                          </div>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleShareProduct(product)}
                        className="group flex items-center space-x-2 bg-gradient-whatsapp text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Share on WhatsApp
                        </div>
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
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-energy text-white rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Add new product
        </div>
      </Link>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ProductManagement