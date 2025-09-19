import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, Facebook, Twitter } from 'lucide-react'

const SocialShare = ({ product, productUrl }) => {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = `🛍️ Check out this amazing product!\n\n📦 ${product.name}\n💰 ₦${product.price?.toLocaleString()}\n\n${product.description ? `${product.description}\n\n` : ''}🔗 Shop now: ${productUrl}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, '_blank')
    setShowModal(false)
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    window.open(facebookUrl, '_blank')
    setShowModal(false)
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on Vendly!`)}&url=${encodeURIComponent(productUrl)}`
    window.open(twitterUrl, '_blank')
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-2xl text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Share to customers
        </div>
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/20 transform transition-all duration-300 scale-100 animate-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Share Product</h3>
              <p className="text-sm text-gray-600">Boost your sales by sharing with customers!</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={handleWhatsAppShare}
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl transition-all transform hover:scale-105 active:scale-95 border border-green-200/50"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-700">WhatsApp</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all transform hover:scale-105 active:scale-95 border border-blue-200/50"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Facebook</span>
              </button>

              <button
                onClick={handleTwitterShare}
                className="group flex flex-col items-center p-4 bg-gradient-to-br from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 rounded-2xl transition-all transform hover:scale-105 active:scale-95 border border-sky-200/50"
              >
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-sky-700">Twitter</span>
              </button>

              <button
                onClick={handleCopyLink}
                className={`group flex flex-col items-center p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 border ${
                  copied 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200/50' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
                  copied ? 'bg-green-500' : 'bg-gray-500'
                }`}>
                  {copied ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Copy className="w-6 h-6 text-white" />
                  )}
                </div>
                <span className={`text-sm font-semibold ${
                  copied ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SocialShare