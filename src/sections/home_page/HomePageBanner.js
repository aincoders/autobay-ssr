/* eslint-disable import/no-extraneous-dependencies */
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { APP_NAME } from 'src/config-global';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';


export default function HomePageBanner() {
    const { loading, homePageBannerList, currentCity, currentVehicle, sectionList } = useContext(HomePageContext);
    const { make, model } = currentVehicle

    const { push } = useRouter();


    const isDesktop = useResponsive('up', 'lg');
    const navigationSetting = {
        slidesPerView: 'auto',
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.branding.swiper-button-next',
                prevEl: '.branding.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
    };

    function redirectFunction(media) {
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

    if (!loading && homePageBannerList.sub_list.length == 0) return null;
    
    if (!sectionList.find((item) => item.section_type == 'HOME')) return null


    return (
        <Box sx={{ zIndex: 0, position: 'relative', mx: { xs: 0, md: 0 } }}>
            <Swiper {...navigationSetting}>
                {(loading ? Array.from(new Array(6)) : homePageBannerList.sub_list).map(
                    (media, index) => (
                        <SwiperSlide key={index} style={{ width: 'auto' }}>
                            <Box>
                                {media ? (
                                    <Card sx={{ my: 2 }}>
                                        <Image
                                            quality={NEXT_IMAGE_QUALITY}
                                            onClick={() => redirectFunction(media)}
                                            alt={media.media_url_alt}
                                            src={media.media_url}
                                            height={400}
                                            width={700}
                                            style={{
                                                cursor: media.navigation_type ? 'pointer':"auto",
                                                height: isDesktop ? 320 : 156,
                                                objectFit: 'contain',
                                                width: '100%',
                                                borderRadius: 0,
                                            }}
                                        />
                                    </Card>
                                ) : (
                                    <Card sx={{ my: 2 }}>
                                        <Skeleton
                                            variant="rectangular"
                                            sx={{
                                                height: { xs: 156, md: 320 },
                                                pr: '350px',
                                                borderRadius: 0,
                                            }}
                                        />
                                    </Card>
                                )}
                            </Box>
                        </SwiperSlide>
                    )
                )}
                {isDesktop && (
                    <>
                        <Box
                            className="branding swiper-button-next"
                            sx={{
                                padding: 2,
                                bgcolor: 'background.default',
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                            }}
                        >
                            <KeyboardArrowRight color="primary" />
                        </Box>
                        <Box
                            className="branding swiper-button-prev "
                            sx={{
                                padding: 2,
                                bgcolor: 'background.default',
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                            }}
                        >
                            <KeyboardArrowLeft color="primary" />
                        </Box>
                    </>
                )}
            </Swiper>
        </Box>
    );
}
