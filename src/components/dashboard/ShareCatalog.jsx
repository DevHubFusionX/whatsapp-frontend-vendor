import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, Facebook, Instagram } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'

const ShareCatalog = ({ vendor, onClose }) => {
  const [copied, setCopied] = useState(false)
  const catalogUrl = `http://localhost:5174/catalog/${vendor.catalogId}`

  const copyLink = () => {
    navigator.clipboard.writeText(catalogUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToWhatsAppStatus = () => {
    const message = `🛍️ *${vendor.businessName}*\n\nBrowse my products and message me directly for orders!\n\n${catalogUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const shareToWhatsAppChat = () => {
    const message = `🛍️ Check out my product catalog: ${catalogUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Share Your Catalog</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Catalog Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Catalog Link</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <code className="text-sm text-gray-700 break-all">{catalogUrl}</code>
              </div>
              <Button variant="outline" onClick={copyLink}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Share To</label>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={shareToWhatsAppStatus}
                className="w-full justify-start"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                WhatsApp Status
              </Button>
              
              <Button
                variant="outline"
                onClick={shareToWhatsAppChat}
                className="w-full justify-start"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                WhatsApp Chat
              </Button>
            </div>
          </div>

          {/* Social Media Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">💡 Pro Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add link to your Instagram/Facebook bio</li>
              <li>• Print on business cards & flyers</li>
              <li>• Share in WhatsApp groups</li>
              <li>• Send directly to customers</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ShareCatalog