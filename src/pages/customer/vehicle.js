import CustomLayoutWithoutSlug from '../../layouts/custom/CustomLayoutWithoutSlug';
import CustomerVehicle from '../../sections/customer/CustomerVehicle';
import CustomerGuard from '../../auth/CustomerGuard';

Vehicle.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Vehicle() {
    return <CustomerVehicle />;
}
