import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';

OurServiceProvider.propTypes = {
    children: PropTypes.node,
};
const OurServiceContext = createContext();

function OurServiceProvider({ children,props }) {
    const router = useRouter()

    const [loading, setLoading] = useState(false);

    const categoryList = props?.categoryList || [];
    const serviceBrandList = props?.serviceBrandList.filter((item) => item.vehicle_make_photo != '').sort((a, b) => a.vehicle_make_name.localeCompare(b.vehicle_make_name)) || [];
    const seoInfo =props?.seoInfo || '';

  
    
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

    const memoizedValue = useMemo(
        () => ({
            seoInfo,
            loading,
            categoryList,
            serviceBrandList,
        }),
        [loading, seoInfo, categoryList, serviceBrandList]
    );

    return (
        <OurServiceContext.Provider value={memoizedValue}>{children}</OurServiceContext.Provider>
    );
}
export { OurServiceContext, OurServiceProvider };
