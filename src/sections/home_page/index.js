import { Box, Container } from '@mui/material';
import Head from 'next/head';
import { cloneElement, useContext, useEffect, useState } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { META_TAG } from 'src/utils/constant';
import LoadingScreen from '../../components/loading-screen';
import { HomePageContext } from '../../mycontext/HomePageContext';


// import Footer from 'src/layouts/custom/footer';
import HomePageBanner from './HomePageBanner';
import HomePageBenefit from './HomePageBenefit';
import HomePageBlog from './HomePageBlog';
import HomePageCategory from './HomePageCategory';
import HomePageCustomService from './HomePageCustomService';
import HomePageFaq from './HomePageFaq';
import HomePagePromotionBanner from './HomePagePromotionBanner';
import HomePageReview from './HomePageReview';
import HomePageSeasonService from './HomePageSeasonService';
import HomePageTitle from './HomePageTitle';
import HomePageTrendingService from './HomePageTrendingService';
import HomePageWhyChooseUs from './HomePageWhyChooseUs';
import HomePageWorkshopNear from './HomePageWorkshopNear';
import HowItWorks from './HowItWorks';
import dynamic from 'next/dynamic';
import { useAuthContext } from 'src/auth/useAuthContext';


const Footer = dynamic(() => import('src/layouts/custom/footer'), { ssr: false })
const DashboardHeader = dynamic(() => import('src/layouts/custom/header'), { ssr: false })

export default function HomePageItem() {
    const {isInitialized} = useAuthContext()

    const Items = [
        { type: 'HOME', view: <HomePageBanner /> },
        { type: 'CATEGORY', view: <HomePageCategory /> },
        { type: 'ADDON', view: <HomePagePromotionBanner /> },
        { type: 'POPULAR', view: <HomePageTrendingService /> },
        { type: 'CUSTOM', view: <HomePageCustomService /> },
        { type: 'SEASONAL', view: <HomePageSeasonService /> },
        { type: 'BLOGS', view: <HomePageBlog /> },
        { type: 'WORKSHOP', view: <HomePageWorkshopNear /> },
        { type: 'BENEFIT', view: <HomePageBenefit /> },
        { type: 'WHY_CHOOSE_US', view: <HomePageWhyChooseUs /> },
    ];

    const { sectionList, seoInfo, } = useContext(HomePageContext);
    const { currentCity, currentVehicle } = useSettingsContext();


    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle?.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle?.model?.vehicle_model_name || ''
    })[match]);

    if (sectionList.length === 0) {
        return <LoadingScreen />;
    }


    return (
        <>
            <Head>
                <title>{replaceString(seoInfo?.title || META_TAG.homePageTitle)}</title>
                <meta name="description" content={replaceString(seoInfo?.description || META_TAG.homePageDesc)} />
                <meta property="og:title" content={replaceString(seoInfo?.title || META_TAG.homePageTitle)} />
                <meta property="og:description" content={replaceString(seoInfo?.description || META_TAG.homePageDesc)} />
            </Head>
            <DashboardHeader />

            <HomePageTitle />
            {sectionList.map((response, i) => {
                const getItem = Items.find((item) => item.type === response.section_type);
                if (getItem) {
                    return (
                        <Container key={i} maxWidth={response.section_type == 'HOME' ? false : 'lg'} disableGutters={response.section_type == 'HOME'}>
                            <Box >{cloneElement(getItem.view)}</Box>
                        </Container>
                    )
                }
                return null;
            })}
            <Container maxWidth='lg'>
                {sectionList.length > 0 && (
                    <>
                        <HomePageReview />
                        <HowItWorks />
                        <HomePageFaq />
                    </>
                )}
            </Container>
            <Footer />

        </>
    );
}