/* eslint-disable import/no-unresolved */
import { useRouter } from 'next/router';
import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { OrderProvider } from 'src/mycontext/OrderContext';
import CustomerOrderDetail from 'src/sections/customer/CustomerOrderDetail';

OrderDetail.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);
export default function OrderDetail() {
    const { query } = useRouter();

    if (!query.orderID) {
        return null;
    }

    return (
        <OrderProvider orderID={query.orderID}>
            <CustomerOrderDetail />
        </OrderProvider>
    );
}
