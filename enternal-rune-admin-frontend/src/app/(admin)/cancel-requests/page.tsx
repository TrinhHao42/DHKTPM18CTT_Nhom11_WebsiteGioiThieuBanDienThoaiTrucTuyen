import CancelRequestTable from '@/components/cancel-requests/CancelRequestTable'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'

const CancelRequestPage = () => {
    return (
        <div className='mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10'>
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Danh sách yêu cầu hủy đơn hàng" />

            {/* Cancel Request Table */}
            <CancelRequestTable />
        </div>
    )
}

export default CancelRequestPage
