import { useState, useRef, useEffect } from 'react'
import { HelpCircle, X } from 'lucide-react'

const HelpTooltip = ({ content, title, position = 'auto' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState('top')
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current
      const trigger = triggerRef.current
      const rect = trigger.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      const viewport = { width: window.innerWidth, height: window.innerHeight }
      
      let bestPosition = position === 'auto' ? 'top' : position
      
      if (position === 'auto') {
        // Check space above
        if (rect.top < tooltipRect.height + 10) bestPosition = 'bottom'
        // Check space below
        else if (rect.bottom + tooltipRect.height + 10 > viewport.height) bestPosition = 'top'
        // Check space right
        if (rect.right + tooltipRect.width + 10 > viewport.width) {
          bestPosition = rect.left > tooltipRect.width + 10 ? 'left' : bestPosition
        }
      }
      
      setActualPosition(bestPosition)
    }
  }, [isVisible, position])

  const getPositionClasses = () => {
    const base = 'absolute z-50'
    switch (actualPosition) {
      case 'top':
        return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
      case 'bottom':
        return `${base} top-full left-1/2 transform -translate-x-1/2 mt-2`
      case 'left':
        return `${base} right-full top-1/2 transform -translate-y-1/2 mr-2`
      case 'right':
        return `${base} left-full top-1/2 transform -translate-y-1/2 ml-2`
      default:
        return `${base} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
    }
  }

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="p-1 text-gray-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50 touch-manipulation"
        aria-label="Help information"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div className={getPositionClasses()}>
          <div 
            ref={tooltipRef}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-3 sm:p-4 text-sm w-72 sm:w-80 max-w-[90vw]"
          >
            {title && (
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm pr-2">{title}</h4>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="text-gray-600 leading-relaxed text-xs sm:text-sm">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HelpTooltip