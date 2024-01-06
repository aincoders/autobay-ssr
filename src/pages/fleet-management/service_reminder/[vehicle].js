import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import ServiceReminder from 'src/sections/fleet-management/ServiceReminder';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <ServiceReminder />;
}
