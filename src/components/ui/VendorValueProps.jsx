import { Store, MessageCircle, Users, Zap, Shield } from 'lucide-react'

const VendorValueProps = () => {
  const benefits = [
    {
      icon: Store,
      title: "Professional Storefront",
      subtitle: "The \"Wow\" Factor",
      description: "Stop sending blurry photos in chats. Send one beautiful, professional link that showcases all your products in a clean, organized way. Impress your customers and build trust instantly.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Organized Inbox",
      subtitle: "Save Time Factor",
      description: "Tired of 'Hi, is this available?' followed by 20 questions? With Vendly, customers inquire about specific products with clear messages that cut down repetitive questions.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Built-In Discoverability",
      subtitle: "Grow Your Business",
      description: "Don't just rely on your own followers. Get featured on the Vendly homepage and in our social media. We promote our vendors to bring you new customers you wouldn't have reached on your own.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Power-Up Your Social Media",
      subtitle: "No Risk Factor",
      description: "This isn't a replacement for your social media; it's a power-up for it. Use your Instagram to get followers, then put your Vendly link in your bio. Best of both worlds!",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Zero Cost, Zero Risk",
      subtitle: "No Brainer Factor",
      description: "It's completely free to start. No monthly fees, no listing fees. You have nothing to lose and a whole new sales channel to gain. Why wouldn't you try it?",
      color: "from-teal-500 to-teal-600"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-blue-200/50">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Vendly Solves Your WhatsApp Business Problems
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          "Vendly gives you the power of a professional online store, with the convenience and personal touch of WhatsApp."
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{benefit.subtitle}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Pain Points Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200/50 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Are You Struggling With These Problems?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">Orders and payments get lost in chaotic chats</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">Sending pictures one by one looks unprofessional</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">Hard for new customers to find you</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">Constantly re-sending product details to different people</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">WhatsApp status disappears in 24 hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-gray-700">No permanent storefront for your business</span>
          </div>
        </div>
      </div>
      
      <div className="text-center p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white">
        <h3 className="text-2xl font-bold mb-2">You Are The Missing Link</h3>
        <p className="text-white/90 text-lg">
          Between social media discovery and WhatsApp communication. 
          Bring order, professionalism, and new customers to where you already love to sell.
        </p>
      </div>
    </div>
  )
}

export default VendorValueProps