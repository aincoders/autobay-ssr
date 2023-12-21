import { Box, Card, Container, Grid, Pagination, Rating, Skeleton, Typography } from '@mui/material';
import moment from 'moment';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CustomAvatar } from 'src/components/custom-avatar';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { API_PAGE_LIMIT, CUSTOMER_REVIEW_API, META_TAG } from 'src/utils/constant';
import createAvatar from 'src/utils/createAvatar';
import { setCountryTypeHeader } from 'src/utils/utils';
import ReviewCountBar from './ReviewCountBar';


export default function Review() {
    const controller = new AbortController();
    const { signal } = controller;
    const { getApiData } = useApi();
    const { currentCity, currentVehicle } = useSettingsContext();
    const isDesktop = useResponsive('up', 'lg');

    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPage, setTotalPage] = useState(0)
    const [page, setPage] = useState(1)
    const [curentPage, setCurentPage] = useState(0);
    const [ratingCount, setRatingCount] = useState('')


    useEffect(() => {
        async function GetCustomerReviewList() {
            try {
                const params = {
                    start_page: curentPage,
                    limit: API_PAGE_LIMIT,
                }
                const response = await getApiData(CUSTOMER_REVIEW_API.allReview, params, signal);
                if (response) {
                    const data = response.data.result.list;
                    setTotalPage(~~response.data.result.total)
                    setRatingCount(response.data.result)
                    setResponseList(data);
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (currentCity.city_master_id) {
            setCountryTypeHeader(currentCity)
            GetCustomerReviewList();
        }
        return () => {
            controller.abort();
        };
    }, [currentCity, page]);

    const replaceString = (value = '') => value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME)/g, match => ({
        $CITY_NAME: currentCity?.city_name || '',
        $MAKE_NAME: currentVehicle.make?.vehicle_make_name || '',
        $MODEL_NAME: currentVehicle.model?.vehicle_model_name || '',
    })[match]);

    const handleChangePage = (event, newPage) => {
        setPage(~~newPage)
        setCurentPage(Number(newPage - 1) * ~~API_PAGE_LIMIT)
    };

    if (!loading && responseList.length == 0) {
        return null;
    }



    return (
        <>
            <Head>
                <title>{replaceString(META_TAG.reviewTitle)}</title>
                <meta name="description" content={replaceString(META_TAG.reviewDesc)} />
                <meta property="og:title" content={replaceString(META_TAG.reviewTitle)} />
                <meta property="og:description" content={replaceString(META_TAG.reviewDesc)} />

            </Head>

            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Box display={'flex'} flexDirection="column" gap={3}>
                        <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                            <Typography variant={isDesktop ? 'h3' : 'h6'}>{'Customer Review'}</Typography>
                        </Box>
                        <Grid container spacing={2.5} rowSpacing={3}>
                            <Grid item xs={12} md={12} >
                                <Card>
                                    <ReviewCountBar ratingCount={ratingCount} />
                                </Card>
                            </Grid>
                            {(loading ? Array.from(new Array(4)) : responseList).map(
                                (item, index) => (
                                    <Grid item xs={12} md={12} key={index}>
                                        {item ? (
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
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ height: { xs: 120, md: 160 }, width: 'auto' }} />
                                        )}
                                    </Grid>
                                )
                            )}
                        </Grid>
                        {totalPage > API_PAGE_LIMIT &&
                            <Box display={'flex'} justifyContent='center'>
                                <Pagination page={page} count={Math.ceil(totalPage / API_PAGE_LIMIT)} color="primary" onChange={handleChangePage} showFirstButton showLastButton />
                            </Box>
                        }
                    </Box>
                </Box>
            </Container>
        </>
    );
}
