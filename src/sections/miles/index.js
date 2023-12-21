import { Box, Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import useResponsive from 'src/hooks/useResponsive';
import { MilesContext } from 'src/mycontext/MilesContext';
import { META_TAG } from 'src/utils/constant';
import MilesBottom from './MilesBottom';
import MilesFaq from './MilesFaq';
import MilesInclude from './MilesInclude';
import MilesInfo from './MilesInfo';
import MilesMedia from './MilesMedia';
import MilesTitle from './MilesTitle';

export default function MilesPageItem() {
    const { loading,seoInfo,milesDetails } = useContext(MilesContext);
    const { currentCity, currentVehicle } = useSettingsContext();

    
    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|PACKAGE_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
        $PACKAGE_NAME: milesDetails?.title || ""
      })[match]);

    if (loading) {
        return <LoadingScreen isDashboard />;
    }

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title ? seoInfo.title : META_TAG.premiumTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.premiumDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title ? seoInfo.title : META_TAG.premiumTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.premiumDesc)} />
            </Head>
            <Box>
                <MilesTitle />
                <MilesInfo />

                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        px: { xs: 0, md: 2 },
                        mb: { xs: 9, md: 7 },
                        py: 2,
                    }}
                >
                    <Grid container columnSpacing={4}>
                        <Grid item xs={12} md={8}>
                            <Box display="flex" flexDirection="column" gap={{ xs: 3, md: 4 }}>
                                <MilesMedia />
                                <MilesInclude />
                                <MilesBottom />
                            </Box>
                        </Grid>
                        <Grid item xs={0} md={4}>
                            <MilesFaq />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
