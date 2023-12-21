import { setCookie } from 'cookies-next';
import axios from "src/utils/axios";
import { ABOUT_API, CITY_API, CUSTOMER_API, SCHEMA_API, SEO_PAGE_TYPE, SETTING_API } from "src/utils/constant";


export default async function basicInfoServerProps(context, city = '', vehicle = { make: '', model: '' }) {
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

    async function GetBasicInfo() {
        return await axios.get(SETTING_API,);
    }



    try {
        const [resBasicInfo] = await Promise.all([GetBasicInfo()]);
        return {
            basicInfo: resBasicInfo?.data?.result?.list,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        console.error(error);
        throw error
    }
}