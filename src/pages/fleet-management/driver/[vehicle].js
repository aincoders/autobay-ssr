import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import FleetDriver from 'src/sections/fleet-management/FleetDriver';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <FleetDriver />;
}
