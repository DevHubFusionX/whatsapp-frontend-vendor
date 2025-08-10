import { Plus, Package, Share2, Eye, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../App'
import Header from './ui/Header'
import StatsCard from './dashboard/StatsCard'
import QuickActions from './dashboard/QuickActions'
import RecentProducts from './dashboard/RecentProducts'
import ShareCatalog from './dashboard/ShareCatalog'
import { productsAPI } from '../services/api'

const Dashboard = () => {
  const { vendor, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)

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

  const generateCatalogLink = () => {
    setShowShareModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const headerActions = (
    <>
      <Link
        to="/settings"
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </Link>
      <button
        onClick={logout}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${vendor?.name}`}
        actions={headerActions}
      />

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Package}
            value={products.length}
            label="Products"
            color="green"
          />
          <StatsCard
            icon={Eye}
            value="0"
            label="Views"
            color="blue"
          />
          <StatsCard
            icon={Share2}
            value="0"
            label="Shares"
            color="purple"
          />
          <StatsCard
            icon={Package}
            value="0"
            label="Orders"
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions onShareCatalog={generateCatalogLink} />

        {/* Recent Products */}
        <RecentProducts 
          products={products} 
          onProductDeleted={(productId) => 
            setProducts(prev => prev.filter(p => p._id !== productId))
          } 
        />
      </div>

      {/* Floating Action Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="w-7 h-7" />
      </Link>

      {showShareModal && (
        <ShareCatalog 
          vendor={vendor} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  )
}

export default Dashboard