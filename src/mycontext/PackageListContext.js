import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';

PackageListProvider.propTypes = {
    children: PropTypes.node,
};
const PackageListContext = createContext();

function PackageListProvider({ children,props }) {
    const { currentVehicle, currentCity } = useSettingsContext();
    const { customer } = useAuthContext();
    const {  postApiData } = useApi();


    async function CustomerAddVehicle(model) {
        await postApiData(CUSTOMER_API.addVehicle, { vehicle_model_master_id: model.vehicle_model_master_id });
   }

   useEffect(()=>{
    if(customer && props?.model_info && props?.make_info){
        if(props?.model_info?.vehicle_model_master_id != props?.currentVehicle?.model?.vehicle_model_master_id){
            CustomerAddVehicle(props?.model_info)
        }
    }
},[customer,props])


    const router = useRouter()

    const [currentPackageCategory, setCurrentPackageCategory] = useState(props?.package_info?.package_category_slug || "");
    const [loading, setLoading] = useState(false);

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
      }, [currentCity]);

    
    const categoryList = props?.categoryList || [];
    const packageList =props?.packageList || [];
    const faqList =props?.faqList || [];
    const seoInfo =props?.seoInfo || '';
    const whyChoose =props?.whyChoose || '';
    const rfqTitle =props?.rfqTitle || '';
    const rfqIcon =props?.rfqIcon || '';
    const currentPackageCategoryInfo = props?.package_info || "";



    const contextValue = useMemo(
        () => ({
            seoInfo,
            categoryList,
            packageList,
            faqList,
            currentPackageCategory,
            setCurrentPackageCategory,
            currentPackageCategoryInfo,
            loading,
            setLoading,
            currentCity,
            currentVehicle,
            whyChoose,
            rfqTitle,
            rfqIcon
        }),
        [
            seoInfo,
            categoryList,
            packageList,
            faqList,
            currentPackageCategory,
            setCurrentPackageCategory,
            currentPackageCategoryInfo,
            loading,
            setLoading,
            currentCity,
            currentVehicle,
            whyChoose,
            rfqTitle,
            rfqIcon
        ]
    );

    return (
        <PackageListContext.Provider value={contextValue}>{children}</PackageListContext.Provider>
    );
}

export { PackageListContext, PackageListProvider };
