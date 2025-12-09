'use client';

import OAuthSuccessPage from "@/page-components/OAuth";
import { Suspense } from "react";

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSuccessPage />
    </Suspense>
  );
}
