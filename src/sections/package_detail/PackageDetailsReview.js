import { FormatQuote, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Rating, Typography } from '@mui/material';
import { useContext } from 'react';
import { CustomAvatar } from 'src/components/custom-avatar';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import createAvatar from 'src/utils/createAvatar';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function PackageDetailsReview() {
    const { loading, reviewList } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');
    const navigationSetting = {
        grabCursor: true,
        slidesPerView: isDesktop ? 2 : 1.2,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.review.swiper-button-next',
                prevEl: '.review.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
    };

    if (!loading && reviewList.length == 0) {
        return null;
    }

    return (
        <>
            <Box
                sx={{
                    py: { xs: SPACING.xs, md: SPACING.md },
                }}
            >
                <Box display={'flex'} flexDirection="column" gap={2}>
                    <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                        <Typography
                            variant={isDesktop ? 'h3' : 'h6'}
                        >{`Customer Reviews`}</Typography>
                    </Box>
                    <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                        <Swiper {...navigationSetting}>
                            {reviewList.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <Box
                                        key={index}
                                        sx={{ p: 3, mt: 2.5, bgcolor: 'rgb(32 33 36 / 4%)', borderRadius: 1, position: 'relative', height: 200, }}
                                        display="flex"
                                        flexDirection={'column'}
                                        justifyContent="space-between"
                                    >
                                        <FormatQuote fontSize="large" color="primary" sx={{ position: 'absolute', top: -16 }} />
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                sx={{ mb: 1.5, color: 'text.secondary', WebkitLineClamp: 4, overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', }}
                                            >
                                                {item.description}
                                            </Typography>
                                            <Rating value={Number(item.rating_star)} readOnly sx={{color:"primary.main"}} />
                                        </Box>
                                        <Box sx={{ mt: 2 }} display="flex" alignItems={'center'} justifyContent="flex-start" gap={1.5}>
                                            <CustomAvatar color={createAvatar(item.name).color}>
                                                <Typography variant="subtitle2">
                                                    {createAvatar(item.name).name}
                                                </Typography>
                                            </CustomAvatar>
                                            <Box>
                                                <Typography variant="subtitle2">{item.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{item.area}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {isDesktop && (
                            <>
                                <Box className="review swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8, }}>
                                    <KeyboardArrowRight color='primary' />
                                </Box>
                                <Box className="review swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                    <KeyboardArrowLeft color='primary' />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}
