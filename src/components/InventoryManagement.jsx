import { useState, useEffect } from 'react'
import { Package, AlertTriangle, Plus, Minus, Search, Filter, Edit, Trash2, TrendingDown } from 'lucide-react'
import { useAuth } from '../App'
import Header from './ui/Header'
import { productsAPI } from '../services/api'

const InventoryManagement = () => {
  const { vendor } = useAuth()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getProducts()
        setProducts(response.data)
        setFilteredProducts(response.data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (stockFilter === 'low') {
      filtered = filtered.filter(product => (product.stock || 0) < 5)
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => (product.stock || 0) === 0)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, stockFilter])

  const updateStock = async (productId, newStock) => {
    try {
      await productsAPI.updateProduct(productId, { stock: newStock })
      setProducts(products.map(product =>
        product._id === productId ? { ...product, stock: newStock } : product
      ))
    } catch (error) {
      console.error('Failed to update stock:', error)
    }
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    if (stock < 5) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: Package }
  }

  const lowStockCount = products.filter(p => (p.stock || 0) < 5).length
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Inventory Management" backTo="/dashboard" />
      
      <div className="p-4 space-y-6">
        {/* Inventory Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{outOfStockCount}</p>
                <p className="text-sm text-gray-600">Out of Stock</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₦{totalValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Inventory Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Products</option>
                <option value="low">Low Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600">
                {searchQuery || stockFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first product to start managing inventory'
                }
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock || 0)
              const StatusIcon = stockStatus.icon
              
              return (
                <div key={product._id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="w-3 h-3" />
                            <span>{stockStatus.label}</span>
                          </div>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>₦{product.price.toLocaleString()}</span>
                        <span>•</span>
                        <span className="capitalize">{product.category}</span>
                        <span>•</span>
                        <span>Stock: {product.stock || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Stock Controls */}
                      <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2">
                        <button
                          onClick={() => updateStock(product._id, Math.max(0, (product.stock || 0) - 1))}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <span className="w-12 text-center font-medium">{product.stock || 0}</span>
                        
                        <button
                          onClick={() => updateStock(product._id, (product.stock || 0) + 1)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  {(product.stock || 0) < 5 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          {product.stock === 0 ? 'This product is out of stock' : 'This product is running low on stock'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryManagement