import { MessageCircle, Package, Phone } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const VendorHeader = ({ vendor, onMessage }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
          {vendor?.logo ? (
            <img src={vendor.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <Package className="w-10 h-10 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{vendor?.businessName}</h1>
          <p className="text-gray-600 mb-1">by {vendor?.name}</p>
          <div className="flex items-center space-x-1">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">{vendor?.phoneNumber}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onMessage()}
        className="w-full"
        size="lg"
      >
        <MessageCircle className="w-5 h-5" />
        Message Vendor
      </Button>
    </Card>
  )
}

export default VendorHeader