/* eslint-disable import/no-extraneous-dependencies */
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, CardActionArea, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from '../../components/image';
import { APP_NAME, SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';

export default function HomePageSeasonService() {
    const { loading, seasonServiceList, currentCity, currentVehicle } = useContext(HomePageContext);
    const { make, model } = currentVehicle
    const { push } = useRouter();

    const isDesktop = useResponsive('up', 'lg');
    const navigationSetting = {
        slidesPerView: 5,
        modules: [Grid, Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.season.swiper-button-next',
                prevEl: '.season.swiper-button-prev',
            }
            : false,
        breakpoints: {
            0: {
                slidesPerView: 2,
                grid: { rows: 2, fill: 'rows' },
            },
            1024: {
                slidesPerView: 5,
            },
        },
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

    const replaceString = (value = '') =>
        value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|CATEGORY_NAME)/g, (match) => {
            if (match === '$CITY_NAME') return currentCity?.city_name || '';
            if (match === '$VEHICLE_MODEL_NAME') return currentVehicle?.make?.vehicle_make_name || '';
            return '';
        });

    if (!loading && seasonServiceList.sub_list.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(seasonServiceList.homepage_section_title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(seasonServiceList.homepage_section_description)}
                    </Typography>
                </Box>
                <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                    <Swiper {...navigationSetting} style={{ padding: 2 }}>
                        {(loading ? Array.from(new Array(4)) : seasonServiceList.sub_list).map(
                            (media, index) => (
                                <SwiperSlide key={index}>
                                    <Box>
                                        <Card
                                            onClick={() => navigateAnotherPage(media)}
                                            component={media && media.navigation_type != '' ? CardActionArea : Card}
                                            sx={{ position: 'relative', bgcolor: 'rgb(32 33 36 / 4%)', boxShadow: 'none' }}
                                        >
                                            {media ? (
                                                <>
                                                    <Image src={media.media_url} alt={media.media_url_alt} />
                                                    {media.title && (
                                                        <Box sx={{ p: isDesktop ? 2 : 1 }}>
                                                            <Typography variant={isDesktop ? 'subtitle1' : 'body2'} fontWeight="bold" noWrap>
                                                                {media.title}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <Skeleton variant="rectangular" sx={{ height: { xs: 120, md: 250, }, width: 'auto' }} />
                                                    <Box sx={{ p: isDesktop ? 2 : 1 }}>
                                                        <Skeleton />
                                                    </Box>
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
                            <Box className="season swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowRight color="primary" />
                            </Box>
                            <Box className="season swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8, }}>
                                <KeyboardArrowLeft color="primary" />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}