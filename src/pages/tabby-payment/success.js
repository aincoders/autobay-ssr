import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import useApi from 'src/hooks/useApi';
import CheckoutOrderComplete from 'src/master/CheckoutOrderComplete';
import { resetCart } from 'src/redux/slices/product';
import { dispatch, useSelector } from 'src/redux/store';
import { PATH_CUSTOMER } from 'src/routes/paths';
import { CUSTOMER_API } from 'src/utils/constant';


export default function Success() {
    const { postApiData, getApiData } = useApi();
    const { enqueueSnackbar } = useSnackbar()

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const { checkout } = useSelector((state) => state.product);
    const { tabbyCheckoutID } = checkout;

    useEffect(() => {
        if (router.isReady && tabbyCheckoutID) {
            GetTabbyPaymentRetrieveData(tabbyCheckoutID)
        }
    }, [router.isReady])


    // get retrieve data from tap payment
    async function GetTabbyPaymentRetrieveData(tabbyCheckoutID) {
        setLoading(true)
        if (tabbyCheckoutID) {
            try {
                const params = { checkout_id: tabbyCheckoutID }
                const response = await getApiData(CUSTOMER_API.retrieveCheckoutSession, params);
                if (response && response.status == 200) {
                    const data = response.data.result;
                    if (data.status == 'approved' && data.id) {
                        await CustomerOrderPlace(data)
                    }else{
                        router.push(`/cart`);
                        enqueueSnackbar(data.error, { variant: 'error' })
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        setLoading(false)
    }

    // order place 
    async function CustomerOrderPlace(data) {
        if (data) {
            try {
                const capture_id = ''; //data.payment.captures ? data.payment.captures[0]['id'] : '';
                const formData = { ...data.payment.meta, total_paid_amount: data.payment.amount, payment_id: data.payment.id, payment_gateway: 'Tabby', tabby_captures_id: capture_id };
                const response = await postApiData(CUSTOMER_API.orderPlaced, formData);
                if (response.status == 200) {
                    const data = response.data.result
                    setOrderSuccessModal({ status: true, data: data });
                    CustomerOrderNotification(data.customer_order_id)
                }
            } catch (error) {
                console.log(error);
                router.push(`/cart`)
            }
        }
    }

    async function CustomerOrderNotification(customerOrderID) {
        if (customerOrderID) {
            try {
                const formData = { customer_order_id: customerOrderID }
                const response = await postApiData(CUSTOMER_API.orderPlacedMail, formData);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const [orderSuccessModal, setOrderSuccessModal] = useState({ status: false, data: '' });
    function orderSuccessModalClose() {
        dispatch(resetCart());
        router.push(PATH_CUSTOMER.ordersDetails(btoa(orderSuccessModal.data.customer_order_id)))
    }

    if (loading) return <LoadingScreen />

    return (
        <>
            <CheckoutOrderComplete open={orderSuccessModal.status} referenceData={orderSuccessModal.data} onClose={orderSuccessModalClose} />
        </>
    );
}
