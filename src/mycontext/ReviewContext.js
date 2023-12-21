import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { setCountryTypeHeader } from 'src/utils/utils';
import useApi from '../hooks/useApi';
import { CUSTOMER_API } from '../utils/constant';

ReviewProvider.propTypes = {
    children: PropTypes.node,
    orderID: PropTypes.string,
};

const ReviewContext = createContext();

function ReviewProvider({ children, customerOrderID }) {
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData, postApiData } = useApi();
    const router = useRouter();
    const { currentCity,  } = useSettingsContext();


    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState('');
    const [serviceGroupList, setServiceGroupList] = useState([]);

    async function GetOrderDetails() {
        try {
            setLoading(true);
            const params = { customer_order_id: customerOrderID };
            const response = await getApiData(CUSTOMER_API.orderReview, params, signal);
            if (response) {
                setServiceGroupList(response.data.result.service_group_list);
                setOrderDetails(response.data.result);
            }
            setLoading(false)

        } catch (error) {
            router.push('/')
        }
    }

    useEffect(() => {
        if (customerOrderID) {
            setCountryTypeHeader(currentCity)
            GetOrderDetails();
        }
        return () => {
            controller.abort();
        };
    }, [customerOrderID]);

    function handlePageRefresh(value) {
        if (value) {
            GetOrderDetails();
        }
    }

    // update  status
    async function saveCustomerFeedback(value) {
        const data = { customer_order_id: orderDetails.customer_order_id, feedback_list: value };
        await postApiData(CUSTOMER_API.saveFeedback, data);
        handlePageRefresh(true);
    }

    async function saveCustomerFeedbackEstimateOrder(value) {
        const data = { customer_order_id: orderDetails.customer_order_id, ...value };
        await postApiData(CUSTOMER_API.saveFeedbackEstimate, data);
        handlePageRefresh(true);
    }

    return (
        <ReviewContext.Provider
            value={{
                loading,
                handlePageRefresh,
                orderDetails,
                saveCustomerFeedback,
                saveCustomerFeedbackEstimateOrder,
                serviceGroupList
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export { ReviewContext, ReviewProvider };
