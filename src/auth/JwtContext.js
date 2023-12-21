import { getCookie } from 'cookies-next';
import encryptLocalStorage from 'localstorage-slim';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
import { apiPostData } from 'src/api';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { CUSTOMER_KEY, OTP_API } from 'src/utils/constant';
import { setCountryTypeHeader, setSession } from 'src/utils/utils';
import localStorageAvailable from '../utils/localStorageAvailable';

const initialState = { isAuthenticated: false, isInitialized: false, customer: null };

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, customer } = action.payload;
        return { ...state, isAuthenticated, isInitialized: true, customer };
    },
    LOGIN: (state, action) => {
        const { customer } = action.payload;
        return { ...state, isAuthenticated: true, customer };
    },
    LOGOUT: (state) => ({ ...state, isAuthenticated: false, customer: null }),
};

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const currentCity =  getCookie('currentCity_v1') ? JSON.parse(getCookie('currentCity_v1')) : "";
    const [phoneNumber, setPhoneNumber] = useLocalStorage('cup', '');
    const storageAvailable = localStorageAvailable();

    const initialize = useCallback(async () => {
        try {
            const customer = encryptLocalStorage.get(CUSTOMER_KEY, { decrypt: true, secret: 1272 });
            if (currentCity != '') {
                setSession(customer);
                setCountryTypeHeader(currentCity);
                dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: true, customer: customer ? customer : null } });
            } else {
                dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, customer: null }, });
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: 'INITIALIZE', payload: { isAuthenticated: false, customer: null } });
        }
    }, [storageAvailable]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    // LOGIN
    const login = useCallback(async (data) => {
        try {
            const response = await apiPostData(OTP_API.verifyOtp, data);
            setSession(response.data.result);
            dispatch({ type: 'LOGIN', payload: { customer: response.data.result } });
            encryptLocalStorage.set(CUSTOMER_KEY, response.data.result, { encrypt: true, secret: 1272, });
            return response;
        } catch (error) {
            throw error;
        }
    }, []);

    // LOGOUT
    const logout = useCallback(() => {
        setSession(null);
        setPhoneNumber('')
        dispatch({ type: 'LOGOUT' });
        encryptLocalStorage.remove(CUSTOMER_KEY)


    }, []);

    const memoizedValue = useMemo(() => {
        const { isInitialized, isAuthenticated, customer } = state;
        return {
            isInitialized,
            isAuthenticated,
            customer,
            login,
            logout,
            initialize,
        };
    }, [state.isAuthenticated, state.isInitialized, state.customer, login, logout, initialize]);
    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
