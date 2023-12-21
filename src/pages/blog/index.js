import { Box, Card, CardActionArea, Container, Grid, Skeleton, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'src/components/image/Image';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PATH_BLOG } from 'src/routes/paths';
import { blogServerProps } from 'src/server_fun';
import { META_TAG } from 'src/utils/constant';

Blog.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function Blog({ slugData, referenceData = '' }) {
    const [loading, setLoading] = useState(false);
    const { currentCity, currentVehicle } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');

    const seoInfo = referenceData?.seoInfo || '';
    const responseList = referenceData?.blogList || [];

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
      })[match]);
   

    const router = useRouter();

    if (!loading && responseList.blog_list.length == 0) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{replaceString(seoInfo?.title || META_TAG.blogTitle)}</title>
                <meta name="description" content={replaceString(seoInfo?.description || META_TAG.blogDesc)} />
                <meta property="og:title" content={replaceString(seoInfo?.title || META_TAG.blogTitle)} />
                <meta property="og:description" content={replaceString(seoInfo?.description || META_TAG.blogDesc)} />

            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Box display={'flex'} flexDirection="column" gap={3}>
                        <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                            <Typography variant={isDesktop ? 'h3' : 'h6'}>{replaceString(responseList.title)}</Typography>
                            <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>{replaceString(responseList.description)}</Typography>
                        </Box>
                        <Grid container spacing={2.5} rowSpacing={3}>
                            {(loading ? Array.from(new Array(4)) : responseList.blog_list).map(
                                (media, index) => (
                                    <Grid item xs={12} md={3} key={index}>
                                        {media ? (
                                            <Card>
                                                <Box>
                                                    <Card component={CardActionArea} sx={{ position: 'relative', bgcolor: 'rgb(32 33 36 / 4%)', boxShadow: 'none' }}>
                                                        {media ? (
                                                            <Box onClick={() => router.push(PATH_BLOG.details(media.slug_url))}>
                                                                <Image src={media.media_url} alt={media.media_url_alt} ratio="4/3" />
                                                                <Box sx={{ p: isDesktop ? 2 : 1, display: 'flex', flexDirection: 'column', }}>
                                                                    <Typography variant="caption" noWrap color={'text.secondary'}>{media.created_on}</Typography>
                                                                    <Typography variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight="bold" noWrap>{media.title}</Typography>
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



export async function getServerSideProps(context) {
    try {
        let referenceData = await blogServerProps(context)
        return { props: { slugData: '', referenceData } }
    }
    catch (error) {
        console.log(error)
        return { redirect: { destination: PATH_PAGE.page404, permanent: false } };
    }
}