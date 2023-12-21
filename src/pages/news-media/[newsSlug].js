import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'src/components/image';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { META_TAG, NEWS_MEDIA_API } from 'src/utils/constant';

NewsDetails.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function NewsDetails() {
    const router = useRouter();
    const controller = new AbortController();
    const { signal } = controller;
    const [loading, setLoading] = useState(true);
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const [responseDetails, setResponseDetails] = useState('');


    async function GetDetails() {
        const params = { slug: router.query.newsSlug };
        const response = await getApiData(NEWS_MEDIA_API.details, params, signal);
        if (response) {
            setResponseDetails(response.data.result);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (router.query.newsSlug) {
            GetDetails();
        }
        return () => {
            controller.abort();
        };
    }, [router]);

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
                <title>{replaceString(responseDetails.title)}</title>
                <meta name="description" content={replaceString(responseDetails.title)} />
                <meta property="og:title" content={replaceString(responseDetails.title)} />
                <meta property="og:description" content={replaceString(responseDetails.title)} />
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
                        {responseDetails.media_url && <Grid item xs={12}>
                            <Image src={responseDetails.media_url} alt={responseDetails.media_url_alt} ratio="21/9" sx={{ borderRadius: 2 }} />
                        </Grid>}
                        <Grid item xs={12}>
                            <Box dangerouslySetInnerHTML={{ __html: responseDetails.description, }}></Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}