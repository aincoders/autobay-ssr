import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { CITY_API } from 'src/utils/constant';
import LoadingScreen from '../components/loading-screen';
import { useAuthContext } from './useAuthContext';

CityGuard.propTypes = {
    children: PropTypes.node,
};

export default function CityGuard({ children }) {
    const { isInitialized } = useAuthContext();
    const { onChangeCity, currentCity } = useSettingsContext();
    const { getApiData } = useApi();
    const [currentCustomerLocation, setCurrentCustomerLocation] = useLocalStorage(
        'currentCustomerLocation',
        ''
    );

    // useEffect(() => {
    //     async function fetchCountry() {
    //         try {
    //             const response = await getApiData(CITY_API.getNearCity);
    //             onChangeCity(response.data.result);
    //             setCurrentCustomerLocation(response.data.result);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     if (!currentCity.city_master_id) {
    //         fetchCountry();
    //     }
    // }, []);

    // if (!isInitialized || !currentCity) {
    //     return <LoadingScreen />;
    // }

    return <> 
    {(!isInitialized) && <Box sx={{ position: "fixed", height: "100vh", width: "100%", zIndex: 9999, bgcolor: "background.neutral" }}>{<LoadingScreen />}</Box>}
    {children} </>;
}
