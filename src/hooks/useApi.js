import { useContext } from 'react';
import { ApiContext } from '../mycontext/ApiContext';

const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) throw new Error('Api context must be use inside AuthProvider');

    return context;
};

export default useApi;
