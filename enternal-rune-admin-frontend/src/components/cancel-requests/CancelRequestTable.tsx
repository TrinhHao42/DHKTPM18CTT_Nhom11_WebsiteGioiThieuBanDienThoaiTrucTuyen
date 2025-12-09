'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/badge/Badge';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getAllCancelRequests, getCancelRequestDetail, processCancelRequest, CancelRequestItem, CancelRequestDetail } from '@/services/requestService';

export default function CancelRequestTable() {
  const [requests, setRequests] = useState<CancelRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<CancelRequestDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllCancelRequests(currentPage, 10, statusFilter);
      setRequests(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching cancel requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await getCancelRequestDetail(id);
      setSelectedRequest(detail);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  const handleProcess = async (action: 'APPROVE' | 'REJECT', adminNote?: string) => {
    if (!selectedRequest) return;

    try {
      setProcessing(true);
      await processCancelRequest(selectedRequest.cancelRequestId, action, adminNote);
      alert(`Đã ${action === 'APPROVE' ? 'chấp nhận' : 'từ chối'} yêu cầu thành công!`);
      setShowModal(false);
      fetchRequests();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge color="warning">Chờ xử lý</Badge>;
      case 'APPROVED':
        return <Badge color="success">Đã chấp nhận</Badge>;
      case 'REJECTED':
        return <Badge color="error">Đã từ chối</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const filteredRequests = requests.filter((request) =>
    request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.orderId.toString().includes(searchTerm)
  );

  if (loading && requests.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative min-w-[250px] flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm đơn hàng, khách hàng..."
                className="focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <svg
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="focus:border-brand-500 focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="APPROVED">Đã chấp nhận</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow className="border-b border-gray-200 dark:border-gray-800">
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Đơn hàng</TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Khách hàng</TableCell>
                <TableCell isHeader className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Lý do</TableCell>
                <TableCell isHeader className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Trạng thái</TableCell>
                <TableCell isHeader className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Ngày tạo</TableCell>
                <TableCell isHeader className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Hành động</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredRequests.map((request) => (
                <TableRow key={request.cancelRequestId} className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="py-3 text-center text-sm font-medium text-brand-600 dark:text-brand-400">#ORD{request.orderId}</TableCell>
                  <TableCell className="py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{request.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{request.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <p className="line-clamp-2 text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
                  </TableCell>
                  <TableCell className="py-3 text-center">{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <button
                      onClick={() => handleViewDetail(request.cancelRequestId)}
                      className="inline-flex items-center rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="mt-4 text-gray-500 dark:text-gray-400">Không có yêu cầu nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === i
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <DetailModal
          request={selectedRequest}
          onClose={() => setShowModal(false)}
          onProcess={handleProcess}
          processing={processing}
        />
      )}
    </>
  );
}

// Modal Component
function DetailModal({
  request,
  onClose,
  onProcess,
  processing,
}: {
  request: CancelRequestDetail;
  onClose: () => void;
  onProcess: (action: 'APPROVE' | 'REJECT', note?: string) => void;
  processing: boolean;
}) {
  const [adminNote, setAdminNote] = useState('');

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-900">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết yêu cầu hủy đơn
            </h3>
            <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Thông tin khách hàng</h4>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm"><span className="font-medium">Tên:</span> {request.userName}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {request.userEmail}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Thông tin đơn hàng</h4>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800 space-y-2">
              <p className="text-sm"><span className="font-medium">Mã đơn:</span> #ORD{request.orderSummary.orderId}</p>
              <p className="text-sm"><span className="font-medium">Ngày đặt:</span> {new Date(request.orderSummary.orderDate).toLocaleDateString('vi-VN')}</p>
              <p className="text-sm"><span className="font-medium">Tổng tiền:</span> {request.orderSummary.totalAmount.toLocaleString('vi-VN')} VNĐ</p>
              <p className="text-sm">
                <span className="font-medium">Trạng thái thanh toán:</span>{' '}
                <Badge color={request.orderSummary.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                  {request.orderSummary.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Badge>
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Lý do hủy đơn</h4>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm">{request.reason}</p>
            </div>
          </div>

          {request.status === 'PENDING' && (
            <div>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Ghi chú của admin</h4>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Nhập ghi chú (tùy chọn)..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          )}

          {request.adminNote && (
            <div>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Ghi chú xử lý</h4>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm">{request.adminNote}</p>
              </div>
            </div>
          )}
        </div>

        {request.status === 'PENDING' && (
          <div className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            <button
              onClick={onClose}
              disabled={processing}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              Đóng
            </button>
            <button
              onClick={() => onProcess('REJECT', adminNote)}
              disabled={processing}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {processing ? 'Đang xử lý...' : 'Từ chối'}
            </button>
            <button
              onClick={() => onProcess('APPROVE', adminNote)}
              disabled={processing}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? 'Đang xử lý...' : 'Chấp nhận'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
