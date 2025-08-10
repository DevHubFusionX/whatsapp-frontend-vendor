import { useState } from 'react'
import { Copy, Share2, MessageCircle } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const ProductCardGenerator = ({ product, vendor }) => {
  const [copied, setCopied] = useState(false)
  
  const catalogUrl = `${window.location.origin}/catalog/${vendor?.catalogId}`
  
  const cardText = `🛍️ *${product.name}*

💰 ₦${product.price.toLocaleString()}

${product.description}

📱 Message me to order!
${catalogUrl}`

  const copyCard = () => {
    navigator.clipboard.writeText(cardText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(cardText)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">WhatsApp Product Card</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-green-500">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {cardText}
        </pre>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={copyCard} className="flex-1">
          {copied ? '✓ Copied!' : <><Copy className="w-4 h-4" /> Copy</>}
        </Button>
        
        <Button onClick={shareToWhatsApp} className="flex-1">
          <MessageCircle className="w-4 h-4" />
          Share to WhatsApp
        </Button>
      </div>
    </Card>
  )
}

export default ProductCardGenerator