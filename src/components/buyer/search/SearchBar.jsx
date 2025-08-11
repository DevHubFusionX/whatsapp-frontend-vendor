import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = "Search products or vendors" }) => {
  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
        <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-base"
        />
      </div>
    </div>
  )
}

export default SearchBar