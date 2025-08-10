import { MessageCircle, Package } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const ProductCard = ({ product, onMessage }) => {
  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-12 h-12 text-gray-300" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-green-600 mb-2">
          ₦{product.price.toLocaleString()}
        </p>
        {product.description && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        <Button
          onClick={() => onMessage(product)}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard