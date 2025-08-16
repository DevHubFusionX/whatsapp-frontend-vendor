import { useState, useEffect } from 'react'
import { Search, MapPin, ChevronDown, Shirt, Utensils, Smartphone, Package } from 'lucide-react'
import { productsAPI } from '../../services/api'
import BuyerProductCard from './BuyerProductCard'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('Lagos, Nigeria')
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const categories = [
    { name: 'Clothing', icon: Shirt, color: 'bg-blue-100 text-blue-600' },
    { name: 'Food', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { name: 'Electronics', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
    { name: 'Others', icon: Package, color: 'bg-gray-100 text-gray-600' }
  ]

  const locations = ['Lagos, Nigeria', 'Abuja, Nigeria', 'Kano, Nigeria', 'Port Harcourt, Nigeria']

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productsAPI.getProducts()
      // Get random featured products
      const shuffled = response.data.sort(() => 0.5 - Math.random())
      const featured = shuffled.slice(0, 6).map(p => ({...p, id: p._id}))
      setFeaturedProducts(featured)
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Fallback to empty array
      setFeaturedProducts([])
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results
      console.log('Searching for:', searchQuery)
    }
  }

  const handleCategoryClick = (category) => {
    console.log('Category selected:', category)
  }

  const handleProductMessage = (product) => {
    const message = `Hi! I'm interested in "${product.name}" priced at ₦${product.price?.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search products or vendors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="relative">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{selectedLocation}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location)
                      setShowLocationDropdown(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {location}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Products</h2>
        <div className="horizontal-scroll flex space-x-4 overflow-x-auto pb-2">
          {featuredProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-48">
              <BuyerProductCard product={product} onMessage={handleProductMessage} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products Grid */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Products</h2>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.slice(0, 4).map((product) => (
            <BuyerProductCard key={product.id} product={product} onMessage={handleProductMessage} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage