import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import CatalogHome from './CatalogHome'
import ProductDetail from './ProductDetail'
import SearchPage from './SearchPage'
import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import OrderTrackingPage from './OrderTrackingPage'

const BuyerApp = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Home page - no login required */}
          <Route path="/" element={<HomePage />} />
          
          {/* Vendor catalog */}
          <Route path="/catalog/:vendorId" element={<CatalogHome />} />
          
          {/* Product details */}
          <Route path="/product/:productId" element={<ProductDetail />} />
          
          {/* Search */}
          <Route path="/search/:vendorId?" element={<SearchPage />} />
          
          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* Checkout */}
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Order tracking */}
          <Route path="/track" element={<OrderTrackingPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default BuyerApp