import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { CUSTOMER_API } from '../utils/constant';

OrderProvider.propTypes = {
    children: PropTypes.node,
    orderID: PropTypes.string,
};

const OrderContext = createContext();

function OrderProvider({ children, orderID }) {
    const OrderID = atob(orderID);
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData, postApiData } = useApi();

    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState([]);

    async function GetOrderDetails() {
        try {
            setLoading(true);
            const params = { customer_order_id: OrderID };
            const response = await getApiData(CUSTOMER_API.getOrderDetails, params, signal);
            if (response) {
                setOrderDetails(response.data.result);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (OrderID) {
            GetOrderDetails();
        }
        return () => {
            controller.abort();
        };
    }, [OrderID]);

    function handlePageRefresh(value) {
        if (value) {
            GetOrderDetails();
        }
    }

    // update  status
    async function CancelOrder(value) {
        const data = { customer_order_id: OrderID, cancel_remark: value };
        await postApiData(CUSTOMER_API.orderCancel, data);
        handlePageRefresh(true);
    }

    return (
        <OrderContext.Provider
            value={{
                loading,
                handlePageRefresh,
                orderDetails,
                CancelOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export { OrderContext, OrderProvider };
