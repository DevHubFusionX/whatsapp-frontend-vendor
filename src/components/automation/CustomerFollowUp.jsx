import { useState, useEffect } from 'react'
import { MessageCircle, Clock, User } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const CustomerFollowUp = () => {
  const [customers, setCustomers] = useState([
    {
      _id: '1',
      phoneNumber: '+2348012345678',
      name: 'John Doe',
      lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000),
      interestedProducts: [
        { product: { name: 'Premium Coffee', price: 2500 }, timestamp: new Date() }
      ]
    }
  ])

  const sendFollowUp = (customer) => {
    const product = customer.interestedProducts[0]?.product
    const message = `Hi! I noticed you were interested in ${product?.name} for ₦${product?.price.toLocaleString()}. 

Still interested? I can offer you a special discount! 😊`
    
    const whatsappUrl = `https://wa.me/${customer.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const formatTime = (date) => {
    const hours = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60))
    return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">Customer Follow-Up</h2>
      </div>

      <div className="space-y-4">
        {customers.map(customer => (
          <div key={customer._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">{customer.phoneNumber}</p>
                  <p className="text-sm text-gray-500">Last seen: {formatTime(customer.lastInteraction)}</p>
                </div>
              </div>
              <Button
                onClick={() => sendFollowUp(customer)}
                size="sm"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4" />
                Follow Up
              </Button>
            </div>
            
            {customer.interestedProducts.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Interested in:</p>
                <p className="text-green-600 font-semibold">
                  {item.product.name} - ₦{item.product.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ))}
        
        {customers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No customers to follow up with</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default CustomerFollowUp