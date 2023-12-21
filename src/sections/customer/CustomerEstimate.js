import { Box, Card, CardActionArea, Container, Divider, Grid, Skeleton, Typography } from '@mui/material';
import { t } from 'i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'src/components/image';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonEmptyOrder } from 'src/components/skeleton';
import { APP_NAME, SPACING, VEHICLE_TYPE_ICON } from 'src/config-global';
import useApi from 'src/hooks/useApi';
import useResponsive from 'src/hooks/useResponsive';
import { PATH_CUSTOMER } from 'src/routes/paths';
import { CUSTOMER_API } from 'src/utils/constant';
import { estimateStatusHelper } from 'src/utils/StatusUtil';
import CustomerTabMenu from './CustomerTabMenu';

export default function CustomerEstimate() {
    const router = useRouter();
    const { getApiData } = useApi();
    const controller = new AbortController();
    const isDesktop = useResponsive('up', 'md');

    const { currentCity } = useSettingsContext();

    const { signal } = controller;
    const [responseList, setResponseList] = useState([]);
    const [loading, setLoading] = useState(false);
    async function GetList() {
        setLoading(true);
        const response = await getApiData(CUSTOMER_API.getEstimate, signal);
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
                <title> {`${t('my_estimate')} | ${APP_NAME}`}</title>
                <meta property="description" content={`${t('my_estimate')} | ${APP_NAME}`} />
                <meta property="og:title" content={`${t('my_estimate')} | ${APP_NAME}`} />
                <meta property="og:description" content={`${t('my_estimate')} | ${APP_NAME}`} />

            </Head>
            <Container maxWidth={'lg'}>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5} rowSpacing={3}>
                        {isDesktop && (
                            <Grid item xs={12}>
                                <Box>
                                    <CustomerTabMenu current={'estimate'} />
                                </Box>
                            </Grid>
                        )}
                        {(loading ? Array.from(new Array(9)) : responseList).map(
                            (response, index) => {
                                var { statusIcon, statusText, iconColor } = estimateStatusHelper(
                                    response && response.estimate_status
                                );
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        {response ? (
                                            <Box display={'flex'} flexDirection="column" flex={1} component={Card} variant="elevation" sx={{ height: '100%' }}>
                                                <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="start" p={2} component={CardActionArea}
                                                    onClick={() => router.push(PATH_CUSTOMER.estimateDetails(btoa(response.estimate_id)))}
                                                >
                                                    {response.vehicle_model_photo ? (
                                                        <Image src={response.vehicle_model_photo} alt={response.vehicle_model_name} sx={{ width: 56, height: 56 }} />
                                                    ) : (
                                                        <Box display={'flex'} alignItems="center" justifyContent="center" sx={{ width: 56, height: 56 }}>
                                                            <Box component={VEHICLE_TYPE_ICON} sx={{ color: 'text.secondary' }} />
                                                        </Box>
                                                    )}
                                                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                                                        <Typography variant="caption" color={'text.secondary'}>{response.vehicle_reg_no}</Typography>
                                                        <Typography variant="subtitle2" fontWeight={'bold'}>{response.estimate_number}</Typography>
                                                        <Typography variant="caption" color={'text.secondary'}>{`${response.vehicle_make_name} - ${response.vehicle_model_name}`}</Typography>
                                                    </Box>
                                                </Box>
                                                <Divider />
                                                <Box display={'flex'} gap={2} alignItems={'center'} p={2} justifyContent="space-between">
                                                    <Box display={'flex'} flexDirection="column" alignItems={'start'}>
                                                        <Typography variant="caption" color={'text.secondary'}>{`Created On`}</Typography>
                                                        <Typography variant="subtitle2" fontWeight={'bold'}>{response.created_on}</Typography>
                                                    </Box>
                                                    <Box display={'flex'} flexDirection="column" alignItems={'flex-end'}>
                                                        <Typography variant="subtitle2">{`${currentCity.currency_symbol} ${Number(response.estimate_total_amount).toFixed(currentCity.decimal_value)}`}</Typography>
                                                        <Typography variant="button" color={'primary'}>{statusText.toUpperCase()}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Skeleton variant="rounded" sx={{ width: '100%', margin: 'auto', height: 100 }} />
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
