import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { APP_NAME, SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';
import { replaceString } from '../../utils/arraytoTree';

export default function HomePageTrendingService() {
    const { loading, trendingServiceList, currentCity, currentVehicle } = useContext(HomePageContext);
    const { make, model } = currentVehicle

    const { push } = useRouter();

    const isDesktop = useResponsive('up', 'lg');
    const navigationSetting = {
        slidesPerView: isDesktop ? 5 : 2.5,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.trending.swiper-button-next',
                prevEl: '.trending.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
    };

    function navigateAnotherPage(media) {
        if (!media.navigation_type) return;
        switch (media.navigation_type) {
            case 'package_list': {
                const getUrl = `/${currentCity.slug}/${media.package_category_slug}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
                push(`/[city]/[...category]?packageCategory=true`, getUrl);
                break;
            }
            case 'package_details': {
                const getUrl = `/${currentCity.slug}/${media.slug_url}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
                push(`/[city]/[...category]?packageDetailSlug=true`, getUrl);
                break;
            }
            case 'premium':
                push('/premium');
                break;
            case 'garage':
                push('/garage');
                break;
            case 'link':
                window.open(media.navigate_to);
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?phone=${media.navigate_to}&text=Hello ${APP_NAME}`);
                break;
            case 'call':
                window.location.href = `tel:${media.navigate_to}`;
                break;
            case 'email':
                window.location.href = `mailto:${media.navigate_to}`;
                break;
            case 'request_quote':
                push('/request-quote');
                break;
            case 'wallet':
                push('/customer/wallet')
                break;
            // case 'sms':
            //     break;
            // case 'refer_and_earn':
            //     break;
            // case 'become_partner':
            //     break;
            // case 'apply_for_franchise':
            //     break;
            default:
                break;
        }
    }

    if (!loading && trendingServiceList.sub_list.length == 0) return null;

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display="flex" flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(trendingServiceList.homepage_section_title)}{' '}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(trendingServiceList.homepage_section_description)}
                    </Typography>
                </Box>
                <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                    <Swiper {...navigationSetting}>
                        {(loading ? Array.from(new Array(4)) : trendingServiceList.sub_list).map(
                            (media, index) => (
                                <SwiperSlide key={index}>
                                    <Box>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            {media ? (
                                                <Box
                                                    onClick={() => navigateAnotherPage(media)}
                                                    sx={{ position: 'relative', cursor: media.navigation_type && 'pointer' }}
                                                >
                                                    <Image
                                                        src={media.media_url}
                                                        alt={media.media_url_alt}
                                                        quality={NEXT_IMAGE_QUALITY}
                                                        width={270}
                                                        height={270}
                                                        style={{ cursor: media.navigation_type != '' ? 'pointer' : 'auto', borderRadius: 4, height: 'auto', width: '100%' }}
                                                    />
                                                    <Box
                                                        display={'flex'}
                                                        alignItems="center"
                                                        gap={1}
                                                        justifyContent="center"
                                                        sx={{ position: 'absolute', left: 0, right: 0, margin: 'auto', bottom: 12 }}
                                                    ></Box>
                                                </Box>
                                            ) : (
                                                <>
                                                    <Skeleton variant="rectangular" sx={{ height: { xs: 145, md: 258 }, width: 'auto' }} />
                                                </>
                                            )}
                                        </Card>
                                    </Box>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>

                    {isDesktop && (
                        <>
                            <Box className="trending swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowRight color="primary" />
                            </Box>
                            <Box className="trending swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowLeft color="primary" />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
