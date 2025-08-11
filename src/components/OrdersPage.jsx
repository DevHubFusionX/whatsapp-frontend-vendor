import { useState, useEffect } from 'react'
import { MessageCircle, Eye, Filter, Download, CheckCircle, Clock, Truck } from 'lucide-react'
import Header from './ui/Header'
import { ordersAPI } from '../services/api'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getAllOrders()
        const formattedOrders = response.data.map(order => ({
          id: order._id,
          buyerName: order.buyerName,
          buyerPhone: order.buyerPhone,
          items: order.items,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          deliveryAddress: order.deliveryAddress
        }))
        setOrders(formattedOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      
      // Send WhatsApp notification to buyer
      const order = orders.find(o => o.id === orderId)
      if (order) {
        const statusMessages = {
          processing: `Hi ${order.buyerName}! Your order is now being processed. We'll update you once it's ready for delivery.`,
          shipped: `Great news ${order.buyerName}! Your order is on the way. You should receive it soon.`,
          delivered: `Hi ${order.buyerName}! Your order has been delivered. Thank you for shopping with us!`
        }
        
        const message = statusMessages[newStatus]
        if (message) {
          const whatsappUrl = `https://wa.me/${order.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
          window.open(whatsappUrl, '_blank')
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const handleMessageBuyer = (order) => {
    const message = `Hi ${order.buyerName}! Regarding your order (${order.items.map(item => item.name).join(', ')}). How can I help you?`
    const whatsappUrl = `https://wa.me/${order.buyerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || colors.pending
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: Clock,
      shipped: Truck,
      delivered: CheckCircle
    }
    const Icon = icons[status] || Clock
    return <Icon className="w-4 h-4" />
  }

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  )

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
        title="Orders Management"
        subtitle={`${orders.length} total orders`}
      />

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            
            <button className="flex items-center space-x-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.buyerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">₦{order.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">Delivery Address:</h4>
                  <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleMessageBuyer(order)}
                    className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message Buyer</span>
                  </button>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'processing')}
                      className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Start Processing</span>
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'shipped')}
                      className="flex items-center justify-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-600 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Mark as Shipped</span>
                    </button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Delivered</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center justify-center space-x-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage