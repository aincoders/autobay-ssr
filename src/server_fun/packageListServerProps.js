import { setCookie } from "cookies-next";
import axios from "src/utils/axios";
import { CUSTOMER_API, FAQ_API, PACKAGE_LIST_API, SCHEMA_API, SEO_PAGE_TYPE } from "src/utils/constant";

export default async function packageListServerProps(context, city, vehicle) {
    const { req, res, query } = context;

    // const currentCity = req.cookies?.currentCity_v1 ? JSON.parse(req.cookies?.currentCity_v1) : ;
    // const currentVehicle = req.cookies?.currentVehicle ? JSON.parse(req.cookies?.currentVehicle) : vehicle;

    const currentCity = city;
    const currentVehicle = vehicle;
    const currentPackageCategory = query?.category[0] || '';

    res.setHeader( 'Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')


    setCookie('currentCity_v1', currentCity, { req, res, maxAge: 31536000 });
    setCookie('currentVehicle', currentVehicle, { req, res, maxAge: 31536000 });


    axios.defaults.headers.countryMasterId = currentCity?.country_master_id;
    axios.defaults.headers.regionMasterId = currentCity?.region_master_id;
    axios.defaults.headers.cityMasterId = currentCity?.city_master_id;

    async function GetCategoryList() {
        return await axios.get(PACKAGE_LIST_API.packageCategory);
    }

    async function GetPackageList() {
        const params = {
            package_category_slug: currentPackageCategory,
            vehicle_model_master_id: currentVehicle?.model?.vehicle_model_master_id || '',
            city_master_id: currentCity?.city_master_id || '',
        };
        return await axios.get(PACKAGE_LIST_API.packageSection, { params });
    }

    async function GetFaqList() {
        const params = { package_category_slug: currentPackageCategory };
        return await axios.get(FAQ_API, { params });
    }

    async function GetWhyChooseUs() {
        const params = {
            package_category_slug: currentPackageCategory,
            vehicle_model_master_id: currentVehicle.model?.vehicle_model_master_id || '',
            vehicle_make_master_id: currentVehicle.make?.vehicle_make_master_id || '',
        };
        return await axios.get(CUSTOMER_API.categoryWhyChoose, { params });
    }

    async function GetSeoInformation() {
        const params = { page_type: SEO_PAGE_TYPE.packageList };
        return await axios.get(CUSTOMER_API.getSeo, { params });
    }

    async function GetPageSchema() {
        const params = {
            city_slug: currentCity?.slug || '',
            make_slug: currentVehicle?.make?.vehicle_make_slug || '',
            model_slug: currentVehicle?.model?.vehicle_model_slug || '',
            package_category_slug: currentPackageCategory,
            domain_url: "https://www.autobay.me"
        };
        return await axios.get(SCHEMA_API.packageList, { params });
    }


    try {
        const [resCategoryList, resPackageList, resFaqList, resSeoInfo, resWhyChoose, resSchema] = await Promise.all([GetCategoryList(), GetPackageList(), GetFaqList(), GetSeoInformation(), GetWhyChooseUs(), GetPageSchema()]);
        return {
            categoryList: resCategoryList?.data?.result?.list,
            rfqTitle: resCategoryList?.data?.result?.rfq_title || "",
            rfqIcon: resCategoryList?.data?.result?.rfq_icon || "",

            packageList: resPackageList?.data?.result,

            faqList: resFaqList?.data?.result?.list,
            seoInfo: resSeoInfo.data.result,
            whyChoose: resWhyChoose.data.result?.why_choose,
            schemaInfo: resSchema?.data?.result,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        throw error
    }

}