/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import useApi from 'src/hooks/useApi';
import { CUSTOMER_API } from 'src/utils/constant';

PackageDetailProvider.propTypes = {
    children: PropTypes.node,
};

const PackageDetailContext = createContext();

function PackageDetailProvider({ children,props }) {
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




    const [loading, setLoading] = useState(false);


    const packageDetails = props?.packageDetails || '';
    const packageMediaList = props?.packageMediaList || [];
    const packagetimeLineList = props?.packagetimeLineList || [];
    const packageBenefitList = props?.packageBenefitList || [];
    const packageFyiList = props?.packageFyiList || [];
    const packageTagList = props?.packageTagList || [];
    const packageSpecificationList = props?.packageSpecificationList || [];
    const packageExpertRatingList = props?.packageExpertRatingList || [];
    const packageServiceList = props?.packageServiceList || [];
    const packageInspectionList = props?.packageInspectionList || [];
    const packagePartList = props?.packagePartList || [];
    const packagePartGroupList = props?.packagePartGroupList || [];
    const faqList = props?.faqList || [];
    const afterBookingStep = props?.afterBookingStep || [];
    const packageVideo = props?.packageVideo || [];
    const reviewList = props?.reviewList || [];
    const seoInfo = props?.seoInfo ||'';


    

    const contextValue = useMemo(
        () => ({
            seoInfo,
            packageDetails,
            packageMediaList,
            packagetimeLineList,
            packageBenefitList,
            packageFyiList,
            packageServiceList,
            packagePartList,
            packagePartGroupList,
            packageTagList,
            packageSpecificationList,
            packageExpertRatingList,
            packageInspectionList,
            afterBookingStep,
            packageVideo,
            faqList,
            loading,
            reviewList
        }),
        [seoInfo,
            packageMediaList,
            packagetimeLineList,
            packageBenefitList,
            packageFyiList,
            packageServiceList,
            packagePartList,
            packagePartGroupList,
            packageTagList,
            packageSpecificationList,
            packageExpertRatingList,
            packageInspectionList,
            afterBookingStep,
            packageVideo,
            faqList,
            reviewList,
            loading,

        ]
    );

    return (
        <PackageDetailContext.Provider value={contextValue}>
            {children}
        </PackageDetailContext.Provider>
    );
}

export { PackageDetailContext, PackageDetailProvider };
