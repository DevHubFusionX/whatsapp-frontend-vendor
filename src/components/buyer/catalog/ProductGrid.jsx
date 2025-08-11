import ProductCard from '../../catalog/ProductCard'

const ProductGrid = ({ products, vendor }) => {
  const handleProductMessage = (product) => {
    if (!vendor) return
    
    const message = `Hi! I'm interested in "${product.name}" priced at ₦${product.price?.toLocaleString()}. Is it available?`
    const whatsappUrl = `https://wa.me/${vendor.phoneNumber?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onMessage={handleProductMessage} 
        />
      ))}
    </div>
  )
}

export default ProductGrid