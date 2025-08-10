import { useState, useEffect } from 'react'
import { Clock, Zap } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const AutoPostSettings = () => {
  const [settings, setSettings] = useState({
    isEnabled: false,
    postTime: '09:00',
    selectedProducts: [],
    postFrequency: 'daily'
  })
  const [products, setProducts] = useState([])

  const handleSave = () => {
    alert('Auto-post settings saved!')
  }

  const toggleProduct = (productId) => {
    setSettings(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId]
    }))
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-800">Auto WhatsApp Status</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Enable Auto-Posting</span>
          <button
            onClick={() => setSettings(prev => ({ ...prev, isEnabled: !prev.isEnabled }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.isEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settings.isEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {settings.isEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Post Time
              </label>
              <input
                type="time"
                value={settings.postTime}
                onChange={(e) => setSettings(prev => ({ ...prev, postTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={settings.postFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, postFrequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </>
        )}
      </div>

      <Button onClick={handleSave} className="w-full mt-6">
        Save Auto-Post Settings
      </Button>
    </Card>
  )
}

export default AutoPostSettings