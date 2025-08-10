const Card = ({ children, className = '', padding = 'p-4', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card