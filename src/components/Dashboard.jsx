import { useState, useEffect } from 'react'
import { Plus, Package, Users, Eye, Share2, Settings, TrendingUp, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import Toast from './ui/Toast'
import { DashboardSkeleton } from './ui/LoadingSkeleton'
import { useToast } from '../hooks/useToast'
import { productsAPI } from '../services/api'

const Dashboard = () => {
  const { vendor } = useAuth()
  const navigate = useNavigate()
  const { toasts, success, error, removeToast } = useToast()
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

  const getStoreUrl = () => {
    return `${window.location.origin.replace('5173', '5174')}/store/${vendor?._id}`
  }

  const handleShareStore = () => {
    const storeUrl = getStoreUrl()
    const message = `🛍️ Check out my store catalog: ${storeUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const copyStoreLink = async () => {
    const storeUrl = getStoreUrl()
    try {
      await navigator.clipboard.writeText(storeUrl)
      success('Store link copied to clipboard!')
    } catch (err) {
      error('Failed to copy link')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Welcome Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {vendor?.businessName || vendor?.name}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your store today</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12%
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8%
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.buyersContacted}</p>
            <p className="text-sm text-gray-600">Buyers Contacted</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +24%
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1.2k</p>
            <p className="text-sm text-gray-600">Store Views</p>
          </div>
        </div>

        {/* Enhanced Store Link Section */}
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <Zap className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Your Store Link</h2>
            </div>
            <p className="text-white/90 text-sm mb-6">Share this magical link everywhere to get more customers! ✨</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30">
              <p className="text-sm font-mono break-all text-white/95">{getStoreUrl()}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyStoreLink}
                className="flex-1 bg-white/20 hover:bg-white/30 py-4 rounded-2xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                📋 Copy Link
              </button>
              <button
                onClick={handleShareStore}
                className="flex-1 bg-white/20 hover:bg-white/30 py-4 rounded-2xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                📱 Share on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              to="/store-preview"
              className="group flex flex-col items-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-green-700 text-lg">Preview Store</span>
              <span className="text-green-600 text-sm mt-1">See how customers view your store</span>
            </Link>

            <Link
              to="/add-product"
              className="group flex flex-col items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-blue-700 text-lg">Add Product</span>
              <span className="text-blue-600 text-sm mt-1">Create new product listing</span>
            </Link>
          </div>
        </div>

        {/* Enhanced Management Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            Manage Your Store
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              to="/products"
              className="group flex items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 border border-blue-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Products</h3>
                <p className="text-sm text-gray-600">Manage your inventory</p>
              </div>
            </Link>

            <Link
              to="/buyers"
              className="group flex items-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:scale-105 border border-purple-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">Buyers</h3>
                <p className="text-sm text-gray-600">View customer interactions</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="group flex items-center p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl hover:from-gray-100 hover:to-slate-100 transition-all duration-300 hover:scale-105 border border-gray-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-slate-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">Profile</h3>
                <p className="text-sm text-gray-600">Business information</p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="group flex items-center p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl hover:from-orange-100 hover:to-amber-100 transition-all duration-300 hover:scale-105 border border-orange-200/50"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">Settings</h3>
                <p className="text-sm text-gray-600">Account preferences</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Add Product Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
      >
        <Plus className="w-7 h-7" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
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

export default Dashboard