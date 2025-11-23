import React from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

export const CommentExamples: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">
        Ví dụ về đánh giá hay
      </h4>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Good example */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaCheckCircle className="text-green-600" />
            <span className="font-semibold text-green-800">Đánh giá tốt</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded border">
              <p><strong>Tên:</strong> Nguyễn Văn A</p>
              <p><strong>Đánh giá:</strong> ⭐⭐⭐⭐⭐ (5 sao)</p>
              <p><strong>Nội dung:</strong> &ldquo;Sản phẩm chất lượng tốt, giao hàng nhanh. Đóng gói cẩn thận, sử dụng 1 tuần rồi rất hài lòng.&rdquo;</p>
              <p><strong>Ảnh:</strong> Có thể có hoặc không</p>
            </div>
          </div>
        </div>

        {/* Bad example */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaTimesCircle className="text-red-600" />
            <span className="font-semibold text-red-800">Tránh làm thế này</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded border">
              <p><strong>Tên:</strong> (để trống)</p>
              <p><strong>Đánh giá:</strong> (chưa chọn)</p>
              <p><strong>Nội dung:</strong> &ldquo;ok&rdquo; hoặc để trống</p>
              <p className="text-red-600"><strong>❌ Thiếu thông tin bắt buộc</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-semibold text-blue-900 mb-2">Gợi ý nội dung đánh giá:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Chất lượng sản phẩm như thế nào?</li>
          <li>• Có phù hợp với mô tả không?</li>
          <li>• Dịch vụ giao hàng và đóng gói?</li>
          <li>• Bạn có giới thiệu cho người khác không?</li>
        </ul>
      </div>
    </div>
  )
}