import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { CartPageProvider } from 'src/mycontext/CartPageContext';
import CartPageItem from 'src/sections/cart';

CartPage.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function CartPage() {
    return (
        <CartPageProvider>
            <CartPageItem />
        </CartPageProvider>
    );
}
