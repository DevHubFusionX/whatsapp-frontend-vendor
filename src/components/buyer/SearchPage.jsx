import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import SearchBar from './search/SearchBar'
import ProductGrid from './catalog/ProductGrid'
import BottomNav from './catalog/BottomNav'
import Button from '../ui/Button'

const SearchPage = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  })

  useEffect(() => {
    setTimeout(() => {
      setVendor({
        id: vendorId,
        businessName: 'Fresh Market Store',
        phoneNumber: '+1234567890'
      })
      
      setProducts([
        { id: 1, name: 'Premium Coffee Beans', price: '24.99', category: 'beverages' },
        { id: 2, name: 'Organic Tea Set', price: '18.50', category: 'beverages' },
        { id: 3, name: 'Artisan Chocolate', price: '12.99', category: 'snacks' },
        { id: 4, name: 'Fresh Honey', price: '15.99', category: 'food' },
        { id: 5, name: 'Herbal Soap', price: '8.99', category: 'personal-care' },
        { id: 6, name: 'Green Smoothie Mix', price: '22.50', category: 'beverages' }
      ])
    }, 500)
  }, [vendorId])

  const categories = ['beverages', 'snacks', 'food', 'personal-care']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesPrice = (!filters.minPrice || parseFloat(product.price) >= parseFloat(filters.minPrice)) &&
                         (!filters.maxPrice || parseFloat(product.price) <= parseFloat(filters.maxPrice))
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '' })
  }

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="text-xl font-bold text-gray-800">Search Products</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-auto"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="$0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="$100"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <ProductGrid products={filteredProducts} vendor={vendor} />
      </div>

      <BottomNav vendor={vendor} />
    </div>
  )
}

export default SearchPage