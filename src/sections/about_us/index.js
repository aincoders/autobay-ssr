import { Box, Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { SPACING } from 'src/config-global';
import { AboutContext } from 'src/mycontext/AboutContext';
import LoadingScreen from '../../components/loading-screen';
import { useSettingsContext } from '../../components/settings';
import { META_TAG } from '../../utils/constant';
import AboutFeature from './AboutFeature';
import AboutMainInfo from './AboutMainInfo';
import AboutSubInfo from './AboutSubInfo';
import AboutTitle from './AboutTitle';

export default function AboutUsIt() {

    const { currentCity, currentVehicle } = useSettingsContext();
    const { loading,seoInfo } = useContext(AboutContext);

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
      })[match]);

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title ? seoInfo.title : META_TAG.aboutTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.aboutDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title ? seoInfo.title : META_TAG.aboutTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.aboutDesc)} />
            </Head>

            <AboutTitle/>

            <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                <Grid container spacing={3} rowSpacing={4}>
                    <Grid item xs={12} md={12}>
                        <AboutMainInfo/>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <AboutSubInfo/>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <AboutFeature/>
                    </Grid>
                        {/* <AboutInfo />
                        <AboutBenefit />
                        <WhyChooseUs />
                        <HowItWorks /> */}
                </Grid>
            </Box>
        </>
    );
}
