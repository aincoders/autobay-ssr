import axios from '../utils/axios';

async function apiGetData(url, params, signal) {
    return axios.get(url, { params, signal });
}

async function apiPostData(url, data = {}) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return axios.post(url, formData);
}


async function apiDownloadData(url, params) {
    return await axios.get(url, { params, responseType: 'blob' });
}

export { apiGetData, apiPostData, apiDownloadData };
