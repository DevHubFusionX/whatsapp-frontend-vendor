import { themeColors, gradients } from './colors'

// Marketing-focused theme configuration
export const theme = {
  colors: themeColors,
  gradients,
  
  // Marketing psychology-based color usage
  marketing: {
    // Call-to-action colors (high conversion)
    cta: {
      primary: themeColors.primary[500], // Success green
      secondary: themeColors.accent[500], // Energy purple
      urgent: '#ef4444' // Red for urgency
    },
    
    // Trust building colors
    trust: {
      primary: themeColors.secondary[500], // Professional blue
      secondary: themeColors.neutral[600], // Stable gray
      success: themeColors.primary[500] // Achievement green
    },
    
    // Emotional engagement colors
    emotion: {
      excitement: themeColors.accent[500], // Purple
      happiness: '#f59e0b', // Orange
      calm: themeColors.secondary[400], // Light blue
      energy: '#ef4444' // Red
    }
  },
  
  // Component-specific color schemes
  components: {
    button: {
      primary: gradients.success,
      secondary: gradients.trust,
      accent: gradients.energy,
      whatsapp: gradients.whatsapp
    },
    
    card: {
      background: '#ffffff',
      border: themeColors.neutral[200],
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    },
    
    status: {
      success: themeColors.primary[500],
      warning: '#f59e0b',
      error: '#ef4444',
      info: themeColors.secondary[500]
    }
  }
}

// Utility functions for theme usage
export const getColor = (colorPath) => {
  const keys = colorPath.split('.')
  let color = themeColors
  
  for (const key of keys) {
    color = color[key]
    if (!color) return null
  }
  
  return color
}

export const getGradient = (gradientName) => {
  return gradients[gradientName] || gradients.success
}

export default theme