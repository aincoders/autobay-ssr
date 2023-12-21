import { setCookie } from "cookies-next";
import axios from "src/utils/axios";
import { CUSTOMER_API, CUSTOMER_REVIEW_API, FAQ_API, PACKAGE_DETAIL_API, SCHEMA_API, SEO_PAGE_TYPE } from "src/utils/constant";

export default async function packageDetailServerProps(context, city, vehicle) {
    const { req, res, query } = context;

    // const currentCity = req.cookies?.currentCity_v1 ? JSON.parse(req.cookies?.currentCity_v1) : ;
    // const currentVehicle = req.cookies?.currentVehicle ? JSON.parse(req.cookies?.currentVehicle) : vehicle;

    const currentCity = city;
    const currentVehicle = vehicle;
    const currentService = query?.category[0] || ''

    setCookie('currentCity_v1', currentCity, { req, res, maxAge: 31536000 });
    setCookie('currentVehicle', currentVehicle, { req, res, maxAge: 31536000 });

    axios.defaults.headers.countryMasterId = currentCity?.country_master_id;
    axios.defaults.headers.regionMasterId = currentCity?.region_master_id;
    axios.defaults.headers.cityMasterId = currentCity?.city_master_id;


    async function GetPackageDetails() {
        const params = {
            slug_url: currentService,
            vehicle_model_master_id: currentVehicle.model?.vehicle_model_master_id || '',
            vehicle_make_master_id: currentVehicle.make?.vehicle_make_master_id || '',
            city_master_id: currentCity?.city_master_id || '',
            spare_part_id: '',
        };
        return await axios.get(PACKAGE_DETAIL_API.details, { params });
    }

    async function GetPackageReview(serviceGroupID) {
        const params = { service_group_id: serviceGroupID };
        return await axios.get(CUSTOMER_REVIEW_API.list, { params });
    }

    async function GetFaqList() {
        const params = { package_category_slug: currentService };
        return await axios.get(FAQ_API, { params });
    }

    async function GetSeoInformation() {
        const params = { page_type: SEO_PAGE_TYPE.packageDetails };
        return await axios.get(CUSTOMER_API.getSeo, { params });
    }

    async function GetPageSchema() {
        const params = {
            city_slug: currentCity?.slug || '',
            make_slug: currentVehicle?.make?.vehicle_make_slug || '',
            model_slug: currentVehicle?.model?.vehicle_model_slug || '',
            service_group_slug: currentService,
            domain_url: "https://www.autobay.me"
        };
        return await axios.get(SCHEMA_API.packageDetail, { params });
    }
    try {
        const [resPackageDetail, resFaqList, resSeoInfo, resSchema] = await Promise.all([GetPackageDetails(), GetFaqList(), GetSeoInformation(), GetPageSchema()]);
        const data = resPackageDetail.data.result;

        const response = await GetPackageReview(data.service_group_id)

        return {
            packageDetails: data,
            packageMediaList: data.service_group_media,
            packagetimeLineList: data.service_group_timeline,
            packageBenefitList: data.service_group_benefit,
            packageFyiList: data.service_group_fyi,
            packageTagList: data.service_group_tag,
            packageExpertRatingList: data.service_group_expert_rating,
            packageSpecificationList: data.service_group_specification,
            packageInspectionList: data.inspection_list,
            packageServiceList: data.service_list,
            packagePartList: data.spare_parts_list,
            packagePartGroupList: data.spare_part_group_list,
            afterBookingStep: data.service_group_step_after_booking,
            packageVideo: data.video_list,

            reviewList: response.data.result,
            faqList: resFaqList?.data?.result?.list,
            seoInfo: resSeoInfo.data.result,
            schemaInfo: resSchema?.data?.result,
            currentCity,
            currentVehicle
        }
    }
    catch (error) {
        throw error
    }

}