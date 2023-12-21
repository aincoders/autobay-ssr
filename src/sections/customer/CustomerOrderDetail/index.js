import { Box, Card, Container, Grid } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingScreen from 'src/components/loading-screen';
import { APP_NAME, SPACING } from 'src/config-global';
import { OrderContext } from 'src/mycontext/OrderContext';
import OrderAddress from './OrderAddress';
import OrderCancel from './OrderCancel';
import OrderDateTime from './OrderDateTime';
import OrderInfo from './OrderInfo';
import OrderItem from './OrderItem';
import OrderItemPremium from './OrderItemPremium';
import OrderOtherItem from './OrderOtherItem';
import OrderSchedulePickupDrop from './OrderSchedulePickupDrop';
import OrderSummary from './OrderSummary';
import OrderTitle from './OrderTitle';
import OrderTransaction from './OrderTransaction';

export default function CustomerOrderDetail() {
    const { t } = useTranslation();
    const { loading, orderDetails } = useContext(OrderContext);

    if (loading) {
        return <LoadingScreen isDashboard sx={{ position: 'absolute' }} />;
    }

    return (
        <>
            <Head>
                <title> {`${orderDetails.order_number} | ${APP_NAME}`}</title>
                <meta property="description" content={`${orderDetails.order_number} | ${APP_NAME}`} />
                <meta property="og:title" content={`${orderDetails.order_number} | ${APP_NAME}`} />
                <meta property="og:description" content={`${orderDetails.order_number} | ${APP_NAME}`} />

            </Head>

            <Container maxWidth={'lg'} sx={{ flex: 1 }} disableGutters>
                <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sx={{ m: 'auto' }}>
                            <Box display={'flex'} flexDirection="column" gap={2}>
                                <Card>
                                    <Box display={'flex'} flexDirection="column" gap={2}>
                                        <OrderTitle />
                                        <OrderInfo />
                                        <OrderAddress />
                                        <OrderDateTime />
                                    </Box>
                                </Card>
                                <Card>
                                    <Box display={'flex'} flexDirection="column" gap={2} >
                                        <OrderItem />
                                        <OrderItemPremium />
                                        <OrderOtherItem />
                                    </Box>
                                </Card>
                                
                                <OrderSummary />
                                <OrderTransaction />
                                <OrderSchedulePickupDrop />
                                {orderDetails.customer_booking_status == '1' && <OrderCancel />}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
