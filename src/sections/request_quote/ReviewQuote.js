import { ChevronRightOutlined } from '@mui/icons-material';
import { Box, Button, Grid, Rating, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CustomAvatar } from 'src/components/custom-avatar';
import useResponsive from 'src/hooks/useResponsive';
import createAvatar from 'src/utils/createAvatar';

export default function ReviewQuote({reviewList}) {
    const [responseList, setResponseList] = useState(reviewList || []);

    const isDesktop = useResponsive('up', 'lg');
    if (responseList.length == 0) {
        return null;
    }

    return (
        <>

            <Box display={'flex'} flexDirection="column" gap={2}>
                <Box display={'flex'} alignItems='center' justifyContent={'space-between'}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>{`Customer Reviews`}</Typography>
                    <Button component={Link} href={'/review'} variant='soft' endIcon={<ChevronRightOutlined />}>{t('view_all')}</Button>
                </Box>
                <Grid container spacing={1} rowSpacing={2}>

                    {(responseList).map((item, index) => (
                            <Grid item xs={12} md={12} key={index}>
                                    <Box
                                        key={index}
                                        sx={{ p: 3, bgcolor: 'rgb(32 33 36 / 4%)', borderRadius: 1.5, position: 'relative', }}
                                        display="flex"
                                        flexDirection={'column'}
                                        justifyContent="space-between"
                                        gap={2}
                                    >
                                        <Box display="flex" alignItems={'center'} justifyContent='space-between'>
                                            <Box display="flex" alignItems={'center'} justifyContent="flex-start" gap={2}>
                                                <CustomAvatar color={createAvatar(item.name).color} ><Typography variant="subtitle1">{createAvatar(item.name).name}</Typography></CustomAvatar>
                                                <Box>
                                                    <Typography variant="subtitle2">{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{item.city_name}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display={'flex'} flexDirection='column' alignItems={'flex-end'}>
                                                {/* <Typography variant="button" color={'text.secondary'} >{fToNow(moment(item.created_date, 'DD-MM-YYYY').format('MM-DD-YYYY'))}</Typography> */}
                                                <Typography variant="button" color={'text.secondary'} >{`${moment(item.created_date, 'DD-MM-YYYY').fromNow()}`}</Typography>
                                                <Rating value={Number(item.rating_star)} readOnly sx={{ color: "primary.main" }} size='small' />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                                        </Box>
                                    </Box>
                            </Grid>
                        )
                    )}

                </Grid>
            </Box>
        </>
    );
}
