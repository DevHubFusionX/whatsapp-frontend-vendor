import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './ui/Header'
import Button from './ui/Button'
import ImageUpload from './product/ImageUpload'
import ProductForm from './product/ProductForm'
import { productsAPI } from '../services/api'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'general'
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await productsAPI.addProduct({
        ...formData,
        image: imagePreview
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to add product:', error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Add Product"
        backTo="/dashboard"
      />

      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload
            image={imagePreview}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          <ProductForm
            formData={formData}
            onChange={handleInputChange}
          />

          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.price}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct