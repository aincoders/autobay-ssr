/* eslint-disable import/no-unresolved */
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from './useAuthContext';

CustomerGuard.propTypes = {
    children: PropTypes.node,
};

export default function CustomerGuard({ children }) {
    const { isInitialized, customer } = useAuthContext();
    const { currentCity, currentVehicle } = useSettingsContext();

    const { push, query } = useRouter();

    if (!isInitialized) {
        return <LoadingScreen />;
    }

    if (!customer) {
        if (currentCity) {
            push(`/${currentCity.slug}`);
        }else{
            push(`/`);
        }
        return null;
    }

    return <>{children}</>;
}
