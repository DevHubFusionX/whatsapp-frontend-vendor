import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import { authAPI } from './services/api'
import Navbar from './components/ui/Navbar'
import LoadingSplash from './components/ui/LoadingSplash'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import ForgotPassword from './components/auth/ForgotPassword'
import Dashboard from './components/Dashboard'
import AddProduct from './components/AddProduct'
import EditProduct from './components/product/EditProduct'
import CatalogPage from './components/CatalogPage'
import Settings from './components/Settings'
import ProductManagement from './components/ProductManagement'
import StorePreview from './components/StorePreview'
import BuyerInteractions from './components/BuyerInteractions'
import TestAuth from './components/TestAuth'
import TestLogin from './components/TestLogin'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    console.error('useAuth called outside AuthProvider')
    return { isAuthenticated: false, vendor: null, login: () => {}, logout: () => {} }
  }
  return context
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Check session timeout first
      const loginTime = localStorage.getItem('loginTime')
      if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
        logout()
        setLoading(false)
        return
      }
      
      authAPI.getMe()
        .then(response => {
          if (response.data.user) {
            setVendor(response.data.user)
            setIsAuthenticated(true)
          } else {
            logout()
          }
        })
        .catch((error) => {
          console.error('Auth check failed:', error)
          logout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (vendorData) => {
    console.log('Setting authentication state:', vendorData)
    setIsAuthenticated(true)
    setVendor(vendorData)
    localStorage.setItem('loginTime', Date.now().toString())
  }

  const logout = () => {
    setIsAuthenticated(false)
    setVendor(null)
    localStorage.removeItem('token')
    localStorage.removeItem('loginTime')
  }

  if (showSplash) {
    return <LoadingSplash onComplete={() => setShowSplash(false)} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
          {isAuthenticated && <Navbar />}
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/forgot-password" 
              element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} 
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
            <Route 
              path="/test-login" 
              element={<TestLogin />} 
            />
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App