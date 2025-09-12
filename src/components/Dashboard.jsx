import { useState, useEffect } from 'react'
import { Plus, Package, Users, Eye, Share2, Settings, TrendingUp, Zap, HelpCircle, BookOpen, Target, Lightbulb } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import Toast from './ui/Toast'
import { DashboardSkeleton } from './ui/LoadingSkeleton'
import { useToast } from '../hooks/useToast'
import { productsAPI } from '../services/api'
import HelpTooltip from './ui/HelpTooltip'
import GuidedTour from './ui/GuidedTour'
import OnboardingChecklist from './ui/OnboardingChecklist'

const Dashboard = () => {
  const { vendor } = useAuth()
  const navigate = useNavigate()
  const { toasts, success, error, removeToast } = useToast()
  const [stats, setStats] = useState({
    totalProducts: 0,
    buyersContacted: 0
  })
  const [loading, setLoading] = useState(true)
  const [showTour, setShowTour] = useState(false)
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false)

  // Check if user is new (first time on dashboard)
  useEffect(() => {
    const hasSeenDashboard = localStorage.getItem('hasSeenDashboard')
    if (!hasSeenDashboard && vendor) {
      setShowWelcomeGuide(true)
      localStorage.setItem('hasSeenDashboard', 'true')
    }
  }, [vendor])

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
      success('🎉 Store link copied! Share it with customers to start selling!')
    } catch (err) {
      error('Failed to copy link')
    }
  }

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to Your Store Dashboard! 🎉',
      content: 'This is your business command center. Here you can manage products, track sales, and grow your business.',
      tips: 'Take a few minutes to explore each section. Your success starts here!'
    },
    {
      id: 'stats',
      title: 'Your Business Stats 📊',
      content: 'Monitor your store performance with real-time statistics. Track products, customer interactions, and store views.',
      tips: 'These numbers update automatically as your business grows!'
    },
    {
      id: 'store-link',
      title: 'Your Store Link 🔗',
      content: 'This is your unique store URL. Share it on WhatsApp, social media, or anywhere to let customers browse your products.',
      tips: 'The more you share, the more customers you\'ll get!'
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions ⚡',
      content: 'Fast access to your most important tasks. Add products and preview your store with just one click.',
      tips: 'Start by adding your first product to get your store ready!'
    }
  ]

  const handleStartTour = () => {
    setShowWelcomeGuide(false)
    setShowTour(true)
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {vendor?.businessName || vendor?.name}! 👋
              </h1>
              <p className="text-gray-600">Here's what's happening with your store today</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTour(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors font-medium"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Take Tour</span>
              </button>
              <HelpTooltip 
                title="Need Help Getting Started?"
                content={
                  <div className="space-y-3">
                    <p>Here are some quick tips to get your store running:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Add your first product to start selling</li>
                      <li>• Share your store link with customers</li>
                      <li>• Complete your business profile</li>
                      <li>• Preview how customers see your store</li>
                    </ul>
                    <button 
                      onClick={handleStartTour}
                      className="w-full mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Start Guided Tour
                    </button>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Guide for New Users */}
      {showWelcomeGuide && (
        <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">🎉 Welcome to Your New Store!</h2>
                  <p className="text-white/90">Let's get you started with a quick tour of your dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleStartTour}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/30"
                >
                  Start Tour
                </button>
                <button
                  onClick={() => setShowWelcomeGuide(false)}
                  className="px-4 py-3 text-white/80 hover:text-white transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Onboarding Checklist for New Users */}
        {stats.totalProducts === 0 && (
          <OnboardingChecklist />
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <HelpTooltip 
                  content="This shows the total number of products in your store. Add more products to give customers more choices!"
                  position="left"
                />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProducts}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Total Products</p>
              {stats.totalProducts === 0 && (
                <Link 
                  to="/add-product"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add First Product →
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <HelpTooltip 
                  content="Track how many customers have contacted you through WhatsApp. This number grows as you share your store link!"
                  position="left"
                />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.buyersContacted}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Buyers Contacted</p>
              {stats.buyersContacted === 0 && (
                <p className="text-xs text-purple-600 font-medium">Share your link to get started!</p>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div className="text-right">
                <HelpTooltip 
                  content="See how many people have visited your store. More views mean more potential customers!"
                  position="left"
                />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">1.2k</p>
            <p className="text-sm text-gray-600">Store Views</p>
          </div>
        </div>

        {/* Enhanced Store Link Section */}
        <div className="bg-gradient-rainbow rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Zap className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-bold">Your Store Link</h2>
              </div>
              <HelpTooltip 
                title="How to Use Your Store Link"
                content={
                  <div className="space-y-3">
                    <p>Your store link is your gateway to customers:</p>
                    <ul className="space-y-1 text-sm">
                      <li>📱 Share on WhatsApp status</li>
                      <li>📘 Post on Facebook & Instagram</li>
                      <li>💬 Send directly to customers</li>
                      <li>📧 Include in email signatures</li>
                      <li>🏪 Print on business cards</li>
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 text-sm font-medium">💡 Pro Tip: The more you share, the more customers you'll get!</p>
                    </div>
                  </div>
                }
                position="left"
              />
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
                className="flex-1 bg-gradient-whatsapp hover:opacity-90 py-4 rounded-2xl font-medium transition-all duration-200 backdrop-blur-sm border border-white/30 hover:scale-105"
              >
                📱 Share on WhatsApp
              </button>
            </div>
            
            {/* Quick sharing tips */}
            <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs text-white/80 mb-2">💡 Quick sharing ideas:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">WhatsApp Status</span>
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">Instagram Bio</span>
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs">Facebook Post</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Quick Actions
            </h2>
            <HelpTooltip 
              content="These are your most important daily tasks. Start here to manage your store efficiently!"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              to="/store-preview"
              className="group flex flex-col items-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-green-700 text-lg">Preview Store</span>
              <span className="text-green-600 text-sm mt-1">See exactly what customers see</span>
            </Link>

            <Link
              to="/add-product"
              className="group flex flex-col items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-200/50"
            >
              <div className="w-16 h-16 bg-gradient-trust rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <span className="font-semibold text-secondary text-lg">Add Product</span>
              <span className="text-secondary text-sm mt-1">{stats.totalProducts === 0 ? 'Add your first product!' : 'Create new product listing'}</span>
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
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-success text-white rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-2 border-white/20 backdrop-blur-sm"
      >
        <Plus className="w-7 h-7" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      </Link>

      {/* Guided Tour */}
      <GuidedTour 
        steps={tourSteps}
        isActive={showTour}
        onComplete={() => setShowTour(false)}
        onSkip={() => setShowTour(false)}
      />

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