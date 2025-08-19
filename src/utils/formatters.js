// Price formatter with Naira symbol and thousands separator
export const formatPrice = (price) => {
  if (!price && price !== 0) return '₦0'
  return `₦${Number(price).toLocaleString()}`
}

// Phone number sanitizer to E.164 format
export const sanitizePhone = (phone) => {
  if (!phone) return { raw: '', sanitized: '' }
  
  const raw = phone.toString()
  let cleaned = raw.replace(/\D/g, '')
  
  // Handle Nigerian numbers
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.slice(1)
  } else if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned
  }
  
  return {
    raw,
    sanitized: '+' + cleaned
  }
}

// Generate WhatsApp message template
export const generateWhatsAppMessage = (product, vendorName) => {
  return `Hi ${vendorName}! I'm interested in "${product.name}" (${formatPrice(product.price)}).${product.description ? ` ${product.description}` : ''}`
}

// Validate file type and size
export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  const errors = []
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please upload a valid image file (JPEG, PNG, or WebP)')
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Generate store slug from business name
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}