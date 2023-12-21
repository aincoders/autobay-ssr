import { Box, Card, CardActionArea, Container, Grid, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'src/components/image/Image';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_NEWS_MEDIA } from 'src/routes/paths';
import { META_TAG, NEWS_MEDIA_API } from 'src/utils/constant';
import { setCountryTypeHeader } from 'src/utils/utils';

Blog.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function Blog() {
    const controller = new AbortController();
    const { signal } = controller;
    const [loading, setLoading] = useState(true);
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');
    const [responseList, setResponseList] = useState([]);
    

    useEffect(() => {
        async function GetList() {
            try {
                const response = await getApiData(NEWS_MEDIA_API.list, signal);
                if (response) {
                    const data = response.data.result;
                    setResponseList(data);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (currentCity.city_master_id) {
            setCountryTypeHeader(currentCity)
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
   

    const router = useRouter();

    return (
        <>
            <Head>
                <title>{replaceString(META_TAG.newsMediaTitle)}</title>
                <meta name="description" content={replaceString(META_TAG.newsMediaDesc)} />
                <meta property="og:title" content={replaceString(META_TAG.newsMediaTitle)} />
                <meta property="og:description" content={replaceString(META_TAG.newsMediaDesc)} />

            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Box display={'flex'} flexDirection="column" gap={3}>
                        <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                            <Typography variant={isDesktop ? 'h3' : 'h6'}>{t('news_media')}</Typography>
                        </Box>
                        <Grid container spacing={2.5} rowSpacing={3}>
                            {(loading ? Array.from(new Array(4)) : responseList).map(
                                (media, index) => (
                                    <Grid item xs={12} md={3} key={index}>
                                        {media ? (
                                            <Card>
                                                <Box>
                                                    <Card component={CardActionArea} sx={{ position: 'relative', bgcolor: 'rgb(32 33 36 / 4%)', boxShadow: 'none' }}>
                                                        {media ? (
                                                            <Box onClick={() => router.push(PATH_NEWS_MEDIA.details(media.slug_url))}>
                                                                <Image src={media.media_url} alt={media.media_url_alt} ratio="4/3" />
                                                                <Box sx={{ p: isDesktop ? 2 : 1, display: 'flex', flexDirection: 'column', }}>
                                                                    <Typography variant="caption" noWrap color={'text.secondary'}>{media.created_on}</Typography>
                                                                    <Typography variant={isDesktop ? 'subtitle2' : 'caption'} fontWeight="bold" noWrap>{media.title}</Typography>
                                                                </Box>
                                                            </Box>
                                                        ) : (
                                                            <Skeleton variant="rectangular" sx={{ height: { xs: 120, md: 240 }, width: 'auto' }} />
                                                        )}
                                                    </Card>
                                                </Box>
                                            </Card>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ height: { xs: 120, md: 260 }, width: 'auto' }} />
                                        )}
                                    </Grid>
                                )
                            )}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}