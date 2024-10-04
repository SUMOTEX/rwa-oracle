// pages/detail/page.tsx

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const FundDetails = dynamic(() => import('@/components/detail'), {
    ssr: false, // This disables server-side rendering for the component
});

export default function DetailPage() {
    return (
        <section className="flex flex-col items-start justify-center gap-4 py-4 md:py-4">
            <Suspense fallback={<div>Loading...</div>}>
                <FundDetails />
            </Suspense>
        </section>
    );
}
