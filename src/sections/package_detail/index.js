import { Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import Head from 'next/head';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useResponsive from 'src/hooks/useResponsive';
import { META_TAG } from 'src/utils/constant';
import LoadingScreen from '../../components/loading-screen';
import { SPACING } from '../../config-global';
import { PackageDetailContext } from '../../mycontext/PackageDetailContext';
import PackageAfterBookingStep from './PackageAfterBookingStep';
import PackageBenefit from './PackageBenefit';
import PackageBottom from './PackageBottom';
import PackageDetailFaq from './PackageDetailFaq';
import PackageDetailInfo from './PackageDetailInfo';
import PackageDetailMedia from './PackageDetailMedia';
import PackageDetailsReview from './PackageDetailsReview';
import PackageFyi from './PackageFyi';
import PackageInspection from './PackageInspection';
import PackageMoreInfo from './PackageMoreInfo';
import PackagePartList from './PackagePartList';
import PackagePrice from './PackagePrice';
import PackageServiceList from './PackageServiceList';
import PackageSpecification from './PackageSpecification';
import PackageTag from './PackageTag';
import PackageTitle from './PackageTitle';
import PackageVideo from './PackageVideo';
import dynamic from 'next/dynamic';

import DashboardHeader from 'src/layouts/custom/header';

const Footer = dynamic(() => import('src/layouts/custom/footer'), { ssr: false })
// const  = dynamic(() => import('src/layouts/custom/header'), { ssr: false })

export default function PackageDetailItem() {
    const { loading, packageDetails, seoInfo } = useContext(PackageDetailContext);
    const StyleRoot = styled('div')(({ theme }) => ({
        [theme.breakpoints.down('md')]: {
            position: 'fixed',
            top: '0',
            zIndex: '1101',
            left: 0,
            height: '100%',
            width: '100%',
            overflow: 'scroll',
            background: theme.palette.background.paper,
        },
    }));
    const isDesktop = useResponsive('up', 'md');
    const { currentCity, currentVehicle } = useSettingsContext();

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|CATEGORY_NAME|PACKAGE_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle?.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle?.model?.vehicle_model_name || '',
        $CATEGORY_NAME: packageDetails?.package_category_name || '',
        $PACKAGE_NAME: packageDetails?.service_group_name || ''
    })[match]);


    if (loading) return <LoadingScreen />;

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title ? seoInfo.title : META_TAG.packageDetailTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.packageDetailDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title ? seoInfo.title : META_TAG.packageDetailTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.packageDetailDesc)} />

                <meta name="geo.region" content={currentCity?.geo_region} />
                <meta name="geo.placename" content={currentCity?.region_name} />
                <meta name="geo.position" content={`${currentCity?.latitude};${currentCity?.longitude}`} />
                <meta name="ICBM" content={`${currentCity?.latitude}, ${currentCity?.longitude}`} />
            </Head>

            <DashboardHeader />
            <StyleRoot>
                <PackageTitle />
                <PackageDetailMedia />
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        py: { xs: SPACING.xs, md: SPACING.md },
                    }}
                >
                    <Container maxWidth="lg" >
                        <Grid container columnSpacing={6} rowSpacing={5}>
                            <Grid item xs={12} md={8}>
                                <Box display="flex" flexDirection="column" gap={{ xs: 3, md: 5 }}>
                                    <PackageDetailInfo />
                                    <PackageTag />
                                    <PackageServiceList />
                                    <PackagePartList />
                                    <PackageInspection />
                                    <PackageBenefit />
                                    <PackageFyi />
                                    <PackageSpecification />
                                    <PackageAfterBookingStep />
                                    <PackageDetailFaq />
                                    <PackageDetailsReview />
                                    <PackageMoreInfo />
                                </Box>
                            </Grid>
                            {isDesktop && (
                                <Grid item xs={0} md={4}>
                                    <PackagePrice />
                                </Grid>
                            )}
                            <Grid item xs={12} md={12}>
                                <PackageVideo />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
                <PackageBottom />
            </StyleRoot>

            <Footer />
        </>
    );
}
