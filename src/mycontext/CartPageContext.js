import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { applyAddress, getCartOnline } from 'src/redux/slices/product';
import { dispatch, useSelector } from 'src/redux/store';
import { CART_API } from 'src/utils/constant';

CartPageProvider.propTypes = {
    children: PropTypes.node,
};

const CartPageContext = createContext();
function CartPageProvider({ children }) {

    const { customer } = useAuthContext();
    const { currentVehicle,currentCity } = useSettingsContext();
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData } = useApi();

    const [loading, setLoading] = useState(true);
    const [cartDetails, setCartDetails] = useState('');

    const { checkout } = useSelector((state) => state.product);
    const { cart, totalItems, promocode, promoWalletType, billingAddress } = checkout;

    const [responseList, setResponseList] = useState([]);
    const [passCartData, setPassCartData] = useState([]);
    const [premiumCartData, setPremiumCartData] = useState('');

    useEffect(() => {
        setPassCartData(cart.filter((cart) => cart.service_group_id).map((cart) => ({ service_group_id: cart.service_group_id, spare_part_id: cart.spare_part_id, })));
        setPremiumCartData(cart.find((cart) => cart.premium_id));
    }, [totalItems]);

    const router = useRouter();


    async function GetList() {
        try {
            const params = {
                vehicle_model_master_id: currentVehicle.model.vehicle_model_master_id,
                cart_list: JSON.stringify(passCartData),
                premium_id: premiumCartData ? premiumCartData.premium_id : '',
                promo_code_id: promocode,
                promo_wallet_type: promoWalletType,
                city_master_id: billingAddress?.address_city_id || currentCity?.city_master_id || ''
            };
            const response = await getApiData(CART_API.list, params, signal);
            if (response) {
                const data = [...response.data.result.list, ...response.data.result.premium_list];
                setResponseList(data);
                setCartDetails(response.data.result);
                const cartList = data.map((item) =>
                    item.service_group_id
                        ? { service_group_id: item.service_group_id, name: item.service_group_name, price: item.service_group_total, spare_part_id: item.spare_part_id, }
                        : { premium_id: item.premium_id, name: item.premium_title, price: item.price_total_after_discount }
                );
                dispatch(getCartOnline(cartList));
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function GetCustomerDefaultAddress() {
        try{
            const response = await getApiData(CART_API.customerDefaultAddress, '');
            if(response.data.result.customer_address_id){
                dispatch(applyAddress(response.data.result));
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (customer && billingAddress == '') {
            GetCustomerDefaultAddress()
        }
    }, [customer]);


    useEffect(() => {
        if (currentVehicle.model) {
            GetList();
        } else {
            router.back();
        }
        return () => {
            controller.abort();
        };
    }, [passCartData, currentVehicle,currentCity, promocode,billingAddress, promoWalletType]);

    function handlePageRefresh(value) {
        if (value) {
            GetList();
        }
    }

    return (
        <CartPageContext.Provider
            value={{
                cartDetails,
                loading,
                handlePageRefresh,
                responseList,
            }}
        >
            {children}
        </CartPageContext.Provider>
    );
}

export { CartPageContext, CartPageProvider };
