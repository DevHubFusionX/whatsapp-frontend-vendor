import { useState, useEffect } from 'react'
import { Search, Book, MessageCircle, Video, FileText, ChevronRight, Star, ThumbsUp, Clock, Users } from 'lucide-react'

const HelpCenter = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('getting-started')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      articles: [
        {
          title: 'How to set up your store in 5 minutes',
          description: 'Complete step-by-step guide to get your store ready',
          readTime: '3 min read',
          popular: true
        },
        {
          title: 'Adding your first product',
          description: 'Learn how to create compelling product listings',
          readTime: '2 min read',
          popular: true
        },
        {
          title: 'Sharing your store link effectively',
          description: 'Best practices for promoting your store',
          readTime: '4 min read'
        }
      ]
    },
    {
      id: 'products',
      title: 'Managing Products',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      articles: [
        {
          title: 'Taking great product photos',
          description: 'Photography tips that increase sales',
          readTime: '5 min read',
          popular: true
        },
        {
          title: 'Writing product descriptions that sell',
          description: 'Copywriting techniques for better conversions',
          readTime: '3 min read'
        },
        {
          title: 'Pricing your products competitively',
          description: 'Strategies for setting the right prices',
          readTime: '4 min read'
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      articles: [
        {
          title: 'Handling customer inquiries on WhatsApp',
          description: 'Best practices for customer communication',
          readTime: '3 min read'
        },
        {
          title: 'Building customer trust and loyalty',
          description: 'Strategies to keep customers coming back',
          readTime: '6 min read'
        },
        {
          title: 'Managing orders and deliveries',
          description: 'Streamline your fulfillment process',
          readTime: '4 min read'
        }
      ]
    },
    {
      id: 'marketing',
      title: 'Marketing & Sales',
      icon: ThumbsUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      articles: [
        {
          title: 'Growing your customer base organically',
          description: 'Free marketing strategies that work',
          readTime: '7 min read',
          popular: true
        },
        {
          title: 'Using social media to boost sales',
          description: 'Leverage Facebook, Instagram, and WhatsApp',
          readTime: '5 min read'
        },
        {
          title: 'Creating compelling promotions',
          description: 'Discount strategies that drive sales',
          readTime: '4 min read'
        }
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our team',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other vendors',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ]

  const filteredArticles = categories
    .find(cat => cat.id === selectedCategory)
    ?.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Book className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold">Help Center</h2>
                <p className="text-white/90 text-sm sm:text-base hidden sm:block">Find answers and grow your business</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl sm:text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-white/20 border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className={`flex ${isMobile ? 'flex-col' : ''} h-[calc(95vh-140px)] sm:h-[calc(90vh-200px)]`}>
          {/* Sidebar */}
          <div className={`${isMobile ? 'w-full border-b' : 'w-1/3 border-r'} border-gray-200 p-3 sm:p-6 overflow-y-auto`}>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Categories</h3>
            <div className={`${isMobile ? 'flex overflow-x-auto space-x-2 pb-2' : 'space-y-2'}`}>
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      ${isMobile ? 'flex-shrink-0' : 'w-full'} flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-200 text-left text-sm sm:text-base
                      ${selectedCategory === category.id
                        ? `${category.bgColor} ${category.color} shadow-sm`
                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">{category.title}</span>
                  </button>
                )
              })}
            </div>

            {/* Quick Actions */}
            {!isMobile && (
              <div className="mt-6 sm:mt-8">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Quick Actions</h3>
                <div className="space-y-2 sm:space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={index}
                        className={`
                          w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-200 text-left
                          hover:${action.bgColor} hover:${action.color} hover:shadow-sm
                        `}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-xs sm:text-sm">{action.title}</p>
                          <p className="text-xs text-gray-500 hidden sm:block">{action.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                {categories.find(cat => cat.id === selectedCategory)?.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {filteredArticles.map((article, index) => (
                <div
                  key={index}
                  className="group p-3 sm:p-4 border border-gray-200 rounded-xl sm:rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                          {article.title}
                        </h4>
                        {article.popular && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full self-start">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{article.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 text-sm sm:text-base px-4">
                  Try searching with different keywords or browse other categories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter