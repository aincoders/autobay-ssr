import { setCookie } from 'cookies-next';
import axios from "src/utils/axios";
import { CUSTOMER_API, CUSTOMER_REVIEW_API, FAQ_API, HOME_PAGE_API, HOW_IT_WORK, SCHEMA_API, SEO_PAGE_TYPE } from "src/utils/constant";


export default async function homepageGetServerProps(context, city = '', vehicle = { make: '', model: '' }) {
    const { req, res } = context;

    // const currentCity = req.cookies?.currentCity_v1 ? JSON.parse(req.cookies?.currentCity_v1) : ;
    // const currentVehicle = req.cookies?.currentVehicle ? JSON.parse(req.cookies?.currentVehicle) : vehicle;

    const currentCity = city;
    const currentVehicle = vehicle;

    setCookie('currentCity_v1', currentCity, { req, res, maxAge: 31536000 });
    setCookie('currentVehicle', currentVehicle, { req, res, maxAge: 31536000 });

    axios.defaults.headers.countryMasterId = currentCity?.country_master_id;
    axios.defaults.headers.regionMasterId = currentCity?.region_master_id;
    axios.defaults.headers.cityMasterId = currentCity?.city_master_id;

    async function GetHomePageList() {
        const params = { city_master_id: currentCity?.city_master_id };
        return await axios.get(HOME_PAGE_API.list, { params });
    }

    async function GetSectionList() {
        const params = { city_master_id: currentCity?.city_master_id };
        return await axios.get(HOME_PAGE_API.getSectionList, { params });
    }

    async function GetFaqList() {
        return await axios.get(FAQ_API, '');
    }

    async function GetCustomerReviewList() {
        return await axios.get(CUSTOMER_REVIEW_API.list, '');
    }

    async function GetHowItWork() {
        return await axios.get(HOW_IT_WORK, '');
    }
    async function GetSeoInformation() {
        const params = { page_type: SEO_PAGE_TYPE.homePage };
        return await axios.get(CUSTOMER_API.getSeo, { params });
    }


    async function GetPageSchema() {
        const params = { city_slug: currentCity?.slug, model_slug: currentVehicle?.model?.vehicle_model_slug, domain_url: "https://www.autobay.me" };
        return await axios.get(SCHEMA_API.homePage, { params });
    }


    try {
        const [resSectionList, resHomePageList, resFaqList, resCustomerReviewList, resHowItWork, resSeoInfo, resSchema] = await Promise.all([GetSectionList(), GetHomePageList(), GetFaqList(), GetCustomerReviewList(), GetHowItWork(), GetSeoInformation(), GetPageSchema()]);

        return {
            homePageList: resHomePageList?.data?.result?.list,
            sectionList: resSectionList?.data?.result?.list,
            faqList: resFaqList?.data?.result?.list,
            reviewList: resCustomerReviewList?.data?.result,
            howItWorkList: resHowItWork?.data?.result?.list,
            seoInfo: resSeoInfo.data.result,
            schemaInfo: resSchema?.data?.result,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        console.error(error);
        throw error
    }

}