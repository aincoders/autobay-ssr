/* eslint-disable import/no-unresolved */
import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import CustomerEstimate from 'src/sections/customer/CustomerEstimate';

Estimate.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);
export default function Estimate() {
    return <CustomerEstimate />;
}
