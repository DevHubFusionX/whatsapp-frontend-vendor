import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, X, Package, DollarSign, FileText, Plus } from 'lucide-react'
import { productsAPI } from '../services/api'
import { formatPrice, validateFile } from '../utils/formatters'
import { useToast } from '../hooks/useToast'
import Toast from './ui/Toast'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'general'
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { toasts, success, error, removeToast } = useToast()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validFiles = []
    const newPreviews = []
    let hasError = false

    files.forEach(file => {
      const validation = validateFile(file)
      if (!validation.isValid) {
        setErrors({ ...errors, image: validation.errors[0] })
        hasError = true
        return
      }
      validFiles.push(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        newPreviews.push(e.target.result)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews(prev => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    if (!hasError) {
      setErrors({ ...errors, image: '' })
      setImages(prev => [...prev, ...validFiles])
      if (validFiles.length > 0 && !imagePreview) {
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target.result)
        reader.readAsDataURL(validFiles[0])
      }
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    setImages(newImages)
    setImagePreviews(newPreviews)
    
    if (index === 0) {
      setImagePreview(newPreviews[0] || null)
    }
  }

  const removeAllImages = () => {
    setImages([])
    setImagePreviews([])
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (images.length === 0) newErrors.image = 'At least one product image is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    try {
      await productsAPI.addProduct({
        ...formData,
        images: imagePreviews,
        image: imagePreview // Keep main image for backward compatibility
      })
      success('Product added successfully!')
      setTimeout(() => navigate('/products'), 1000)
    } catch (err) {
      error('Failed to add product. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500">Create a new product for your store</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Image</h2>
              <p className="text-sm text-gray-500">Upload a high-quality image of your product</p>
            </div>
            
            {imagePreviews.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Main Preview"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
                
                {/* Image Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className={`w-full h-20 object-cover rounded-xl cursor-pointer transition-all ${
                          preview === imagePreview ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
                        }`}
                        onClick={() => setImagePreview(preview)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Clear All Button */}
                <button
                  type="button"
                  onClick={removeAllImages}
                  className="w-full py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Remove All Images
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <Upload className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Product Images</p>
                  <p className="text-sm text-gray-500 text-center">
                    Select multiple images for your product<br />
                    <span className="text-xs">PNG, JPG or JPEG (MAX. 5MB each)</span>
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Product Details Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h2>
              <p className="text-sm text-gray-500">Add product info that buyers will see in your catalog</p>
            </div>
            
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Name *
                </label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Short Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description for WhatsApp messages..."
                    rows={3}
                    maxLength={100}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{formData.description.length}/100 characters</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-4 px-6 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.price}
              className="flex-1 py-4 px-6 bg-gradient-success text-white rounded-2xl hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default AddProduct