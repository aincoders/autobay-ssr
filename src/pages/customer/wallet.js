import CustomerGuard from 'src/auth/CustomerGuard';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import CustomerWallet from 'src/sections/customer/CustomerWallet';

Wallet.getLayout = (page) => (<CustomerGuard><CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug></CustomerGuard>);

export default function Wallet() {
    return (
        <>
            <CustomerWallet />
        </>
    );
}
