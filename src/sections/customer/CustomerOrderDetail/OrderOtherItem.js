import { Box, Typography, useTheme } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'src/components/settings';
import { OrderContext } from 'src/mycontext/OrderContext';
import createAvatar from 'src/utils/createAvatar';
import { CustomAvatar } from 'src/components/custom-avatar';
import Label from 'src/components/label';

export default function OrderOtherItem() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { others_items_list, total_amount } = orderDetails;

    const { t } = useTranslation();
    const { currentCity } = useSettingsContext();

    const theme = useTheme();
    return (
        <>
            <Box display={'flex'} gap={2} flexDirection="column">
                <Box display={'flex'} flexDirection="column" gap={2} px={2}>
                    {others_items_list &&
                        others_items_list.map((row, _i) => (
                            <Box
                                key={_i}
                                display="flex"
                                alignItems={'center'}
                                justifyContent="space-between"
                            >
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <CustomAvatar color={createAvatar(row.item_name).color}>
                                        {createAvatar(row.item_name).name}
                                    </CustomAvatar>

                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant="subtitle2" fontWeight={'medium'}>
                                            {row.item_name}
                                        </Typography>
                                        <Typography variant="caption" color={'text.secondary'}>
                                            {`${currentCity.currency_symbol} ${Number(
                                                row.rate
                                            ).toFixed(currentCity.decimal_value)} * ${row.qty} `}
                                        </Typography>
                                    </Box>
                                </Box>
                                {row.item_type == 'SERVICE' ? (
                                    <Label
                                        variant={theme.palette.mode === 'light' ? 'soft' : 'filled'}
                                        color={'success'}
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                        {t('service').toUpperCase()}
                                    </Label>
                                ) : (
                                    <Label
                                        variant={theme.palette.mode === 'light' ? 'soft' : 'filled'}
                                        color={'info'}
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                        {t('spare_part').toUpperCase()}
                                    </Label>
                                )}
                                <Box display={'flex'} alignItems="center" gap={2}>
                                    <Box
                                        display={'flex'}
                                        flexDirection="column"
                                        alignItems={'flex-end'}
                                    >
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {`${currentCity.currency_symbol} ${Number(
                                                row.total_price
                                            ).toFixed(currentCity.decimal_value)}`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                </Box>
            </Box>
        </>
    );
}
