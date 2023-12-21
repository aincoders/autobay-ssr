/* eslint-disable import/no-unresolved */
import { useRouter } from 'next/router';
import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { EstimateProvider } from 'src/mycontext/EstimateContext';
import EstimateDetails from 'src/sections/customer/estimateDetail';

EstimateDetail.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function EstimateDetail() {
    const { query } = useRouter();
    if (!query.estimateID) return null;
    return (
        <EstimateProvider estimateID={query.estimateID}>
            <EstimateDetails />
        </EstimateProvider>
    );
}
