import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ReturnRequestTable from '@/components/return-requests/ReturnRequestTable'
import React from 'react'

const ReturnRequestPage = () => {
    return (
        <div className='mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10'>
            {/* Breadcrumb */}
            <PageBreadcrumb pageTitle="Danh sách Yêu cầu trả hàng" />

            {/* Return Request Table */}
            <ReturnRequestTable />
        </div>
    )
}

export default ReturnRequestPage
