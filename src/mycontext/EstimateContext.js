import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { CUSTOMER_API } from '../utils/constant';

EstimateProvider.propTypes = {
    children: PropTypes.node,
    estimateID: PropTypes.string,
};

const EstimateContext = createContext();

function EstimateProvider({ children, estimateID }) {
    const EstimateID = atob(estimateID);
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData, postApiData } = useApi();

    const [loading, setLoading] = useState(true);
    const [estimateDetails, setEstimateDetails] = useState([]);

    async function GetOrderDetails() {
        try {
            setLoading(true);
            const params = { estimate_id: EstimateID };
            const response = await getApiData(CUSTOMER_API.getEstimateDetails, params, signal);
            if (response) {
                setEstimateDetails(response.data.result);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (EstimateID) {
            GetOrderDetails();
        }
        return () => {
            controller.abort();
        };
    }, [EstimateID]);

    function handlePageRefresh(value) {
        if (value) {
            GetOrderDetails();
        }
    }

    async function EstimateApprove() {
        const data = { estimate_id: EstimateID };
        await postApiData(CUSTOMER_API.approvedEstimate, data);
        handlePageRefresh(true);
    }
    async function EstimateReject() {
        const data = { estimate_id: EstimateID };
        await postApiData(CUSTOMER_API.rejectEstimate, data);
        handlePageRefresh(true);
    }

    return (
        <EstimateContext.Provider
            value={{
                loading,
                handlePageRefresh,
                estimateDetails,
                EstimateApprove,
                EstimateReject,
            }}
        >
            {children}
        </EstimateContext.Provider>
    );
}

export { EstimateContext, EstimateProvider };
