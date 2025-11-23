import React from 'react'
import { FaInfoCircle, FaStar, FaUser, FaComment, FaImage } from 'react-icons/fa'

export const CommentFormInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-blue-900 mb-3">
            Hướng dẫn đánh giá sản phẩm
          </h4>
          
          <div className="space-y-3">
            {/* Required fields */}
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                  BẮT BUỘC
                </span>
                Thông tin cần thiết
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaStar className="text-yellow-500" />
                  <span>Đánh giá sao (1-5)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="text-blue-500" />
                  <span>Tên hiển thị</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaComment className="text-green-500" />
                  <span>Nội dung đánh giá</span>
                </div>
              </div>
            </div>

            {/* Optional field */}
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                  TÙY CHỌN
                </span>
                Thông tin bổ sung
              </h5>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaImage className="text-purple-500" />
                <span>Hình ảnh sản phẩm (tối đa 6 ảnh, mỗi ảnh &lt; 5MB)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">💡 Lưu ý:</span> Bạn có thể gửi đánh giá chỉ với text không cần ảnh, 
              hoặc kết hợp với ảnh để chia sẻ trải nghiệm trực quan hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}