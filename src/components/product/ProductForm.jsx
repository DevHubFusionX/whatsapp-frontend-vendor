import { Package, DollarSign } from 'lucide-react'
import Input from '../ui/Input'
import Card from '../ui/Card'

const ProductForm = ({ formData, onChange }) => {
  return (
    <Card className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
      
      <Input
        label="Product Name"
        icon={Package}
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="Enter product name"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price *
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hover:border-gray-300 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe your product..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none hover:border-gray-300 transition-all duration-200"
        />
      </div>
    </Card>
  )
}

export default ProductForm