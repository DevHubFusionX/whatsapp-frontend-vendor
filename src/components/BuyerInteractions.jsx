import { useState, useEffect } from 'react'
import { Users, MessageCircle, Eye, Calendar } from 'lucide-react'
import Header from './ui/Header'

const BuyerInteractions = () => {
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading interactions
    setTimeout(() => {
      setInteractions([
        {
          id: 1,
          buyerName: 'John Doe',
          email: 'john@example.com',
          productName: 'Sample Product',
          timestamp: new Date().toISOString(),
          status: 'Clicked to Chat'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Buyer Interactions"
        subtitle="See who's interested in your products"
      />

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {interactions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No interactions yet</h3>
              <p className="text-gray-500">
                When buyers click "Message Vendor" from your catalog, they'll appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Interactions</h2>
              {interactions.map((interaction) => (
                <div key={interaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{interaction.buyerName}</h3>
                    <p className="text-sm text-gray-600">{interaction.email}</p>
                    <p className="text-sm text-gray-500">Interested in: {interaction.productName}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(interaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-medium">
                      {interaction.status}
                    </span>
                    <button className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerInteractions