/* eslint-disable import/no-unresolved */
import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import CustomerOrder from 'src/sections/customer/CustomerOrder';

Orders.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);
export default function Orders() {
    return <CustomerOrder />;
}
