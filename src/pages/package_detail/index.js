import CustomerLayout from 'src/layouts/custom/CustomeMainLayout';
import { PackageDetailProvider } from '../../mycontext/PackageDetailContext';
import PackageDetailItem from '../../sections/package_detail';

PackageDetail.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default function PackageDetail({props}) {
    return (
        <PackageDetailProvider props={props}>
            <PackageDetailItem />
        </PackageDetailProvider>
    );
}