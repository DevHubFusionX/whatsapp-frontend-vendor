import { useState } from 'react'
import { Zap, MessageCircle, Clock, TrendingUp } from 'lucide-react'
import { useAuth } from '../App'
import Header from './ui/Header'
import AutoPostSettings from './automation/AutoPostSettings'
import CustomerFollowUp from './automation/CustomerFollowUp'
import ProductCardGenerator from './automation/ProductCardGenerator'

const AutomationDashboard = () => {
  const { vendor } = useAuth()
  const [activeTab, setActiveTab] = useState('autopost')
  
  const sampleProduct = {
    name: 'Premium Coffee Beans',
    price: 2500,
    description: 'Freshly roasted premium coffee beans from Colombia. Rich, full-bodied flavor perfect for your morning brew.'
  }

  const tabs = [
    { id: 'autopost', label: 'Auto-Post', icon: Zap },
    { id: 'followup', label: 'Follow-Up', icon: Clock },
    { id: 'cards', label: 'Product Cards', icon: MessageCircle },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="WhatsApp Automation" backTo="/dashboard" />
      
      <div className="p-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'autopost' && <AutoPostSettings />}
          
          {activeTab === 'followup' && <CustomerFollowUp />}
          
          {activeTab === 'cards' && (
            <ProductCardGenerator product={sampleProduct} vendor={vendor} />
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white p-8 rounded-2xl text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Analytics Coming Soon</h3>
              <p className="text-gray-600">Track your WhatsApp engagement and sales performance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AutomationDashboard