import { useState, useEffect } from 'react'
import { CheckCircle, Circle, ArrowRight, Star, Gift, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../App'

const OnboardingChecklist = ({ onComplete }) => {
  const { vendor } = useAuth()
  const [completedSteps, setCompletedSteps] = useState([])
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Add your business details and photo',
      link: '/settings',
      check: () => vendor?.businessName && vendor?.name && vendor?.phone,
      reward: '🎯 Build customer trust'
    },
    {
      id: 'first-product',
      title: 'Add Your First Product',
      description: 'Upload a product with photo and details',
      link: '/add-product',
      check: () => false, // This would need to check actual products
      reward: '🚀 Start selling immediately'
    },
    {
      id: 'store-preview',
      title: 'Preview Your Store',
      description: 'See how customers view your store',
      link: '/store-preview',
      check: () => false,
      reward: '👀 Perfect customer experience'
    },
    {
      id: 'share-store',
      title: 'Share Your Store Link',
      description: 'Get your first customers',
      link: '/dashboard',
      check: () => false,
      reward: '💰 Get your first sales'
    }
  ]

  useEffect(() => {
    const completed = steps.filter(step => step.check()).map(step => step.id)
    setCompletedSteps(completed)
  }, [vendor])

  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)
  const isCompleted = completedSteps.length === steps.length

  if (!isVisible || isCompleted) return null

  return (
    <div className="bg-gradient-rainbow rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-16 sm:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold">🎯 Setup Your Store</h3>
              <p className="text-white/90 text-xs sm:text-sm">Complete these steps to start selling</p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white text-xl sm:text-2xl flex-shrink-0 ml-2"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between text-xs sm:text-sm mb-2">
            <span>Progress</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
            <div 
              className="bg-white h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isNext = !isCompleted && completedSteps.length === index

            return (
              <Link
                key={step.id}
                to={step.link}
                className={`
                  p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 group touch-manipulation
                  ${isCompleted 
                    ? 'bg-white/20 border-white/40' 
                    : isNext
                      ? 'bg-white/10 border-white/60 hover:bg-white/20 active:scale-95 sm:hover:scale-105'
                      : 'bg-white/5 border-white/20 opacity-75'
                  }
                `}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                    ) : (
                      <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">{step.title}</h4>
                    <p className="text-white/80 text-xs sm:text-sm mb-2">{step.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">{step.reward}</span>
                      {isNext && (
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Motivation */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/10 rounded-xl sm:rounded-2xl border border-white/20">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h4 className="font-semibold text-white text-sm sm:text-base">🎉 Complete Setup Bonus!</h4>
              <p className="text-white/90 text-xs sm:text-sm">
                Finish all steps to unlock advanced features and get priority support!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingChecklist