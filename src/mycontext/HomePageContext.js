import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { CUSTOMER_API } from 'src/utils/constant';
import { useSettingsContext } from '../components/settings';
import useApi from '../hooks/useApi';

HomePageProvider.propTypes = {
    children: PropTypes.node,
};
const HomePageContext = createContext();

function HomePageProvider({ children,props}) {
    const { currentCity, currentVehicle, } = useSettingsContext();
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


   

    const [loading, setLoading] = useState(false);
    // const [homePageBannerList, setHomePageBannerList] = useState([]);
    // const [categoryList, setCategoryList] = useState([]);
    // const [promotionBannerList, setPromotionBannerList] = useState([]);
    // const [trendingServiceList, setTrendingServiceList] = useState([]);
    // const [customServiceList, setCustomServiceList] = useState([]);
    // const [seasonServiceList, setSeasonServiceList] = useState([]);
    // const [workshopList, setWorkshopList] = useState([]);
    // const [blogList, setBlogList] = useState([]);
    // const [benefitList, setBenefitList] = useState([]);
    // const [searchVehicle, setSearchVehicle] = useState([]);
    // const [whyChooseList, setWhyChooseList] = useState([]);

    const sectionList = props?.sectionList || [];
    const faqList = props?.faqList || [];
    const howItWorkList = props?.howItWorkList || [];
    const reviewList = props?.reviewList || [];
    const seoInfo = props?.seoInfo || ''

    const homePageBannerList =  props?.homePageList.find((item) => item.homepage_section_type == 'HOME')
    const categoryList =  props?.homePageList.find((item) => item.homepage_section_type == 'CATEGORY')
    const promotionBannerList =  props?.homePageList.find((item) => item.homepage_section_type == 'ADDON')
    const trendingServiceList =  props?.homePageList.find((item) => item.homepage_section_type == 'POPULAR')
    const customServiceList =  props?.homePageList.find((item) => item.homepage_section_type == 'CUSTOM')
    const seasonServiceList =  props?.homePageList.find((item) => item.homepage_section_type == 'SEASONAL')
    const workshopList =  props?.homePageList.find((item) => item.homepage_section_type == 'WORKSHOP')
    const blogList =  props?.homePageList.find((item) => item.homepage_section_type == 'BLOGS')
    const searchVehicle =  props?.homePageList.find((item) => item.homepage_section_type == 'SEARCH_VEHICLE')
    const benefitList =  props?.homePageList.find((item) => item.homepage_section_type == 'BENEFIT')
    const whyChooseList =  props?.homePageList.find((item) => item.homepage_section_type == 'WHY_CHOOSE_US')



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


    const memoizedValue = useMemo(
        () => ({
            seoInfo,
            sectionList,
            faqList,
            homePageBannerList,
            categoryList,
            promotionBannerList,
            trendingServiceList,
            customServiceList,
            seasonServiceList,
            workshopList,
            blogList,
            loading,
            // handlePageRefresh,
            currentCity,
            currentVehicle,
            searchVehicle,
            howItWorkList,
            benefitList,
            whyChooseList,
            reviewList,
        }),
        [
            seoInfo,
            sectionList,
            faqList,
            homePageBannerList,
            categoryList,
            promotionBannerList,
            trendingServiceList,
            customServiceList,
            seasonServiceList,
            workshopList,
            blogList,
            loading,
            // handlePageRefresh,
            currentCity,
            currentVehicle,
            searchVehicle,
            howItWorkList,
            benefitList,
            whyChooseList,
            reviewList,
        ]
    );

    return <HomePageContext.Provider value={memoizedValue}>{children}</HomePageContext.Provider>;
}
export { HomePageContext, HomePageProvider };
