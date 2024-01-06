import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import DocumentReminder from 'src/sections/fleet-management/DocumentReminder';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <DocumentReminder />;
}
