'use client'

import { useCompareData } from '@/hooks/useCompareData'
import { CompareHeader } from '@/components/compare/CompareHeader'
import { LoadingState } from '@/components/compare/LoadingState'
import { ErrorState } from '@/components/compare/ErrorState'
import { ProductCompareCard } from '@/components/compare/ProductCompareCard'
import { SpecComparisonRow } from '@/components/compare/SpecComparisonRow'
import { ComparisonSummary } from '@/components/compare/ComparisonSummary'
import { CompareActions } from '@/components/compare/CompareActions'

export default function ComparePage() {
    const {
        selectedProduct,
        compareProducts,
        loading,
        error,
        getCurrentPrice,
        getAllSpecKeys
    } = useCompareData()

    const displayMap: { [key: string]: string } = {
        screenSize: 'Kích thước màn hình',
        displayTech: 'Công nghệ màn hình',
        resolution: 'Độ phân giải',
        displayFeatures: 'Tính năng màn hình',
        rearCamera: 'Camera sau',
        frontCamera: 'Camera trước',
        chipset: 'Chipset',
        cpuType: 'Loại CPU',
        ram: 'RAM',
        storage: 'Bộ nhớ trong',
        battery: 'Pin',
        os: 'Hệ điều hành',
        th_sim: 'SIM',
        nfcTech: 'Công nghệ NFC',
        cm_bin: 'Cảm Biến',
        cpu: 'CPU',
        camera: 'Camera',
        memory: 'Bộ nhớ',
        screen: 'Màn hình',
        weight: 'Trọng lượng',
        sim: 'SIM',
        hệ_điều_hành: 'Hệ điều hành',
        pin: 'Pin',
        nfc: 'NFC',
        kích_thước_màn_hình: 'Kích thước màn hình',
        bộ_nhớ: 'Bộ nhớ',
        trọng_lượng: 'Trọng lượng'
    }

    if (loading) {
        return <LoadingState />
    }

    if (error || !selectedProduct) {
        return <ErrorState error={error} />
    }

    const allCompareProducts = [selectedProduct, ...compareProducts]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-20 py-8">
                <CompareHeader />

                {compareProducts.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">
                            Không tìm thấy sản phẩm cùng dòng để so sánh. Hiển thị thông tin sản phẩm đã chọn.
                        </p>
                    </div>
                )}

                {/* Compare Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Product Headers */}
                    <div className={`grid ${allCompareProducts.length === 1 ? 'grid-cols-2' : allCompareProducts.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} gap-0`}>
                        {/* Empty cell for spec names column */}
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Thông số</h3>
                                <p className="text-xs text-gray-600">Kỹ thuật</p>
                            </div>
                        </div>

                        {/* Product Cards */}
                        {allCompareProducts.map((product, index) => (
                            <ProductCompareCard
                                key={product.prodId}
                                product={product}
                                index={index}
                                getCurrentPrice={getCurrentPrice}
                            />
                        ))}
                    </div>

                    {/* Specs Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">So sánh thông số kỹ thuật</h2>
                        <p className="text-gray-600 mt-2 text-center">
                            Đối chiếu chi tiết các đặc điểm nổi bật của từng sản phẩm
                        </p>
                    </div>

                    {/* Dynamic Specs Comparison */}
                    <div className="divide-y divide-gray-200">
                        {getAllSpecKeys().length > 0 ? (
                            getAllSpecKeys().map((specKey) => (
                                <SpecComparisonRow
                                    key={specKey}
                                    specKey={specKey}
                                    products={allCompareProducts}
                                    displayMap={displayMap}
                                />
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-lg font-medium">Không có thông số kỹ thuật</p>
                                <p className="text-sm mt-2">Sản phẩm này chưa có thông tin thông số kỹ thuật chi tiết.</p>
                            </div>
                        )}
                    </div>

                    <ComparisonSummary />

                    <CompareActions products={allCompareProducts} />
                </div>
            </div>
        </div>
    )
}