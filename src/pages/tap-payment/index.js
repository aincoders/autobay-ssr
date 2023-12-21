import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useApi from 'src/hooks/useApi';
import CheckoutOrderComplete from 'src/master/CheckoutOrderComplete';
import { resetCart } from 'src/redux/slices/product';
import { dispatch } from 'src/redux/store';
import { CUSTOMER_API } from 'src/utils/constant';

export default function TapPayment() {
    const { postApiData, getApiData } = useApi();
    const { enqueueSnackbar } = useSnackbar()

    const router = useRouter()
    useEffect(() => {
        if(router.isReady){
            GetTapPaymentRetrieveData(router.query.tap_id)
        }
    }, [router.isReady])

    // get retrieve data from tap payment
    async function GetTapPaymentRetrieveData(chargeID) {
        if (chargeID) {
            try {
                const params = { charge_id: chargeID }
                const response = await getApiData(CUSTOMER_API.retrieveTabPayment, params);
                if (response.status == 200) {
                    const data =response.data.result;
                    if (data.status == 'CAPTURED' && data.id) {
                        CustomerOrderPlace(response.data.result)
                    }else{
                        router.push(`/cart`);
                        enqueueSnackbar(data.response.message || data.response.description, { variant: 'error', autoHideDuration: 5000 })
                    }
                }
            } catch (error) {
                console.log(error);
                router.push(`/cart`);
            }
        }
    }

    // order place 
    async function CustomerOrderPlace(value) {
        if (value) {
            try {
                const data = {...value.metadata,total_paid_amount: value.amount,payment_id: value.id,payment_gateway: 'Tap'};
                const response = await postApiData(CUSTOMER_API.orderPlaced, data);
                if (response.status == 200) {
                    setOrderSuccessModal({ status: true, data: response.data.result });
                }
            } catch (error) {
                router.push(`/cart`)
            }
        }
    }

    const [orderSuccessModal, setOrderSuccessModal] = useState({ status: false, data: '' });
    function orderSuccessModalClose() {
        dispatch(resetCart());
        router.push(`customer/orders`);
    }

    return (
        <>
            <CheckoutOrderComplete open={orderSuccessModal.status} referenceData={orderSuccessModal.data} onClose={orderSuccessModalClose} />
        </>
    );
}
