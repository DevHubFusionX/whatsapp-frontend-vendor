import { Check } from 'lucide-react'

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile: Horizontal scroll */}
      <div className="flex items-center overflow-x-auto pb-2 sm:pb-0 sm:justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <div key={step.id} className="flex items-center flex-shrink-0 sm:flex-1">
              <div className="flex flex-col items-center min-w-0">
                <div className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white shadow-lg ring-2 sm:ring-4 ring-blue-100' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-1 sm:mt-2 text-center">
                  <p className={`text-xs font-medium whitespace-nowrap ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400 mt-1 max-w-16 sm:max-w-20 leading-tight hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-8 sm:flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps