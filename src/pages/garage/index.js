import { Star } from '@mui/icons-material';
import { Avatar, Box, Card, Chip, Container, Grid, Typography } from '@mui/material';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Image from 'src/components/image/Image';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import SvgColor from 'src/components/svg-color/SvgColor';
import { SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { CUSTOMER_API, GARAGE_API, META_TAG, SEO_PAGE_TYPE } from 'src/utils/constant';
import { setCountryTypeHeader } from 'src/utils/utils';

Faq.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function Faq() {
    const controller = new AbortController();
    const { signal } = controller;
    const [loading, setLoading] = useState(true);
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');
    const [responseList, setResponseList] = useState([]);
    const [seoInfo, setSeoInfo] = useState('')

    async function GetSeoInformation() {
        try {
            const params = { page_type: SEO_PAGE_TYPE.workshop };
            const response = await getApiData(CUSTOMER_API.getSeo, params, signal);
            if (response) {
                setSeoInfo(response.data.result);
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function GetList() {
        try {
            const response = await getApiData(GARAGE_API, signal);
            if (response) {
                const data = response.data.result;
                setResponseList(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (currentCity.city_master_id) {
            setCountryTypeHeader(currentCity)
            GetSeoInformation()
            GetList();
        }
        return () => {
            controller.abort();
        };
    }, [currentCity]);

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
    })[match]);

    if (loading) {
        return <LoadingScreen isDashboard sx={{ position: 'absolute' }} />;
    }

    if (!loading && responseList.length == 0) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo.title ? seoInfo.title : META_TAG.garageTitle)}</title>
                <meta name="description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.garageDesc)} />
                <meta property="og:title" content={replaceString(seoInfo.title ? seoInfo.title : META_TAG.garageTitle)} />
                <meta property="og:description" content={replaceString(seoInfo.description ? seoInfo.title : META_TAG.garageDesc)} />
            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        {!loading
                            ? responseList.map((media, index) => (
                                <Grid item xs={12} md={3} key={index}>
                                    <Card>
                                        <Box sx={{ position: 'relative' }}>
                                            <SvgColor
                                                src="/assets/shape_avatar.svg"
                                                sx={{ width: 80, height: 36, zIndex: 9, bottom: -15, position: 'absolute', color: 'background.paper', }}
                                            />
                                            <Avatar
                                                alt={media.garage_name}
                                                src={media.logo}
                                                sx={{ left: 24, zIndex: 9, width: 32, height: 32, bottom: -16, position: 'absolute', }}
                                            />
                                            <Image alt={media.media_url_alt} src={media.media_url} ratio="4/3" />
                                        </Box>

                                        <Box sx={{ p: isDesktop ? 3 : 2, width: 1, pb: isDesktop ? 3 : 2, }}>
                                            <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                                                <Box display={'flex'} flexDirection="column">
                                                    <Typography noWrap variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight="bold">{media.garage_name}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{media.address}</Typography>
                                                </Box>
                                                <Chip size="small" color="success" label={<Typography variant="caption">4.2</Typography>} icon={<Star sx={{ fontSize: 16, }} />}
                                                />
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                            : !loading && <SkeletonEmptyOrder isNotFound={!responseList.length} />}
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
