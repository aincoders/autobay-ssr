import CustomerLayout from 'src/layouts/custom/CustomeMainLayout';
import { PackageListProvider } from 'src/mycontext/PackageListContext';
import PackageListItems from 'src/sections/package_list';

PackageList.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default function PackageList({props}) {
    return (
        <PackageListProvider props={props}>
            <PackageListItems />
        </PackageListProvider>
    );
}
