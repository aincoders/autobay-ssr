import { Box, Card, CardActionArea, Grid, Skeleton, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { varHover, varTranHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';
import { OurServiceContext } from 'src/mycontext/OurServiceContext';
import { NEXT_IMAGE_QUALITY } from 'src/utils/constant';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { replaceString } from '../../utils/arraytoTree';

export default function ServiceCategory() {
    const { loading, categoryList } = useContext(OurServiceContext);
    const { currentVehicle, currentCity } = useSettingsContext();
    const { make, model } = currentVehicle

    const isDesktop = useResponsive('up', 'lg');

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(categoryList.title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(categoryList.description)}
                    </Typography>
                </Box>
                <Grid container spacing={{ xs: 2, md: 4 }}>
                    {(loading ? Array.from(new Array(12)) : categoryList.category_list).map(
                        (response, index) => {
                            const generatedPath = `/${currentCity.slug}/${response ? response.package_category_slug : ''}${model ? `/${model.vehicle_model_slug}` : (make && `/${make.vehicle_make_slug}`)}`;
                            return (
                                <Grid item xs={3} sm={4} md={1.71} key={index}>
                                    {response ? (
                                        <Box
                                            display={'flex'}
                                            flexDirection="column"
                                            gap={1}
                                            alignItems="center"
                                            component={m.div}
                                            whileHover="hover"
                                        >
                                            <Card
                                                component={CardActionArea}
                                                sx={{
                                                    position: 'relative',
                                                    p: 2,
                                                    bgcolor: 'rgb(32 33 36 / 4%)',
                                                    boxShadow: 'none',
                                                }}
                                            >
                                                <Link
                                                    href={{
                                                        pathname: generatedPath,
                                                        query: { packageCategory: true },
                                                    }}
                                                    as={`${generatedPath}`}
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'white',
                                                            position: 'absolute',
                                                            right: 0,
                                                            top: 0,
                                                            bgcolor: green[700],
                                                            px: 1,
                                                            borderBottomLeftRadius: 5,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        {response.package_category_tag}
                                                    </Typography>
                                                    <m.div
                                                        variants={varHover(1.1)}
                                                        transition={varTranHover()}
                                                    >
                                                        <Image
                                                            quality={NEXT_IMAGE_QUALITY}
                                                            height={500}
                                                            width={500}
                                                            alt={response.package_category_name}
                                                            src={response.media_url}
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto',
                                                            }}
                                                        />
                                                    </m.div>
                                                </Link>
                                            </Card>
                                            <Typography
                                                color={'text.primary'}
                                                variant={isDesktop ? 'subtitle1' : 'caption'}
                                                sx={{
                                                    WebkitLineClamp: 2,
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    fontWeight: 'medium',
                                                }}
                                                textAlign={'center'}
                                            >
                                                {response.package_category_name}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <Skeleton
                                                variant="rectangular"
                                                sx={{
                                                    height: { xs: 84, md: 132 },
                                                    width: { xs: 84, md: 132 },
                                                    margin: 'auto',
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    px: 2,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Skeleton width={'50%'} />
                                            </Box>
                                        </>
                                    )}
                                </Grid>
                            );
                        }
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
