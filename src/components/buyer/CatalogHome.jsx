import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, List, Package, ArrowLeft } from 'lucide-react'
import { vendorsAPI } from '../../services/api'
import ProductGrid from './catalog/ProductGrid'
import ProductList from './catalog/ProductList'
import BottomNav from './catalog/BottomNav'
import SearchBar from './search/SearchBar'

const CatalogHome = () => {
  const { vendorId } = useParams()
  const [products, setProducts] = useState([])
  const [vendor, setVendor] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendorData()
  }, [vendorId])

  const fetchVendorData = async () => {
    try {
      const response = await vendorsAPI.getVendorCatalog(vendorId)
      setVendor(response.data.vendor)
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Failed to fetch vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">{vendor?.businessName}</h1>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        
        {/* View Toggle */}
        <div className="px-4 pb-3 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
          </div>
        ) : viewMode === 'grid' ? (
          <ProductGrid products={filteredProducts} vendor={vendor} />
        ) : (
          <ProductList products={filteredProducts} vendor={vendor} />
        )}
      </div>

      <BottomNav vendor={vendor} />
    </div>
  )
}

export default CatalogHome