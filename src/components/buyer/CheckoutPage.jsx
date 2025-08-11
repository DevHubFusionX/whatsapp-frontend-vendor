import { useState } from 'react'
import { ArrowLeft, CreditCard, Banknote, Smartphone } from 'lucide-react'

const CheckoutPage = () => {
  const [buyerDetails, setBuyerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  })
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock order items
  const orderItems = [
    { id: 1, name: 'Premium Ankara Dress', price: 15000, quantity: 1, vendor: 'Fashion Hub Lagos' },
    { id: 2, name: 'Fresh Jollof Rice', price: 2500, quantity: 2, vendor: 'Mama\'s Kitchen' }
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = 1500
  const total = subtotal + deliveryFee

  const paymentOptions = [
    { id: 'cod', name: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive your order' },
    { id: 'transfer', name: 'Bank Transfer', icon: CreditCard, description: 'Transfer to vendor account' },
    { id: 'paystack', name: 'Card Payment', icon: Smartphone, description: 'Pay with debit/credit card' }
  ]

  const handleInputChange = (field, value) => {
    setBuyerDetails(prev => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true)
    
    // Validate form
    if (!buyerDetails.name || !buyerDetails.phone || !buyerDetails.address) {
      alert('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Create order summary for WhatsApp
    const orderSummary = `
🛍️ *NEW ORDER*

👤 *Customer Details:*
Name: ${buyerDetails.name}
Phone: ${buyerDetails.phone}
Address: ${buyerDetails.address}, ${buyerDetails.city}, ${buyerDetails.state}

📦 *Order Items:*
${orderItems.map(item => `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`).join('\\n')}

💰 *Order Summary:*
Subtotal: ₦${subtotal.toLocaleString()}
Delivery: ₦${deliveryFee.toLocaleString()}
*Total: ₦${total.toLocaleString()}*

💳 *Payment Method:* ${paymentOptions.find(p => p.id === selectedPayment)?.name}

Please confirm this order. Thank you! 🙏
    `.trim()

    // Send to vendor WhatsApp (using first vendor for demo)
    const vendorPhone = '2348000000000' // Mock vendor phone
    const whatsappUrl = `https://wa.me/${vendorPhone}?text=${encodeURIComponent(orderSummary)}`
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
      setIsSubmitting(false)
      // Navigate to order tracking or success page
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center space-x-3">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Buyer Details Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={buyerDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={buyerDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                placeholder="+234 800 000 0000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
              <textarea
                value={buyerDetails.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none"
                placeholder="Enter your complete delivery address"
              />\n            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={buyerDetails.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                  placeholder="Lagos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={buyerDetails.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                  placeholder="Lagos State"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            {orderItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} • {item.vendor}</p>
                </div>
                <p className="font-semibold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            {paymentOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={selectedPayment === option.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="w-4 h-4 text-[#25D366] border-gray-300 focus:ring-[#25D366]"
                  />
                  <div className="ml-4 flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors min-h-[56px] flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  )
}

export default CheckoutPage