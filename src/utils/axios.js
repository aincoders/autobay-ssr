import axios from 'axios';
import { COMPANY_ID, WORKSHOP_TYPE_ID } from '../config-global';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    timeoutErrorMessage: 'TIMEOUT',
    headers: {
        token: 'b2905de7-0df5-44ee-f760-5a78be12e9d3',
        key: 'ccdb973a-7b1e-4f52-e3b7-4e9e59dfac67',
        applicationId: '1',
        companyId: COMPANY_ID,
        deviceType: 'Web',
        workshopTypeId: WORKSHOP_TYPE_ID
    },
});
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || error)
);
export default axiosInstance;
