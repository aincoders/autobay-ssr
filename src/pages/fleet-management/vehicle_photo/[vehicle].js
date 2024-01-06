import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import FleetVehiclePhoto from 'src/sections/fleet-management/FleetVehiclePhoto';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <FleetVehiclePhoto />;
}
