import { setCookie } from 'cookies-next';
import axios from "src/utils/axios";
import { CITY_API, CUSTOMER_API, FAQ_API, PREMIUM_PACKAGE, SCHEMA_API, SEO_PAGE_TYPE } from "src/utils/constant";


export default async function milesServerProps(context, city = '', vehicle = { make: '', model: '' }) {
    const { req, res } = context;

    let currentCity = req.cookies?.currentCity_v1 ? JSON.parse(req.cookies?.currentCity_v1) : city;
    const currentVehicle = req.cookies?.currentVehicle ? JSON.parse(req.cookies?.currentVehicle) : vehicle;


    if (!currentCity) {
        try {
            const response = await axios.get(CITY_API.getNearCity);
            currentCity = response?.data?.result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    setCookie('currentCity_v1', currentCity, { req, res, maxAge: 31536000 });
    setCookie('currentVehicle', currentVehicle, { req, res, maxAge: 31536000 });

    axios.defaults.headers.countryMasterId = currentCity?.country_master_id;
    axios.defaults.headers.regionMasterId = currentCity?.region_master_id;
    axios.defaults.headers.cityMasterId = currentCity?.city_master_id;

    async function GetSeoInformation() {
        const params = { page_type: SEO_PAGE_TYPE.membership };
        return await axios.get(CUSTOMER_API.getSeo, { params });
    }

    async function GetPageSchema() {
        const params = { city_slug: currentCity?.slug || '', model_slug: currentVehicle?.model?.vehicle_model_slug || "", domain_url: "https://www.autobay.me" };
        return await axios.get(SCHEMA_API.otherPage, { params });
    }

    async function GetFaqList() {
        const params = { faq_for: 'PREMIUM' };
        return await axios.get(FAQ_API, { params });
    }
    
    async function GetMiles() {
        const params = { vehicle_model_master_id: currentVehicle?.model?.vehicle_model_master_id || '' };
        return await axios.get(PREMIUM_PACKAGE, { params });
    }

    try {
        const [resSeoInfo, resSchema, resFaqList,resMilesDetail] = await Promise.all([GetSeoInformation(), GetPageSchema(),GetFaqList(),GetMiles()]);
        return {
            seoInfo: resSeoInfo?.data?.result,
            schemaInfo: resSchema?.data?.result,
            faqList: resFaqList?.data?.result?.list,
            milesDetails: resMilesDetail?.data?.result,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        console.error(error);
        throw error
    }
}