import { KeyboardArrowLeft, KeyboardArrowRight, PlayArrow } from '@mui/icons-material';
import { Box, Card, IconButton, Skeleton, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import Image from 'src/components/image';
import useResponsive from 'src/hooks/useResponsive';
import VideoModal from 'src/master/VideoModal';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function PackageVideo() {
    const { loading, packageVideo, packageDetails } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');
    const navigationSettingDesk = {
        loop: false,
        slidesPerView: 4,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                  nextEl: '.branding.swiper-button-next',
                  prevEl: '.branding.swiper-button-prev',
              }
            : false,
        spaceBetween: 16,
    };

    const [openModal, setOpenModal] = useState({ status: false, data: '' });
    function openModalClose(value) {
        setOpenModal({ status: value.status, data: '' });
    }

    if (!loading && packageVideo.length == 0) {
        return null;
    }

    return (
        <>
            <Box sx={{ bgcolor: 'background.paper' }}>
                <Box display={'flex'} flexDirection="column" gap={2}>
                    <Box display={'flex'} flexDirection="column" sx={{ gap: 0.5 }}>
                        <Typography
                            variant={isDesktop ? 'h6' : 'subtitle2'}
                        >{`Know Your ${packageDetails.service_group_name}`}</Typography>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Swiper {...navigationSettingDesk}>
                            {(loading ? Array.from(new Array(6)) : packageVideo).map(
                                (media, index) => (
                                    <SwiperSlide key={index} style={{ width: 'auto' }}>
                                        <Box sx={{ m: 0.2 }}>
                                            <Box>
                                                {media ? (
                                                    <>
                                                        <Card
                                                            sx={{
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <Image src={media.media_url} />
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    right: 0,
                                                                    left: 0,
                                                                    bottom: 0,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        p: 0.5,
                                                                        bgcolor: 'background.paper',
                                                                        borderRadius: 16,
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            setOpenModal({
                                                                                status: true,
                                                                                data: media,
                                                                            })
                                                                        }
                                                                    >
                                                                        <PlayArrow color="primary" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                        <Box
                                                            sx={{
                                                                pt: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight={'500'}
                                                            >
                                                                {media.title}
                                                            </Typography>
                                                        </Box>
                                                    </>
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
                                        </Box>
                                    </SwiperSlide>
                                )
                            )}
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
                        <Swiper slidesPerView={1.3} spaceBetween={16}>
                            {(loading ? Array.from(new Array(6)) : packageVideo).map(
                                (media, _j) => (
                                    <SwiperSlide key={_j}>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                m: 0.2,
                                            }}
                                        >
                                            <Box>
                                                {media ? (
                                                    <>
                                                        <Card
                                                            sx={{
                                                                position: 'relative',
                                                            }}
                                                        >
                                                            <Image src={media.media_url} />
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    right: 0,
                                                                    left: 0,
                                                                    bottom: 0,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        p: 0.5,
                                                                        bgcolor: 'background.paper',
                                                                        borderRadius: 16,
                                                                    }}
                                                                >
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            setOpenModal({
                                                                                status: true,
                                                                                data: media,
                                                                            })
                                                                        }
                                                                    >
                                                                        <PlayArrow color="primary" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </Card>
                                                        <Box
                                                            sx={{
                                                                pt: 1,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                fontWeight={'500'}
                                                            >
                                                                {media.title}
                                                            </Typography>
                                                        </Box>
                                                    </>
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
                                            </Box>
                                        </Box>
                                    </SwiperSlide>
                                )
                            )}
                        </Swiper>
                    </Box>
                </Box>
            </Box>

            <VideoModal
                open={openModal.status}
                onClose={openModalClose}
                referenceData={openModal.data}
            />
        </>
    );
}
