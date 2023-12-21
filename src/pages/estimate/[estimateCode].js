/* eslint-disable import/no-unresolved */
import { useRouter } from 'next/router';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { EstimateShareProvider } from 'src/mycontext/EstimateShareContext';
import EstimateDetails from 'src/sections/estimate';

EstimateDetail.getLayout = (page) => (<CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>);

export default function EstimateDetail() {
    const { query } = useRouter();

    if (!query.estimateCode) return null;
    return (
        <EstimateShareProvider estimateCode={query.estimateCode}>
            <EstimateDetails />
        </EstimateShareProvider>
    );
}
