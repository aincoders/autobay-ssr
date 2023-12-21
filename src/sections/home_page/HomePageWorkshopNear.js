import { KeyboardArrowLeft, KeyboardArrowRight, Star } from '@mui/icons-material';
import { Avatar, Box, Card, Chip, Skeleton, Typography } from '@mui/material';
import { useContext } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from '../../components/image';
import SvgColor from '../../components/svg-color';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';
import { replaceString } from '../../utils/arraytoTree';

export default function HomePageWorkshopNear() {
    const { loading, workshopList } = useContext(HomePageContext);

    const isDesktop = useResponsive('up', 'lg');
    const navigationSetting = {
        slidesPerView: isDesktop ? 4 : 1.5,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.workshop-near.swiper-button-next',
                prevEl: '.workshop-near.swiper-button-prev',
            }
            : false,

        spaceBetween: 12,
    };

    if (!loading && workshopList.sub_list.length == 0) return null;

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column">
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(workshopList.homepage_section_title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(workshopList.homepage_section_description)}
                    </Typography>
                </Box>
                <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                    <Swiper {...navigationSetting} style={{ padding: 2 }}>
                        {(loading ? Array.from(new Array(4)) : workshopList.sub_list).map(
                            (media, index) => (
                                <SwiperSlide key={index}>
                                    <Box>
                                        <Card>
                                            {media ? (
                                                <>
                                                    <Box position={'relative'}>
                                                        <SvgColor
                                                            src="/assets/shape_avatar.svg"
                                                            sx={{ width: 80, height: 36, zIndex: 9, bottom: -15, position: 'absolute', color: 'background.paper', }}
                                                        />
                                                        <Avatar alt={media.garage_name} src={media.logo} sx={{ left: 24, zIndex: 9, width: 32, height: 32, bottom: -16, position: 'absolute' }} />
                                                        <Image alt={media.media_url_alt} src={media.media_url} ratio="4/3" />
                                                    </Box>
                                                    <Box sx={{ p: isDesktop ? 3 : 2, pb: isDesktop ? 3 : 2 }}>
                                                        <Box display={'flex'} alignItems="center" justifyContent={'space-between'} gap={1}>
                                                            <Box display={'flex'} flexDirection="column">
                                                                <Typography noWrap variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight="bold">{media.garage_name}</Typography>
                                                                <Typography  variant="caption" color={'text.disabled'}>
                                                                    {media.address}
                                                                </Typography>
                                                            </Box>
                                                            <Chip
                                                                size="small"
                                                                color="success"
                                                                label={<Typography variant="caption" fontWeight={'medium'}>4.2</Typography>}
                                                                icon={<Star sx={{ fontSize: 12 }} />}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    <Skeleton variant="rectangular" sx={{ height: { xs: 120, md: 200 }, width: 'auto' }} />
                                                    <Box sx={{ p: 2 }}><Skeleton /></Box>
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
                            <Box className="workshop-near swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowRight color="primary" />
                            </Box>
                            <Box className="workshop-near swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8, }}>
                                <KeyboardArrowLeft color="primary" />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}