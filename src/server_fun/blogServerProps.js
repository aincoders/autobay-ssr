import { setCookie } from 'cookies-next';
import axios from "src/utils/axios";
import { ABOUT_API, BLOG_API, CITY_API, CUSTOMER_API, SCHEMA_API, SEO_PAGE_TYPE } from "src/utils/constant";


export default async function blogServerProps(context, city = '', vehicle = { make: '', model: '' }) {
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
        const params = { page_type: SEO_PAGE_TYPE.blog };
        return await axios.get(CUSTOMER_API.getSeo, { params });
    }

    async function GetPageSchema() {
        const params = { city_slug: currentCity?.slug || '',  domain_url: "https://www.autobay.me" };
        return await axios.get(SCHEMA_API.otherPage, { params });
    }
    
    async function GetBlogList() {
        return await axios.get(BLOG_API.list,'');
    }

    try {
        const [resSeoInfo, resSchema, resBlogList] = await Promise.all([GetSeoInformation(), GetPageSchema(),GetBlogList()]);
        return {
            seoInfo: resSeoInfo?.data?.result,
            schemaInfo: resSchema?.data?.result,
            blogList:resBlogList.data.result,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        console.error(error);
        throw error
    }
}