import { Box, Card, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'src/components/settings';
import { OrderContext } from 'src/mycontext/OrderContext';

export default function OrderSummary() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { cart_total, additional_discount_amount, offer_discount, promo_code, promo_code_id, final_total_amount, total_paid_amount_sum, towing_type, towing_charge } = orderDetails;

    const { t } = useTranslation();

    const { currentCity } = useSettingsContext();

    return (
        <>
            <Card>
                <Box display={'flex'} flexDirection="column">
                    <Box display={'flex'} flex={1} justifyContent="space-between" variant="elevation" sx={{ height: '100%', p: 2 }}>
                        <Typography variant="subtitle1">{t('payment_details')}</Typography>
                    </Box>
                    <Box display={'flex'} gap={3} flexDirection="column">
                        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} px={2}>
                            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} gap={2} py={2}>
                                <Box display={'flex'} alignItems={'center'} flex={1} justifyContent={'space-between'}>
                                    <Typography variant="body1">{t('total_amount')}</Typography>
                                    <Typography variant={'subtitle2'}>{` ${currentCity.currency_symbol} ${cart_total}`}</Typography>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} flex={1} justifyContent={'space-between'}>
                                    <Typography variant="body1">{t('additional_discount')}</Typography>
                                    <Typography variant={'subtitle2'} fontWeight="medium" sx={{ color: red[800] }}>
                                        {`- ${currentCity.currency_symbol}${Number(additional_discount_amount).toFixed(currentCity.decimal_value)}`}
                                    </Typography>
                                </Box>
                                {offer_discount > 0 && (
                                    <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                        <Typography variant="body1">{`${promo_code} - ${promo_code_id == 0 ? t('wallet') : t('promocode')}`}</Typography>
                                        <Typography variant={'subtitle2'} fontWeight="medium" sx={{ color: red[800] }}>
                                            {`- ${currentCity.currency_symbol}${Number(offer_discount).toFixed(currentCity.decimal_value)}`}
                                        </Typography>
                                    </Box>
                                )}
                                {towing_type == '1' && (
                                    <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                        <Typography variant="body1">{t('towing_charge')}</Typography>
                                        <Typography variant={'subtitle2'} fontWeight="medium">
                                            {
                                                Number(towing_charge) > 0
                                                    ? `+ ${currentCity.currency_symbol}${Number(towing_charge).toFixed(currentCity.decimal_value)}`
                                                    : t('free')
                                            }
                                        </Typography>
                                    </Box>
                                )}
                                <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                    <Typography variant="body1">{t('total_amount')}</Typography>
                                    <Typography variant={'subtitle2'} fontWeight="medium">
                                        {`${currentCity.currency_symbol}${Number(final_total_amount).toFixed(currentCity.decimal_value)}`}
                                    </Typography>
                                </Box>

                                <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                    <Typography variant="body1">{t('paid_amount')}</Typography>
                                    <Typography variant={'subtitle2'} fontWeight="medium" sx={{ color: green[800] }}>
                                        {`${currentCity.currency_symbol}${Number(total_paid_amount_sum).toFixed(currentCity.decimal_value)}`}
                                    </Typography>
                                </Box>

                                <Box display={'flex'} alignItems={'flex-end'} justifyContent={'space-between'}>
                                    <Typography variant="body1">{t('outstanding')}</Typography>
                                    <Typography variant={'subtitle2'} fontWeight="medium" sx={{ color: red[800] }}>
                                        {`${currentCity.currency_symbol}${Number(final_total_amount - total_paid_amount_sum).toFixed(currentCity.decimal_value)}`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </>
    );
}
