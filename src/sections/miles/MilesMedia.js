import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, LinearProgress, Skeleton } from '@mui/material';
import { useContext, useState } from 'react';
import Image from 'src/components/image';
import useResponsive from 'src/hooks/useResponsive';
import { MilesContext } from 'src/mycontext/MilesContext';
import { getFileFormat } from 'src/utils/getFileFormat';
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function MilesMedia() {
    const { loading, milesDetails } = useContext(MilesContext);
    const isDesktop = useResponsive('up', 'lg');

    const navigationSetting = {
        slidesPerView: 'auto',
        modules: [Navigation],
        navigation: isDesktop
            ? {
                  nextEl: '.miles.swiper-button-next',
                  prevEl: '.miles.swiper-button-prev',
              }
            : false,
        spaceBetween: 12,
    };

    const [value, setValue] = useState(0);
    const onAutoplayTimeLeft = (s, time, progress) => {
        setValue(Math.abs(Math.ceil(progress * 100 - 100)));
    };

    return (
        <>
            <Box sx={{ bgcolor: 'background.paper' }}>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Swiper {...navigationSetting}>
                        {(loading ? Array.from(new Array(6)) : milesDetails.premium_media).map(
                            (media, index) => (
                                <SwiperSlide key={index} style={{ width: 'auto' }}>
                                    <Box>
                                        {media ? (
                                            getFileFormat(media.media_url) == 'image' ? (
                                                <Image
                                                    alt={media.media_url_alt}
                                                    src={media.media_url}
                                                    sx={{
                                                        height: 320,
                                                        width: 'auto',
                                                        borderRadius: 0,
                                                    }}
                                                />
                                            ) : (
                                                <video
                                                    src={media.media_url}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    style={{
                                                        height: 320,
                                                        width: 'auto',
                                                        borderRadius: 0,
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            )
                                        ) : (
                                            <Skeleton
                                                variant="rectangular"
                                                sx={{
                                                    height: 320,
                                                    pr: '350px',
                                                    borderRadius: 0,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </SwiperSlide>
                            )
                        )}
                        <Box
                            className="miles swiper-button-next"
                            sx={{
                                padding: 2,
                                bgcolor: 'background.default',
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                            }}
                        >
                            <KeyboardArrowRight />
                        </Box>
                        <Box
                            className="miles swiper-button-prev "
                            sx={{
                                padding: 2,
                                bgcolor: 'background.default',
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                            }}
                        >
                            <KeyboardArrowLeft />
                        </Box>
                    </Swiper>
                </Box>

                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Swiper
                        loop
                        slidesPerView={1}
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        onAutoplayTimeLeft={onAutoplayTimeLeft}
                    >
                        {(loading ? Array.from(new Array(6)) : milesDetails.premium_media).map(
                            (media, _j) => (
                                <SwiperSlide key={_j} style={{ width: 'auto' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {media ? (
                                            getFileFormat(media.media_url) == 'image' ? (
                                                <Image
                                                    alt={media.media_url_alt}
                                                    src={media.media_url}
                                                    sx={{
                                                        height: 250,
                                                        width: '100vw',
                                                        borderRadius: 0,
                                                    }}
                                                />
                                            ) : (
                                                <video
                                                    src={media.media_url}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    style={{
                                                        height: 'auto',
                                                        width: '100vw',
                                                        borderRadius: 0,
                                                    }}
                                                >
                                                    Your browser does not support the video tag.
                                                </video>
                                            )
                                        ) : (
                                            <Skeleton
                                                variant="rectangular"
                                                sx={{
                                                    height: {
                                                        xs: 156,
                                                        md: 320,
                                                    },
                                                    pr: '350px',
                                                    borderRadius: 0,
                                                }}
                                            />
                                        )}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 20,
                                                zIndex: 222,
                                                width: '90%',
                                                left: '5%',
                                            }}
                                        >
                                            <LinearProgress variant="determinate" value={value} />
                                        </Box>
                                    </Box>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>
                </Box>
            </Box>
        </>
    );
}
