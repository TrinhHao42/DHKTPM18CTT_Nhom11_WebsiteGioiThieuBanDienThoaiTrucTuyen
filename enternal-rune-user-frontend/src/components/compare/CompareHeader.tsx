'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const CompareHeader = () => {
    return (
        <div className="flex justify-between items-start">
            <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại trang chủ
            </Link>
        </div>
    )
}