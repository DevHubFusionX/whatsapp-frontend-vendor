import { Upload, X } from 'lucide-react'
import Card from '../ui/Card'

const ImageUpload = ({ image, onImageChange, onRemoveImage }) => {
  return (
    <Card>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Product Image
      </label>
      {image ? (
        <div className="relative group">
          <img
            src={image}
            alt="Preview"
            className="w-full h-56 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-xl flex items-center justify-center">
            <button
              type="button"
              onClick={onRemoveImage}
              className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
          />
        </label>
      )}
    </Card>
  )
}

export default ImageUpload