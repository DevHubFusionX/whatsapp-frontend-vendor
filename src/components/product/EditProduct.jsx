import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../ui/Header'
import Button from '../ui/Button'
import ImageUpload from './ImageUpload'
import ProductForm from './ProductForm'
import { productsAPI } from '../../services/api'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'general'
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getProducts()
        const product = response.data.find(p => p._id === id)
        if (product) {
          setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            category: product.category
          })
          setImagePreview(product.image)
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      }
      setFetchLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => setImagePreview(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await productsAPI.updateProduct(id, {
        ...formData,
        image: imagePreview
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to update product:', error)
    }
    setLoading(false)
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Edit Product" backTo="/dashboard" />
      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            image={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />
          <ProductForm formData={formData} onChange={handleInputChange} />
          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.price}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Updating Product...' : 'Update Product'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct