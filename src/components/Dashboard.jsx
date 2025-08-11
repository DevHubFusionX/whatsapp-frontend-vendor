import { useState, useEffect } from 'react'
import { Plus, Package, ShoppingCart, DollarSign, Users, MessageCircle, TrendingUp, Clock, Eye } from 'lucide-react'
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
    totalCustomers: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats and recent orders
        const [statsRes, ordersRes] = await Promise.all([
          dashboardAPI.getStats(),
          ordersAPI.getRecentOrders()
        ])
        
        setStats(statsRes.data)
        
        // Format orders for display
        const formattedOrders = ordersRes.data.map(order => ({
          id: order._id,
          buyerName: order.buyerName,
          items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
          total: order.total,
          status: order.status,
          phone: order.buyerPhone,
          time: new Date(order.createdAt).toLocaleString()
        }))
        
        setRecentOrders(formattedOrders)
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800'
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
        {/* Stats Grid */}
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
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
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
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            <p className="text-sm text-gray-600">Customers</p>
          </div>
        </div>

        {/* Quick Actions */}
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
              to="/vendor/products"
              className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-blue-700">My Products</span>
            </Link>

            <Link
              to="/orders"
              className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-orange-700">Manage Orders</span>
            </Link>

            <Link
              to="/reminders"
              className="flex flex-col items-center p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="font-medium text-green-700">Send Reminders</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-teal-600 font-medium text-sm">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{order.buyerName}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{order.items}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-teal-600">₦{order.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleMessageBuyer(order)}
                    className="ml-4 bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Product Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <Plus className="w-7 h-7" />
      </Link>
    </div>
  )
}

export default Dashboard