import { setCookie } from 'cookies-next';
import { useState } from 'react';
import { PATH_PAGE } from 'src/routes/paths';
import { homepageGetServerProps, packageDetailServerProps, packageListServerProps } from 'src/server_fun';
import axios from 'src/utils/axios';
import { SLUG_CHECK } from 'src/utils/constant';
import CityPage from '.';
import CustomerLayout from '../../layouts/custom/CustomeMainLayout';
import PackageDetail from '../package_detail';
import PackageList from '../package_list';

Category.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;

export default function Category({ slugData, referenceData = '' }) {
    const { city_info, make_info, model_info, service_group_info, package_info } = slugData;

    if (service_group_info) {
        setCookie('currentPage', 'PACKAGE_DETAILS', { maxAge: 31536000 });
        return <PackageDetail props={{ ...slugData, ...referenceData }} />
    }
    if (package_info) {
        setCookie('currentPage', 'PACKAGE_LIST', { maxAge: 31536000 });
        return <PackageList props={{ ...slugData, ...referenceData }} />;
    }
    if (model_info || make_info || city_info) {
        setCookie('currentPage', 'HOME', { maxAge: 31536000 });
        return <CityPage slugData={slugData} referenceData={referenceData} />;
    }
}



export async function getServerSideProps(context) {
    const { query, req, res } = context;
    const citySlug = query?.city;
    const otherParams = query.category || [];

    res.setHeader( 'Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

    try {
        const params = { path1: citySlug, path2: otherParams?.[0] || '', path3: otherParams?.[1] || '', path4: otherParams?.[2] || '' };
        const response = await axios.get(SLUG_CHECK, { params });
        const data = response?.data?.result;
        const currentCity = data?.city_info || '';
        const currentVehicle = { make: data?.make_info || '', model: data?.model_info || '' }
        let referenceData;
        if (data?.service_group_info) {
            referenceData = await packageDetailServerProps(context, currentCity, currentVehicle)
        }
        else if (data?.package_info) {
            referenceData = await packageListServerProps(context, currentCity, currentVehicle)
        }
        else if (data?.city_info || data?.make_info || data?.model_info) {
            referenceData = await homepageGetServerProps(context, currentCity, currentVehicle)
        }

        return { props: { slugData: data, referenceData } }
    }
    catch (error) {
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }

}