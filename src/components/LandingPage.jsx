import { useNavigate } from 'react-router-dom'
import { Store, MessageCircle, Users, Zap, Shield, CheckCircle, ArrowRight, Star } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()

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

  const painPoints = [
    "Orders and payments get lost in chaotic chats",
    "Sending pictures one by one looks unprofessional",
    "Hard for new customers to find you",
    "Constantly re-sending product details to different people",
    "WhatsApp status disappears in 24 hours",
    "No permanent storefront for your business"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Vendly</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Login
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Turn Your WhatsApp Into a
            <span className="text-green-600"> Professional Store</span>
          </h2>
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
            "Vendly gives you the power of a professional online store, with the convenience and personal touch of WhatsApp."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center space-x-2 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Store className="w-6 h-6" />
              <span>Create Your Store Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-2xl border-2 border-gray-200 transition-colors text-lg"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 border border-red-200/50">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Are You Struggling With These Problems?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {painPoints.map((point, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-2xl shadow-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Vendly Solves Your WhatsApp Business Problems
          </h3>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Transform your chaotic WhatsApp business into a professional, organized operation that attracts more customers.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-xl font-bold text-gray-900">{benefit.title}</h4>
                        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">{benefit.subtitle}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">1,000+</p>
                <p className="text-gray-600">Active Vendors</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">10,000+</p>
                <p className="text-gray-600">Products Listed</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">50,000+</p>
                <p className="text-gray-600">Orders Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Missing Link Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-12 text-white">
            <h3 className="text-4xl font-bold mb-6">You Are The Missing Link</h3>
            <p className="text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Between social media discovery and WhatsApp communication. 
              Bring order, professionalism, and new customers to where you already love to sell.
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-green-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Your Professional Store Now
            </button>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful vendors who've already made the switch to professional selling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started Free - No Risk!
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✓ Free forever ✓ No monthly fees ✓ Setup in 2 minutes
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">Vendly</span>
          </div>
          <p className="text-gray-400">
            Transform your WhatsApp business into a professional store
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage