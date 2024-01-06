import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import FleetVehicle from 'src/sections/fleet-management/FleetVehicle';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <FleetVehicle />;
}
