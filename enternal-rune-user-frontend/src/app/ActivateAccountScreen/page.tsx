'use client'
import ActivateAccountPage from '@/page-components/ActivateAccount';
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const ActivateAccountScreen = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ActivateAccountPage />
        </Suspense>
    )
}

export default ActivateAccountScreen;
