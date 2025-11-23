import React from 'react'
import { FaImage, FaTimes } from 'react-icons/fa'
import Image from 'next/image'

interface UploadImageProps {
  images: Array<{ previewUrl: string }>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}

const UploadImage: React.FC<UploadImageProps> = ({
  images,
  fileInputRef,
  handleImageUpload,
  removeImage
}) => {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
                Thêm hình ảnh thực tế
                <span className="text-sm font-normal text-gray-500 ml-2">(Tùy chọn)</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
                Bạn có thể tải lên tối đa 6 ảnh để chia sẻ trải nghiệm trực quan.
                <span className="font-medium text-blue-600"> Không bắt buộc phải có ảnh</span> để gửi đánh giá.
            </p>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 6}
                className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-blue-600 font-medium w-full justify-center"
            >
                <FaImage className="text-xl" />
                <span>
                    {images.length === 0 ? 'Chọn ảnh từ thiết bị' : `Đã chọn ${images.length}/6 ảnh`}
                </span>
            </button>

            {/* Image Preview */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <Image
                                src={image.previewUrl}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UploadImage