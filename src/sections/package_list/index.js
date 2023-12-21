import { Box } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { PackageListContext } from 'src/mycontext/PackageListContext';
import { useSettingsContext } from 'src/components/settings';
import { META_TAG } from 'src/utils/constant';
import PackageCategory from './PackageCategory';
import PackageFaq from './PackageFaq';
import PackageSection from './PackageSection';
// import DashboardHeader from 'src/layouts/custom/header';
// import Footer from 'src/layouts/custom/footer';
import PackageWhyChooseUs from './PackageWhyChooseUs';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('src/layouts/custom/footer'), { ssr: false })
const DashboardHeader = dynamic(() => import('src/layouts/custom/header'), { ssr: false })

export default function PackageListItems() {
    const { currentCity, } = useSettingsContext();
    const { seoInfo, currentPackageCategoryInfo, currentVehicle } = useContext(PackageListContext);


    const replaceString = (value = '') =>
        value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|CATEGORY_NAME)/g, (match) => {
            if (match === '$CITY_NAME') return currentCity?.city_name || '';
            if (match === '$MAKE_NAME') return currentVehicle?.make?.vehicle_make_name || '';
            if (match === '$MODEL_NAME') return currentVehicle?.model?.vehicle_model_name || '';
            if (match === '$CATEGORY_NAME') return currentPackageCategoryInfo?.package_category_name || '';
            return '';
        });

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title || META_TAG.packageListTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description || META_TAG.packageListDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title || META_TAG.packageListTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description || META_TAG.packageListDesc)} />

                <meta name="geo.region" content={currentCity?.geo_region} />
                <meta name="geo.placename" content={currentCity?.region_name} />
                <meta name="geo.position" content={`${currentCity?.latitude};${currentCity?.longitude}`} />
                <meta name="ICBM" content={`${currentCity?.latitude}, ${currentCity?.longitude}`} />
            </Head>

            <DashboardHeader/>
            <Box>
                <PackageCategory />
                <PackageSection />
                <PackageFaq />
                <PackageWhyChooseUs />
            </Box>
            <Footer/>
        </>
    );
}
