import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useResponsive from 'src/hooks/useResponsive';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { useSelector } from 'src/redux/store';
import TabbyPromoComponent from '../package_list/tabby/TabbyPromoComponent';

export default function CartSummary() {
    const { currentCity } = useSettingsContext();
    const { cartDetails, responseList } = useContext(CartPageContext);
    const { cart_total, total_amount, total_discount,  towing_total_amount } = cartDetails;
    const isDesktop = useResponsive('up', 'md');

    const { checkout } = useSelector((state) => state.product);
    const { pickupDrop } = checkout;


    const totalAmount = pickupDrop ? Number(Number(towing_total_amount) + Number(total_amount)).toFixed(currentCity.decimal_value) : Number(total_amount).toFixed(currentCity.decimal_value)

    return (
        <>
            {isDesktop ? (
                <Card>
                    <CardHeader title={t('order_summary')} />
                    <CardContent>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('sub_total')}
                                </Typography>
                                <Typography variant="subtitle2">{`${currentCity.currency_symbol} ${Number(cart_total).toFixed(currentCity.decimal_value)}`}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {t('discount')}
                                </Typography>
                                <Typography variant="subtitle2">
                                    {Number(total_discount) ? `${currentCity.currency_symbol} ${Number(total_discount).toFixed(currentCity.decimal_value)}` : '-'}
                                </Typography>
                            </Stack>
                            {pickupDrop &&
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {t('towing_charge')}
                                    </Typography>
                                    <Typography variant="subtitle2" color={'error'}>
                                        {towing_total_amount > 0 ? `+ ${currentCity.currency_symbol} ${Number(towing_total_amount).toFixed(currentCity.decimal_value)}` : t('free')}
                                    </Typography>
                                </Stack>
                            }
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1">{t('total')}</Typography>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6">
                                    {totalAmount}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle1">{t('order_summary')}</Typography>
                    </Box>
                    <Box display={'flex'} flexDirection="column" gap={2} py={1.5} px={2}>
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('sub_total')}</Typography>
                                <Typography variant="body2" fontWeight={'medium'}>{`${currentCity.currency_symbol} ${Number(cart_total).toFixed(currentCity.decimal_value)}`}</Typography>
                            </Stack>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {t('discount')}
                                </Typography>
                                <Typography variant="body2" fontWeight={'medium'}>
                                    {Number(total_discount) ? `${currentCity.currency_symbol} ${Number(total_discount).toFixed(currentCity.decimal_value)}` : '-'}
                                </Typography>
                            </Stack>
                            {pickupDrop &&
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {t('towing_charge')}
                                    </Typography>
                                    <Typography variant="body2" color={'error'}>
                                        {towing_total_amount > 0 ? `+ ${currentCity.currency_symbol} ${Number(towing_total_amount).toFixed(currentCity.decimal_value)}` : t('free')}
                                    </Typography>
                                </Stack>
                            }
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle1">{t('total')}</Typography>
                                <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle1">
                                        {totalAmount}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Card>
            )}

            {responseList.length > 0 &&
                <TabbyPromoComponent referenceID={responseList.length} Price={totalAmount} />}
        </>
    );
}
