import { useState } from 'react'
import { Search, MessageCircle, Package, Truck, CheckCircle, Clock } from 'lucide-react'

const OrderTrackingPage = () => {
  const [trackingInput, setTrackingInput] = useState('')
  const [orderData, setOrderData] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  // Mock order statuses
  const orderStatuses = [
    { id: 'placed', label: 'Order Placed', icon: Package, completed: true, timestamp: '2024-01-15 10:30 AM' },
    { id: 'processing', label: 'Processing', icon: Clock, completed: true, timestamp: '2024-01-15 11:15 AM' },
    { id: 'shipping', label: 'On the Way', icon: Truck, completed: false, timestamp: null },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle, completed: false, timestamp: null }
  ]

  const handleTrackOrder = async () => {
    if (!trackingInput.trim()) return
    
    setIsSearching(true)
    
    // Mock API call
    setTimeout(() => {
      setOrderData({
        id: 'ORD-2024-001',
        customerName: 'John Doe',
        customerPhone: '+234 800 000 0000',
        items: [
          { name: 'Premium Ankara Dress', quantity: 1, price: 15000 },
          { name: 'Fresh Jollof Rice', quantity: 2, price: 2500 }
        ],
        total: 20000,
        vendor: {
          name: 'Fashion Hub Lagos',
          phone: '+234 800 111 2222'
        },
        status: 'processing',
        estimatedDelivery: '2024-01-17',
        trackingNumber: 'TRK123456789'
      })
      setIsSearching(false)
    }, 1500)
  }

  const handleContactVendor = () => {
    if (!orderData) return
    
    const message = `Hi! I'm tracking my order ${orderData.id}. Can you provide an update on the delivery status?`
    const whatsappUrl = `https://wa.me/${orderData.vendor.phone.replace(/\\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const getCurrentStatusIndex = () => {
    if (!orderData) return 0
    return orderStatuses.findIndex(status => status.id === orderData.status)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          
          {/* Search Input */}
          <div className="space-y-3">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Enter phone number or order ID"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
            />
            <button
              onClick={handleTrackOrder}
              disabled={isSearching || !trackingInput.trim()}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors min-h-[48px] flex items-center justify-center space-x-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Details */}
      {orderData && (
        <div className="p-4 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900">{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number:</span>
                <span className="font-medium text-gray-900">{orderData.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vendor:</span>
                <span className="font-medium text-gray-900">{orderData.vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">₦{orderData.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Delivery:</span>
                <span className="font-medium text-gray-900">{new Date(orderData.estimatedDelivery).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6">Order Progress</h3>
            
            <div className="space-y-6">
              {orderStatuses.map((status, index) => {
                const IconComponent = status.icon
                const isCompleted = index <= getCurrentStatusIndex()
                const isCurrent = index === getCurrentStatusIndex()
                
                return (
                  <div key={status.id} className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted 
                        ? 'bg-[#25D366] text-white' 
                        : isCurrent 
                        ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {status.label}
                        </h4>
                        {status.timestamp && (
                          <span className="text-xs text-gray-500">{status.timestamp}</span>
                        )}
                      </div>
                      {isCurrent && (
                        <p className="text-sm text-blue-600 mt-1">In progress...</p>
                      )}
                    </div>
                    
                    {/* Connector Line */}
                    {index < orderStatuses.length - 1 && (
                      <div className={`absolute left-9 mt-10 w-0.5 h-6 ${
                        isCompleted ? 'bg-[#25D366]' : 'bg-gray-200'
                      }`} style={{ marginLeft: '-1px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Vendor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Contact the vendor directly for any questions about your order.
            </p>
            <button
              onClick={handleContactVendor}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-3 px-4 rounded-lg transition-colors min-h-[48px] flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Vendor</span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!orderData && !isSearching && (
        <div className="flex flex-col items-center justify-center p-8 mt-16">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Track Your Order</h2>
          <p className="text-gray-600 text-center">
            Enter your phone number or order ID above to track your order status
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderTrackingPage