import { Box, Button, Card, CardActionArea, Container, Divider, Grid, Skeleton, Typography, } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'src/components/image';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, SPACING, VEHICLE_TYPE_ICON } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { PATH_CUSTOMER } from 'src/routes/paths';
import { CUSTOMER_API } from 'src/utils/constant';
import { orderStatus } from 'src/utils/StatusUtil';
import CustomerTabMenu from './CustomerTabMenu';

export default function CustomerOrder() {
    const router = useRouter();
    const { getApiData } = useApi();
    const controller = new AbortController();
    const isDesktop = useResponsive('up', 'md');

    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getOrders, signal);
        if (response) {
            const data = response.data.result;
            setLoading(false);
            setResponseList(data);
        }
    }
    useEffect(() => {
        GetList();
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <>
            <Head>
                <title> {`${t('my_orders')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_orders')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_orders')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_orders')} | ${APP_NAME}`} />

            </Head>
            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        {isDesktop && (
                            <Grid item xs={12}>
                                <Box>
                                    <CustomerTabMenu current={'orders'} />
                                </Box>
                            </Grid>
                        )}
                        {(loading ? Array.from(new Array(9)) : responseList).map(
                            (response, index) => {
                                var {  orderStatusText } = orderStatus(response && response.customer_booking_status);
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        {response ? (
                                            <Card>
                                                <Box display={'flex'} flexDirection="column" flex={1} component={CardActionArea} variant="elevation" sx={{ height: '100%' }}
                                                    onClick={() => router.push(PATH_CUSTOMER.ordersDetails(btoa(response.customer_order_id)))}
                                                >
                                                    <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="start" p={2} sx={{width:"100%"}}>
                                                        {response.vehicle_model_photo ? (
                                                            <Image src={response.vehicle_model_photo} alt={response.vehicle_model_name} sx={{ width: 48, height: 48, }} />
                                                        ) : (
                                                            <Box display={'flex'} alignItems="center" justifyContent="center" sx={{ width: 48, height: 48, }}>
                                                                <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary', }} />
                                                            </Box>
                                                        )}
                                                        <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                                                            <Typography variant="subtitle2" fontWeight={'bold'}>{response.order_number}</Typography>
                                                            <Typography variant="caption" color={'text.secondary'}>{`${response.vehicle_number} • ${response.vehicle_make_name} • ${response.vehicle_model_name}`}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box display={'flex'} gap={2} alignItems={'center'} p={2} justifyContent="space-between" sx={{ borderTop: "1px solid", borderColor: "divider",width:"100%" }}>
                                                        <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                                                            <Typography variant="caption" color={'text.secondary'}>{response.timeslot_booking_date}</Typography>
                                                            <Typography variant="subtitle2" fontWeight={'bold'}>{response.timeslot}</Typography>
                                                        </Box>
                                                            <Typography  variant='button' color={'primary'}>{orderStatusText.toUpperCase()}</Typography>
                                                    </Box>
                                                </Box>
                                            </Card>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ width: '100%', margin: 'auto', height: 100, }} />
                                        )}
                                    </Grid>
                                );
                            }
                        )}
                        {!loading && <SkeletonEmptyOrder isNotFound={!responseList.length} />}
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
