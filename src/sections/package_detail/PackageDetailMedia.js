/* eslint-disable no-nested-ternary */
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, LinearProgress, Skeleton } from '@mui/material';
import { useContext, useState } from 'react';
import { Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from '../../components/image';
import useResponsive from '../../hooks/useResponsive';
import { PackageDetailContext } from '../../mycontext/PackageDetailContext';
import { getFileFormat } from '../../utils/getFileFormat';

export default function PackageDetailMedia() {
    const { loading, packageMediaList } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');
    const navigationSettingDesk = {
        loop: false,
        slidesPerView: 'auto',
        modules: [Navigation],
        navigation: isDesktop
            ? {
                  nextEl: '.branding.swiper-button-next',
                  prevEl: '.branding.swiper-button-prev',
              }
            : false,
        spaceBetween: 16,
    };
    const [value, setValue] = useState(0);
    const onAutoplayTimeLeft = (s, time, progress) => {
        setValue(Math.abs(Math.ceil(progress * 100 - 100)));
    };

    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Swiper {...navigationSettingDesk}>
                    {(loading ? Array.from(new Array(6)) : packageMediaList).map((media, index) => (
                        <SwiperSlide key={index} style={{ width: 'auto' }}>
                            <Box>
                                <Card sx={{ my: 2 }}>
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
                                </Card>
                            </Box>
                        </SwiperSlide>
                    ))}
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
                        <KeyboardArrowRight />
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
                    {(loading ? Array.from(new Array(6)) : packageMediaList).map((media, _j) => (
                        <SwiperSlide key={_j} style={{ width: 'auto' }}>
                            <Box sx={{ position: 'relative' }}>
                                {media ? (
                                    getFileFormat(media.media_url) == 'image' ? (
                                        <Image
                                            alt={media.media_url_alt}
                                            src={media.media_url}
                                            sx={{
                                                height: 'auto',
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
                    ))}
                </Swiper>
            </Box>
        </Box>
    );
}
