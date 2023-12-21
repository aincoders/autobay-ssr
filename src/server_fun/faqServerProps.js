import { setCookie } from 'cookies-next';
import axios from "src/utils/axios";
import { CITY_API, FAQ_API, SCHEMA_API } from "src/utils/constant";


export default async function faqServerProps(context, city = '', vehicle = { make: '', model: '' }) {
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

    async function GetFaqList() {
        return await axios.get(FAQ_API, '');
    }

    async function GetPageSchema() {
        const params = { city_slug: currentCity?.slug || '', model_slug: currentVehicle?.model?.vehicle_model_slug || "", domain_url: "https://www.autobay.me" };
        return await axios.get(SCHEMA_API.faq, { params });
    }

    try {
        const [resFaqList, resSchema] = await Promise.all([GetFaqList(), GetPageSchema()]);
        return {
            faqList: resFaqList?.data?.result?.list,
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