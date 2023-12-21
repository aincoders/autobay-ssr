import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_PAGE } from 'src/routes/paths';
import { blogDetailsServerProps } from 'src/server_fun';
import { META_TAG } from 'src/utils/constant';

BlogDetails.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function BlogDetails({ slugData, referenceData = '' }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { currentCity, currentVehicle } = useSettingsContext();

    const seoInfo = referenceData?.seoInfo || '';
    const responseDetails = referenceData?.blogDetails || '';

    const theme = useTheme();

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|BLOG_TITLE)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
        $BLOG_TITLE: responseDetails?.title || '',
    })[match]);

    if (loading) {
        return <LoadingScreen isDashboard sx={{ position: 'absolute' }} />;
    }

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo?.title || META_TAG.blogDetailTitle)}</title>
                <meta name="description" content={replaceString(seoInfo?.description || META_TAG.blogDetailDesc)} />
                <meta property="og:title" content={replaceString(seoInfo?.title || META_TAG.blogDetailTitle)} />
                <meta property="og:description" content={replaceString(seoInfo?.description || META_TAG.blogDetailDesc)} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        <Grid item xs={12}>
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <IconButton onClick={() => router.back()}>
                                    <Tooltip title={t('prev')}>{theme.direction === 'ltr' ? <ArrowBack /> : <ArrowForward />}</Tooltip>
                                </IconButton>
                                <Box display="flex" flexDirection={'column'}>
                                    <Typography variant="h6"> {responseDetails.title}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box dangerouslySetInnerHTML={{ __html: responseDetails.description, }}></Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}


export async function getServerSideProps(context) {
    try {
        let referenceData = await blogDetailsServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}