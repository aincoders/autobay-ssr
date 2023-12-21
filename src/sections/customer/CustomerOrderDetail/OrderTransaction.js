import { Box, Card, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'src/components/settings';
import { OrderContext } from 'src/mycontext/OrderContext';
import { paymentStatusIcon } from 'src/utils/StatusUtil';

export default function OrderItem() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { customer_order_transaction, total_amount } = orderDetails;

    const { t } = useTranslation();

    const { currentCity } = useSettingsContext();

    if (customer_order_transaction.length == 0) return null;

    return (
        <>
            <Card>
                <Box display={'flex'} gap={2} flexDirection="column">
                    <Box
                        display={'flex'}
                        flex={1}
                        justifyContent="space-between"
                        variant="elevation"
                        sx={{
                            height: '100%',
                            p: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="subtitle1">{t('transaction')}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection="column" gap={2} px={2} pb={2}>
                        {customer_order_transaction &&
                            customer_order_transaction.map((row, _i) => (
                                <Box
                                    key={_i}
                                    display="flex"
                                    alignItems={'center'}
                                    justifyContent="space-between"
                                >
                                    <Box display={'flex'} alignItems="center" gap={2}>
                                        <Box component={paymentStatusIcon(row.payment_type)} />

                                        <Box display={'flex'} flexDirection="column">
                                            <Typography variant="subtitle2" textTransform="capitalize">
                                                {row.payment_type}
                                            </Typography>
                                            <Typography variant="caption" color={'text.secondary'}>
                                                {row.payment_gateway}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display={'flex'} alignItems="center" gap={2}>
                                        <Box
                                            display={'flex'}
                                            flexDirection="column"
                                            alignItems={'flex-end'}
                                        >
                                            <Typography variant="subtitle2" fontWeight="medium">
                                                {`${currentCity.currency_symbol} ${Number(
                                                    row.total_paid_amount
                                                ).toFixed(currentCity.decimal_value)}`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                    </Box>
                </Box>
            </Card>
        </>
    );
}
