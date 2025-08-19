import { ArrowLeft, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../App'

const Header = ({ title, subtitle, backTo, actions, showLogout = true }) => {
  const { vendor, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {backTo && (
            <Link
              to={backTo}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {vendor?.businessName && (
            <span className="text-sm font-medium text-gray-700">{vendor.businessName}</span>
          )}
          {actions}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header