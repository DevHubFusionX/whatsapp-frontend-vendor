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
  const [imageDetails, setImageDetails] = useState([])
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const validFiles = []
    const newPreviews = []
    const newDetails = []
    let hasError = false

    files.forEach(file => {
      const validation = validateFile(file)
      const fileDetail = {
        name: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        isValid: validation.isValid,
        error: validation.errors[0] || null
      }
      
      newDetails.push(fileDetail)
      
      if (!validation.isValid) {
        hasError = true
      } else {
        validFiles.push(file)
        
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target.result)
          if (newPreviews.length === validFiles.length) {
            setImagePreviews(prev => [...prev, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      }
    })

    setImageDetails(prev => [...prev, ...newDetails])
    
    if (validFiles.length > 0) {
      setErrors({ ...errors, image: '' })
      setImages(prev => [...prev, ...validFiles])
      if (!imagePreview) {
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target.result)
        reader.readAsDataURL(validFiles[0])
      }
    }
    
    if (hasError && validFiles.length === 0) {
      setErrors({ ...errors, image: 'Some files could not be uploaded. Check the requirements below.' })
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    const newDetails = imageDetails.filter((_, i) => i !== index)
    
    setImages(newImages)
    setImagePreviews(newPreviews)
    setImageDetails(newDetails)
    
    if (index === 0) {
      setImagePreview(newPreviews[0] || null)
    }
  }

  const removeAllImages = () => {
    setImages([])
    setImagePreviews([])
    setImageDetails([])
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
      {/* Enhanced Responsive Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-xs sm:text-sm text-gray-500">Create and showcase your amazing product to customers</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">New Product</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Product Creation Progress</span>
            <span className="text-sm text-gray-500">
              {(formData.name && formData.price && images.length > 0) ? '3/3' : 
               (formData.name && formData.price) ? '2/3' : 
               (formData.name || formData.price || images.length > 0) ? '1/3' : '0/3'} Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(formData.name && formData.price && images.length > 0) ? 100 : 
                        (formData.name && formData.price) ? 66 : 
                        (formData.name || formData.price || images.length > 0) ? 33 : 0}%` 
              }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Enhanced Image Upload Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
                  📸 Product Images
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">Required</span>
                </h2>
                <div className="text-xs text-gray-500">
                  {images.length}/10 images
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">High-quality images sell more products! Upload multiple angles to showcase your product</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <p className="text-xs text-yellow-800 font-medium mb-1">💡 Pro Tip for Better Sales:</p>
                <p className="text-xs text-yellow-700">Products with 3+ high-quality images get 40% more customer inquiries!</p>
              </div>
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
                
                {/* Image Details List */}
                {imageDetails.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">📋 Upload Status:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {imageDetails.map((detail, index) => (
                        <div key={index} className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                          detail.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              detail.isValid ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {detail.name}
                            </p>
                            <p className={`text-xs ${
                              detail.isValid ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {detail.formattedSize} {detail.error && `• ${detail.error}`}
                            </p>
                          </div>
                          <div className={`ml-2 w-6 h-6 rounded-full flex items-center justify-center ${
                            detail.isValid ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            <span className="text-white text-xs font-bold">
                              {detail.isValid ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Clear All Button */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-gray-500">💡 First image will be your main product photo</p>
                  <button
                    type="button"
                    onClick={removeAllImages}
                    className="py-2 px-4 text-red-600 hover:text-red-700 text-sm font-medium transition-colors hover:bg-red-50 rounded-lg"
                  >
                    Remove All
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                    <Upload className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">Upload Product Images</p>
                  <p className="text-sm text-gray-500 text-center mb-3">
                    Select multiple high-quality images for your product
                  </p>
                  <div className="bg-blue-50 rounded-xl p-3 sm:p-4 text-left">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">📸 Image Requirements:</h4>
                    <div className="space-y-1 text-xs text-blue-800">
                      <p>• <strong>Formats:</strong> PNG, JPG, JPEG</p>
                      <p>• <strong>Max Size:</strong> 15MB each</p>
                      <p>• <strong>Count:</strong> Up to 10 images</p>
                      <p>• <strong>Best:</strong> 1080x1080px (square)</p>
                      <p>• <strong>Min:</strong> 500x500px</p>
                      <p>• <strong>Quality:</strong> Clear & well-lit</p>
                    </div>
                  </div>
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

          {/* Enhanced Product Details Section */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center">
                ✍️ Product Information
              </h2>
              <p className="text-sm text-gray-500 mb-3">Provide clear, detailed information to help customers understand your product</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-xs text-green-800 font-medium mb-1">🎯 Writing Tips:</p>
                <p className="text-xs text-green-700">Use descriptive names, competitive prices, and highlight key features in descriptions</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Product Name *
                  <span className="text-xs text-gray-500 ml-2">(This is what customers will see first)</span>
                </label>
                <div className="relative">
                  <Package className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Wireless Headphones"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-300 hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💡 Use descriptive names that customers would search for</p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Price (₦) *
                  <span className="text-xs text-gray-500 ml-2">(Set a competitive price)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">₦</div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="5000"
                    step="1"
                    min="1"
                    className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-300 hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">💰 Research similar products to set competitive pricing</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Product Description
                  <span className="text-xs text-gray-500 ml-2">(Optional but recommended)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., High-quality wireless headphones with noise cancellation, 20-hour battery life..."
                    rows={3}
                    maxLength={150}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-300 resize-none hover:border-gray-300 transition-all duration-200 text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">📝 Highlight key features and benefits</p>
                  <p className="text-xs text-gray-400">{formData.description.length}/150 characters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Submit Section */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Ready to Launch Your Product? 🚀</h3>
              <p className="text-sm text-gray-600">Once you add this product, customers can find it in your store and contact you via WhatsApp</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 sm:py-4 px-6 border-2 border-gray-200 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name || !formData.price || images.length === 0}
                className="flex-1 py-3 sm:py-4 px-6 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl sm:rounded-2xl hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">Creating Product...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Add Product to Store</span>
                  </>
                )}
              </button>
            </div>
            
            {(!formData.name || !formData.price || images.length === 0) && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-xs text-yellow-800 font-medium mb-1">⚠️ Missing Required Information:</p>
                <ul className="text-xs text-yellow-700 space-y-0.5">
                  {!formData.name && <li>• Product name is required</li>}
                  {!formData.price && <li>• Product price is required</li>}
                  {images.length === 0 && <li>• At least one product image is required</li>}
                </ul>
              </div>
            )}
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