'use client';
import { useParams } from 'next/navigation';
import OrderDetailPage from '@/pages/OrderManagement/components/OrderDetailPage';

export default function OrderDetailScreen() {
    const params = useParams();
    const orderId = params?.id as string;

    if (!orderId) {
        return null;
    }

    return <OrderDetailPage orderId={parseInt(orderId)} />;
}
