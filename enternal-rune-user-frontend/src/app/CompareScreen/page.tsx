'use client'
import ComparePage from '@/page-components/Compare'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const CompareScreen = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComparePage />
    </Suspense>
  )
}

export default CompareScreen
