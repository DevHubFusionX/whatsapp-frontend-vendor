import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Calendar, Download } from 'lucide-react'
import { useAuth } from '../App'
import Header from './ui/Header'
import { dashboardAPI } from '../services/api'

const Analytics = () => {
  const { vendor } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [period, setPeriod] = useState('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await dashboardAPI.getAnalytics(period)
        setAnalytics(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
      setLoading(false)
    }

    fetchAnalytics()
  }, [period])

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`

  const getGrowthColor = (current, previous) => {
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-gray-600'
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
      <Header title="Analytics" backTo="/dashboard" />
      
      <div className="p-4 space-y-6">
        {/* Period Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue / analytics.totalOrders || 0)}</p>
                <p className="text-sm text-gray-600">Avg Order Value</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.totalRevenue / (period === '7d' ? 7 : period === '30d' ? 30 : 90))}</p>
                <p className="text-sm text-gray-600">Daily Average</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Products */}
        {analytics?.topProducts && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Products</h2>
            <div className="space-y-4">
              {analytics.topProducts.map((item, index) => (
                <div key={item.product._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-teal-600">#{index + 1}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.quantity} sold • {formatCurrency(item.revenue)}</p>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="w-5 h-5 text-green-500 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales Chart Placeholder */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Sales Trend</h2>
            <button className="flex items-center space-x-2 text-teal-600 hover:text-teal-700">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Sales chart visualization</p>
              <p className="text-sm text-gray-400">Chart integration coming soon</p>
            </div>
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Business Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Peak Sales Day</h3>
                  <p className="text-sm text-blue-700">Your best performing day is typically weekends</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Customer Retention</h3>
                  <p className="text-sm text-green-700">25% of your customers are repeat buyers</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Package className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Product Performance</h3>
                  <p className="text-sm text-purple-700">Your top category generates 60% of revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics