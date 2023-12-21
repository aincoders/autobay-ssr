import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { createContext } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { APP_NAME } from 'src/config-global';
import { INTERNET_NETWORK_ERROR, TIMEOUT } from 'src/utils/constant';
import { setSession } from 'src/utils/utils';
import { apiDownloadData, apiGetData, apiPostData } from '../api';

const ApiContext = createContext();

ApiProvider.propTypes = {
    children: PropTypes.node,
};

function ApiProvider({ children }) {
    const { enqueueSnackbar } = useSnackbar();
    const { logout, customer } = useAuthContext();

    async function postApiData(url, data = {}) {
        try {
            const response = await apiPostData(url, data);
            response.data.msg && response.data.msg != 'success' && enqueueSnackbar(response.data.msg, { variant: 'success' });
            return response;
        } catch (error) {
            checkError(error);
        }
    }

    async function getApiData(url, params = {}, signal) {
        try {
            const response = await apiGetData(url, params, signal);
            return response;
        } catch (error) {
            checkError(error);
            throw error
        }
    }

    async function downloadApiData(url,data = {}) {
        try {
            const response = await apiDownloadData(url,data);
            response.data.msg && enqueueSnackbar(response.data.msg, { variant: 'success' })
            return response
        } catch (error) {
            checkError(error)
        }
    }

    function checkError(error) {
        if (error.message == TIMEOUT) {
            enqueueSnackbar(t('error_slow_internet_connection'), { variant: 'error' });
        } else if (error.message == INTERNET_NETWORK_ERROR) {
            enqueueSnackbar(t('error_internet_connection').replace('%1$s', APP_NAME), { variant: 'error' });
        } else if (error.status == 401) {
            setSession('');
            enqueueSnackbar(error.msg, { variant: 'error' });
        } else {
            error.status == 530
                ? (enqueueSnackbar(error.msg, { variant: 'error' }), logout())
                : error.msg && enqueueSnackbar(error.msg, { variant: 'error' });
        }
    }

    return (
        <ApiContext.Provider
            value={{
                postApiData,
                getApiData,
                downloadApiData
            }}
        >
            {children}
        </ApiContext.Provider>
    );
}

export { ApiContext, ApiProvider };
