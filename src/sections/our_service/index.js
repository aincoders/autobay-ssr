import { Box, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { OurServiceContext } from 'src/mycontext/OurServiceContext';
import LoadingScreen from '../../components/loading-screen';
import { useSettingsContext } from '../../components/settings';
import { META_TAG } from '../../utils/constant';
import ServiceBrand from './ServiceBrand';
import ServiceCategory from './ServiceCategory';

export default function OurServiceItem() {
    const isDesktop = useResponsive('up', 'lg');
    const { currentCity, currentVehicle } = useSettingsContext();

    const { loading,seoInfo } = useContext(OurServiceContext);

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
      })[match]);

    if (loading) return <LoadingScreen />;

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo?.title || META_TAG.ourServiceTitle)}</title>
                <meta name="description" content={replaceString(seoInfo?.description || META_TAG.ourServiceDesc)} />
                <meta property="og:title" content={replaceString(seoInfo?.title || META_TAG.ourServiceTitle)} />
                <meta property="og:description" content={replaceString(seoInfo?.description || META_TAG.ourServiceDesc)} />

            </Head>

            <Container maxWidth={'lg'} disableGutters={isDesktop}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={3} rowSpacing={3}>
                        <Grid item xs={12} md={12}>
                            <ServiceCategory />
                            <ServiceBrand />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
