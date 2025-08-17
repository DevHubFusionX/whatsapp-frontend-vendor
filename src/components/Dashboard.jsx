import { useState, useEffect } from 'react'
import { Plus, Package, Users, Eye, Share2, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import Header from './ui/Header'
import { productsAPI } from '../services/api'

const Dashboard = () => {
  const { vendor } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    buyersContacted: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes] = await Promise.all([
          productsAPI.getProducts()
        ])
        
        setStats({
          totalProducts: productsRes.data.length,
          buyersContacted: 0 // Will be updated when interaction logs are implemented
        })
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  const handleShareCatalog = () => {
    const catalogUrl = `${window.location.origin}/catalog/${vendor?.catalogId}`
    const message = `🛍️ Check out my online store: ${catalogUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

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
        title="Dashboard"
        subtitle={`Welcome back, ${vendor?.businessName || vendor?.name}`}
      />

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.buyersContacted}</p>
            <p className="text-sm text-gray-600">Buyers Contacted</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => window.open(`${window.location.origin}/catalog/${vendor?.catalogId}`, '_blank')}
              className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mb-3">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <span className="font-medium text-green-700">View My Catalog</span>
            </button>

            <button
              onClick={handleShareCatalog}
              className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <span className="font-medium text-blue-700">Share My Catalog</span>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Your Store</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/products"
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Package className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Products</h3>
                <p className="text-sm text-gray-600">Manage inventory</p>
              </div>
            </Link>

            <Link
              to="/buyers"
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Buyers</h3>
                <p className="text-sm text-gray-600">View interactions</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600">Business settings</p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-8 h-8 text-gray-600 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Settings</h3>
                <p className="text-sm text-gray-600">Account settings</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Add Product Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="w-7 h-7" />
      </Link>
    </div>
  )
}

export default Dashboard