import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { APP_NAME, SPACING } from '../../config-global';
import { HomePageContext } from '../../mycontext/HomePageContext';


export default function HomePagePromotionBanner() {
    const { loading, promotionBannerList, currentCity, currentVehicle } = useContext(HomePageContext);
    const { make, model } = currentVehicle

    const { push } = useRouter();

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
    const isDesktop = useResponsive('up', 'lg');

    const navigationSetting = {
        slidesPerView: isDesktop ? 5 : 2.5,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.promotion.swiper-button-next',
                prevEl: '.promotion.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
    };

    if (!loading && promotionBannerList.sub_list.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                <Swiper {...navigationSetting}>
                    {(loading ? Array.from(new Array(2)) : promotionBannerList.sub_list).map(
                        (media, index) => (
                            <SwiperSlide key={index}>
                                {media ? (
                                    <>
                                        <Image
                                            quality={NEXT_IMAGE_QUALITY}
                                            onClick={() => navigateAnotherPage(media)}
                                            src={media.media_url}
                                            alt={media.media_url_alt}
                                            width={500}
                                            height={500}
                                            style={{ cursor: media.navigation_type != '' ? 'pointer' : 'auto', borderRadius: 4, height: 'auto', width: '100%' }}
                                        />
                                    </>
                                ) : (
                                    <Skeleton variant="rectangular" sx={{ height: { xs: 145, md: 258 }, width: 'auto', borderRadius: 1 }} />
                                )}
                            </SwiperSlide>
                        )
                    )}
                </Swiper>

                {isDesktop && (
                    <>
                        <Box className="promotion swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                            <KeyboardArrowRight color="primary" />
                        </Box>
                        <Box className="promotion swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                            <KeyboardArrowLeft color="primary" />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
}
