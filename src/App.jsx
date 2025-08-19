import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import { authAPI } from './services/api'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import EditProduct from './components/product/EditProduct'
import CatalogPage from './components/CatalogPage'
import Settings from './components/Settings'
import ProductManagement from './components/ProductManagement'
import StorePreview from './components/StorePreview'
import BuyerInteractions from './components/BuyerInteractions'
import TestAuth from './components/TestAuth'

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
              path="/products" 
              element={isAuthenticated ? <ProductManagement /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/store-preview" 
              element={isAuthenticated ? <StorePreview /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/buyers" 
              element={isAuthenticated ? <BuyerInteractions /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/catalog/:vendorId" 
              element={<CatalogPage />} 
            />
            <Route 
              path="/test-auth" 
              element={<TestAuth />} 
            />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App