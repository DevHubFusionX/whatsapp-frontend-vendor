import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import { authAPI } from './services/api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import EditProduct from './components/product/EditProduct'
import AutomationDashboard from './components/AutomationDashboard'
import CatalogPage from './components/CatalogPage'
import Settings from './components/Settings'
import Analytics from './components/Analytics'
import OrdersPage from './components/OrdersPage'
import InventoryManagement from './components/InventoryManagement'
// Buyer Components
import CatalogHome from './components/buyer/CatalogHome'
import ProductDetail from './components/buyer/ProductDetail'
import VendorProfile from './components/buyer/VendorProfile'
import SearchPage from './components/buyer/SearchPage'
// Vendor Components
import VendorProductList from './components/vendor/VendorProductList'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then(response => {
          setVendor(response.data.vendor)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
    }
    setLoading(false)
  }, [])

  const login = (vendorData) => {
    setIsAuthenticated(true)
    setVendor(vendorData)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setVendor(null)
    localStorage.removeItem('token')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      vendor, 
      setVendor,
      login, 
      logout
    }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/add-product" 
              element={isAuthenticated ? <AddProduct /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/edit-product/:id" 
              element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/automation" 
              element={isAuthenticated ? <AutomationDashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analytics" 
              element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/orders" 
              element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/inventory" 
              element={isAuthenticated ? <InventoryManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/catalog/:vendorId" 
              element={<CatalogHome />} 
            />
            <Route 
              path="/product/:productId" 
              element={<ProductDetail />} 
            />
            <Route 
              path="/vendor/:vendorId" 
              element={<VendorProfile />} 
            />
            <Route 
              path="/search/:vendorId" 
              element={<SearchPage />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/vendor/products" 
              element={isAuthenticated ? <VendorProductList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/old-catalog/:vendorId" 
              element={<CatalogPage />} 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App