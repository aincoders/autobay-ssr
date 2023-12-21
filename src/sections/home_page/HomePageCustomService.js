import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, Skeleton, Typography } from '@mui/material';
import { m } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { varHover, varTranHover } from 'src/components/animate';
import { APP_NAME, SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { HomePageContext } from 'src/mycontext/HomePageContext';
import { replaceString } from 'src/utils/arraytoTree';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { Grid, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function HomePageCustomService() {
    const { loading, customServiceList, currentCity, currentVehicle } = useContext(HomePageContext);
    const { make, model } = currentVehicle

    const { push } = useRouter();

    const isDesktop = useResponsive('up', 'lg');

    const navigationSetting = {
        slidesPerView: isDesktop ? 6 : 4,
        modules: [Navigation, Grid],
        navigation: isDesktop
            ? {
                nextEl: '.custom.swiper-button-next',
                prevEl: '.custom.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
        grid: {
            rowGap: 16,
            rows: 2,
            fill: 'row',
        },
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

    if (!loading && customServiceList.sub_list.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display="flex" flexDirection={'column'} gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(customServiceList.homepage_section_title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(customServiceList.homepage_section_description)}
                    </Typography>
                </Box>
                <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                    <Swiper {...navigationSetting}>
                        {(loading ? Array.from(new Array(isDesktop ? 12 : 8)) : customServiceList.sub_list).map((media, index) => (
                            <SwiperSlide key={index}>
                                <Box>
                                    {media ? (
                                        <>
                                            <Box
                                                display={'flex'}
                                                flexDirection="column"
                                                gap={1}
                                                alignItems="center"
                                                boxSizing={'border-box'}
                                            >
                                                <Box sx={{ position: 'relative' }} component={m.div} whileHover="hover">
                                                    <Card
                                                        onClick={() => navigateAnotherPage(media)}
                                                        sx={{
                                                            cursor: media.navigation_type && 'pointer',
                                                            boxShadow: 'none',
                                                            position: 'relative',
                                                            p: 1,
                                                            width: { xs: 84, md: 132 },
                                                            minHeight: { xs: 84, md: 132 },
                                                        }}
                                                    >
                                                        {/* <Box sx={{  position: "absolute", right: 0,left:0,top: 0,textAlign:'center', zIndex: 1 }}>
                                                    <Typography variant='caption' sx={{ color: 'white', bgcolor: green[700], px: 1, borderRadius: 5, zIndex: 1 }}>New</Typography>
                                                    </Box> */}
                                                        <m.div variants={varHover(1.1)} transition={varTranHover()}>
                                                            <Image
                                                                quality={NEXT_IMAGE_QUALITY}
                                                                height={500}
                                                                width={500}
                                                                alt={media.media_url_alt}
                                                                src={media.media_url}
                                                                style={{ width: '100%', height: 'auto' }}
                                                            />
                                                        </m.div>
                                                    </Card>
                                                </Box>
                                                <Box textAlign={'center'}>
                                                    <Typography
                                                        variant={isDesktop ? 'subtitle1' : 'caption'}
                                                        sx={{ WebkitLineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', fontWeight: 'bold' }}
                                                    >
                                                        {media.title}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <Box>
                                                <Skeleton variant="circular" sx={{ height: { xs: 84, md: 132 }, width: { xs: 84, md: 132 }, margin: 'auto' }} />
                                                <Box sx={{ px: 2, display: 'flex', justifyContent: 'center' }}>
                                                    <Skeleton width={'50%'} />
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {isDesktop && (
                        <>
                            <Box className="custom swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowRight color="primary" />
                            </Box>
                            <Box className="custom swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowLeft color="primary" />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}