import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Box, Card, CardActionArea, Skeleton, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { PATH_BLOG } from 'src/routes/paths';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from '../../components/image';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';
import { replaceString } from '../../utils/arraytoTree';

export default function HomePageBlog() {
    const { loading, blogList } = useContext(HomePageContext);

    const router = useRouter();

    const isDesktop = useResponsive('up', 'md');
    const navigationSetting = {
        slidesPerView: isDesktop ? 4 : 1.5,
        modules: [Navigation],
        navigation: isDesktop
            ? {
                nextEl: '.blog.swiper-button-next',
                prevEl: '.blog.swiper-button-prev',
            }
            : false,
        spaceBetween: 12,
    };

    if (!loading && blogList.sub_list.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(blogList.homepage_section_title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(blogList.homepage_section_description)}
                    </Typography>
                </Box>
                <Box sx={{ zIndex: 0, overflow: 'hidden', position: 'relative' }}>
                    <Swiper {...navigationSetting} style={{ padding: 2 }}>
                        {(loading ? Array.from(new Array(4)) : blogList.sub_list).map(
                            (media, index) => (
                                <SwiperSlide key={index}>
                                    <Box>
                                        <Card
                                            component={CardActionArea}
                                            sx={{
                                                position: 'relative',
                                                bgcolor: 'rgb(32 33 36 / 4%)',
                                                boxShadow: 'none',
                                            }}
                                        >
                                            {media ? (
                                                <Box onClick={() => router.push(PATH_BLOG.details(media.slug_url))}>
                                                    <Image src={media.media_url} alt={media.media_url_alt} ratio="4/3" />
                                                    <Box sx={{ p: isDesktop ? 2 : 1, display: 'flex', flexDirection: 'column' }}>
                                                        <Typography variant="caption" noWrap color={'text.secondary'}>
                                                            {media.created_on}
                                                        </Typography>
                                                        <Typography variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight="bold" noWrap>
                                                            {media.title}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            ) : (
                                                <Skeleton variant="rectangular" sx={{ height: { xs: 120, md: 240 }, width: 'auto' }} />
                                            )}
                                        </Card>
                                    </Box>
                                </SwiperSlide>
                            )
                        )}
                    </Swiper>

                    {isDesktop && (
                        <>
                            <Box className="blog swiper-button-next" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowRight color="primary" />
                            </Box>
                            <Box className="blog swiper-button-prev" sx={{ padding: 2, bgcolor: 'background.default', width: 32, height: 32, borderRadius: 8 }}>
                                <KeyboardArrowLeft color="primary" />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
}