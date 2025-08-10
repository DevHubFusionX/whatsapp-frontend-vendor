import { Plus, Share2, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'

const QuickActions = ({ onShareCatalog }) => {
  const actions = [
    {
      icon: Plus,
      label: 'Add New Product',
      to: '/add-product',
      color: 'bg-green-50 hover:bg-green-100 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      icon: Share2,
      label: 'Share Catalog',
      onClick: onShareCatalog,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      icon: Zap,
      label: 'WhatsApp Automation',
      to: '/automation',
      color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700',
      iconColor: 'text-yellow-600'
    }
  ]

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Component = action.to ? Link : 'button'
          return (
            <Component
              key={index}
              to={action.to}
              onClick={action.onClick}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${action.color}`}
            >
              <action.icon className={`w-5 h-5 ${action.iconColor}`} />
              <span className="font-medium">{action.label}</span>
            </Component>
          )
        })}
      </div>
    </Card>
  )
}

export default QuickActions