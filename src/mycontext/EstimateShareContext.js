import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { CUSTOMER_API } from '../utils/constant';

EstimateShareProvider.propTypes = {
    children: PropTypes.node,
    estimateCode: PropTypes.string,
};

const EstimateShareContext = createContext();

function EstimateShareProvider({ children, estimateCode }) {
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData, postApiData } = useApi();

    const [loading, setLoading] = useState(true);
    const [estimateDetails, setEstimateDetails] = useState([]);

    async function GetOrderDetails() {
        try {
            setLoading(true);
            const params = { estimate_code: estimateCode };
            const response = await getApiData(CUSTOMER_API.shareEstimate, params, signal);
            if (response) {
                setEstimateDetails(response.data.result);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (estimateCode) {
            GetOrderDetails();
        }
        return () => {
            controller.abort();
        };
    }, [estimateCode]);

    function handlePageRefresh(value) {
        if (value) {
            GetOrderDetails();
        }
    }

    async function EstimateApprove() {
        const data = { estimate_id: estimateDetails.estimate_id };
        await postApiData(CUSTOMER_API.shareEstimateApproved, data);
        handlePageRefresh(true);
    }
    async function EstimateReject() {
        const data = { estimate_id: estimateDetails.estimate_id };
        await postApiData(CUSTOMER_API.shareEstimateReject, data);
        handlePageRefresh(true);
    }

    return (
        <EstimateShareContext.Provider
            value={{
                loading,
                handlePageRefresh,
                estimateDetails,
                EstimateApprove,
                EstimateReject,
            }}
        >
            {children}
        </EstimateShareContext.Provider>
    );
}

export { EstimateShareContext, EstimateShareProvider };
