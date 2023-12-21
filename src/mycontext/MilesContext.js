import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';

MilesProvider.propTypes = {
    children: PropTypes.node,
};

const MilesContext = createContext();

function MilesProvider({ children,props }) {
    const { currentCity, currentVehicle } = useSettingsContext();
    const [loading, setLoading] = useState(false);

    const seoInfo = props?.seoInfo || '';
    const milesDetails = props?.milesDetails || '';
    const faqList = props?.faqList ||[];

    const router = useRouter()
    useEffect(() => {
        const handleStart = () => {
          setLoading(true)
        };
        const handleStop = () => {
          setLoading(false)
        };
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);
        return () => {
          router.events.off('routeChangeStart', handleStart);
          router.events.off('routeChangeComplete', handleStop);
          router.events.off('routeChangeError', handleStop);
        };
      }, [router]);



    function handlePageRefresh(value) {
        if (value) {
            GetMiles();
        }
    }

    const contextValue = useMemo(
        () => ({
            seoInfo,
            loading,
            handlePageRefresh,
            currentCity,
            milesDetails,
            faqList,
        }),
        [loading, seoInfo, handlePageRefresh, currentCity, milesDetails, faqList]
    );

    return <MilesContext.Provider value={contextValue}>{children}</MilesContext.Provider>;
}

export { MilesContext, MilesProvider };
