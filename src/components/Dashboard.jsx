import { useState, useEffect } from 'react'
import { Plus, Package, ShoppingCart, DollarSign, Users, MessageCircle, TrendingUp, Clock, Eye, AlertTriangle, BarChart3, Zap, Settings, Share2, Bell, Calendar, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import Header from './ui/Header'
import { productsAPI, dashboardAPI, ordersAPI } from '../services/api'

const Dashboard = () => {
  const { vendor } = useAuth()
  const [stats, setStats] = useState({
    todaySales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    weekSales: 0,
    monthSales: 0,
    lowStockProducts: 0,
    conversionRate: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesTrend, setSalesTrend] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch enhanced dashboard data
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          dashboardAPI.getStats(),
          ordersAPI.getRecentOrders(),
          productsAPI.getProducts()
        ])
        
        setStats({
          ...statsRes.data,
          weekSales: statsRes.data.weekSales || 0,
          monthSales: statsRes.data.monthSales || 0,
          lowStockProducts: productsRes.data.filter(p => (p.stock || 0) < 5).length,
          conversionRate: statsRes.data.conversionRate || 0
        })
        
        // Format orders for display
        const formattedOrders = ordersRes.data.map(order => ({
          id: order._id,
          buyerName: order.buyerName,
          items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
          total: order.total,
          status: order.status,
          phone: order.buyerPhone,
          time: new Date(order.createdAt).toLocaleString(),
          isUrgent: order.status === 'pending' && new Date() - new Date(order.createdAt) > 24 * 60 * 60 * 1000
        }))
        
        setRecentOrders(formattedOrders)
        
        // Set top products (mock data for now)
        setTopProducts(productsRes.data.slice(0, 3))
        
        // Generate notifications
        const alerts = []
        if (statsRes.data.pendingOrders > 5) {
          alerts.push({ type: 'warning', message: `You have ${statsRes.data.pendingOrders} pending orders` })
        }
        if (productsRes.data.filter(p => (p.stock || 0) < 5).length > 0) {
          alerts.push({ type: 'alert', message: 'Some products are running low on stock' })
        }
        setNotifications(alerts)
        
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      }
      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  const handleMessageBuyer = (order) => {
    const message = `Hi ${order.buyerName}! Your order (${order.items}) is being processed. We'll update you soon!`
    const whatsappUrl = `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleShareCatalog = () => {
    const catalogUrl = `https://whatsapp-buyer-frontend.vercel.app/catalog/${vendor?.catalogId}`
    const message = `🛍️ Check out my online store: ${catalogUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getPerformanceColor = (current, previous) => {
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.pending
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
        subtitle={`Welcome back, ${vendor?.name}`}
      />

      <div className="p-4 space-y-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <div key={index} className={`p-3 rounded-xl flex items-center space-x-3 ${
                notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  notification.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <span className={`text-sm font-medium ${
                  notification.type === 'warning' ? 'text-yellow-800' : 'text-red-800'
                }`}>{notification.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₦{stats.todaySales.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Today's Sales</p>
            <p className="text-xs text-green-600 mt-1">Week: ₦{stats.weekSales.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                stats.pendingOrders > 5 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {stats.pendingOrders}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              {stats.lowStockProducts > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                  {stats.lowStockProducts} low
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            <p className="text-sm text-gray-600">Customers</p>
            <p className="text-xs text-purple-600 mt-1">{stats.conversionRate}% conversion</p>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/add-product"
              className="flex flex-col items-center p-4 bg-teal-50 rounded-2xl hover:bg-teal-100 transition-colors"
            >
              <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-teal-700">Add Product</span>
            </Link>

            <Link
              to="/inventory"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-blue-700">Inventory</span>
              {stats.lowStockProducts > 0 && (
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full mt-1">
                  {stats.lowStockProducts} low
                </span>
              )}
            </Link>

            <Link
              to="/orders"
              className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-orange-700">Orders</span>
              {stats.pendingOrders > 0 && (
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full mt-1">
                  {stats.pendingOrders} pending
                </span>
              )}
            </Link>

            <Link
              to="/automation"
              className="flex flex-col items-center p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-green-700">Automation</span>
            </Link>

            <button
              onClick={handleShareCatalog}
              className="flex flex-col items-center p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mb-3">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-purple-700">Share Store</span>
            </button>

            <Link
              to="/analytics"
              className="flex flex-col items-center p-4 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-indigo-700">Analytics</span>
            </Link>

            <Link
              to="/settings"
              className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gray-500 rounded-2xl flex items-center justify-center mb-3">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-gray-700">Settings</span>
            </Link>

            <Link
              to="/calendar"
              className="flex flex-col items-center p-4 bg-yellow-50 rounded-2xl hover:bg-yellow-100 transition-colors"
            >
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-yellow-700">Schedule</span>
            </Link>
          </div>
        </div>

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Top Performing Products</h2>
              <Link to="/analytics" className="text-teal-600 font-medium text-sm">
                View Analytics
              </Link>
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">₦{product.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                    <p className="text-xs text-gray-500">{product.views || 0} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <div className="flex items-center space-x-2">
              {stats.pendingOrders > 0 && (
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-xs font-medium">
                  {stats.pendingOrders} pending
                </span>
              )}
              <Link to="/orders" className="text-teal-600 font-medium text-sm">
                View All
              </Link>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent orders</p>
              <Link to="/add-product" className="text-teal-600 text-sm hover:underline">
                Add your first product to start receiving orders
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className={`flex items-center justify-between p-4 rounded-2xl ${
                  order.isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                }`}>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{order.buyerName}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.isUrgent && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Urgent</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-teal-600">₦{order.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleMessageBuyer(order)}
                      className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <button
          onClick={handleShareCatalog}
          className="w-14 h-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Share2 className="w-6 h-6" />
        </button>
        <Link
          to="/add-product"
          className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-7 h-7" />
        </Link>
      </div>
    </div>
  )
}

export default Dashboard