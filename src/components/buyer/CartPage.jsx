import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // Mock cart items
    setCartItems([
      { 
        id: 1, 
        name: 'Premium Ankara Dress', 
        price: 15000, 
        quantity: 1, 
        image: null,
        vendor: 'Fashion Hub Lagos'
      },
      { 
        id: 2, 
        name: 'Fresh Jollof Rice', 
        price: 2500, 
        quantity: 2, 
        image: null,
        vendor: 'Mama\'s Kitchen'
      }
    ])
  }, [])

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setTotal(newTotal)
  }, [cartItems])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const handleCheckout = () => {
    // Navigate to checkout
    console.log('Proceeding to checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 text-center mb-6">Add some products to get started</p>
        <button className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium py-3 px-6 rounded-lg">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex space-x-4">
              {/* Product Image */}
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-gray-300" />
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{item.vendor}</p>
                <p className="text-lg font-bold text-gray-900">
                  ₦{item.price.toLocaleString()}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="font-bold text-gray-900">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Bottom Checkout */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold py-4 px-6 rounded-lg transition-colors min-h-[56px]"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage