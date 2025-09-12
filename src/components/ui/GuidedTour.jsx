import { useState, useEffect } from 'react'
import { X, ArrowRight, ArrowLeft, Target } from 'lucide-react'

const GuidedTour = ({ steps, isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      setCurrentStep(0)
    }
  }, [isActive])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    setIsVisible(false)
    onSkip?.()
  }

  if (!isVisible || !steps.length) return null

  const step = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" />
      
      {/* Tour Card */}
      <div className="fixed z-50 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-w-sm sm:max-w-md w-full mx-2 sm:mx-4"
           style={{
             top: step.position?.top || '50%',
             left: step.position?.left || '50%',
             transform: step.position?.transform || 'translate(-50%, -50%)'
           }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">{step.title}</h3>
              <p className="text-xs text-gray-500">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            {step.content && (
              <div className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {typeof step.content === 'string' ? (
                  <p>{step.content}</p>
                ) : (
                  step.content
                )}
              </div>
            )}
            
            {step.image && (
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-24 sm:h-32 object-cover rounded-lg sm:rounded-xl"
                />
              </div>
            )}

            {step.tips && (
              <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">💡 Pro Tip</h4>
                <p className="text-blue-700 text-xs sm:text-sm">{step.tips}</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-2 sm:space-y-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GuidedTour