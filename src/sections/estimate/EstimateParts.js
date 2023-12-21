import { Box, Card, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'src/components/settings';
import { EstimateShareContext } from 'src/mycontext/EstimateShareContext';

export default function EstimateParts() {
    const { loading, estimateDetails } = useContext(EstimateShareContext);
    const { order_service_group, labour_list, parts_list } = estimateDetails;

    const { t } = useTranslation();
    const { currentCity } = useSettingsContext();

    return (
        <>
            <Card>
                <Box display={'flex'} gap={1} flexDirection="column">
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
                        <Typography variant="subtitle1">{t('spare_parts')}</Typography>
                    </Box>
                    {parts_list.length > 0 && (
                        <Box display={'flex'} flexDirection="column" gap={2} px={2}>
                            {parts_list.map((row, _i) => (
                                <Box
                                    key={_i}
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                    gap={2}
                                    py={0}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        color={grey[400]}
                                        sx={{ width: 40, textAlign: 'center' }}
                                    >
                                        {_i + 1}
                                    </Typography>
                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        flex={1}
                                        justifyContent={'space-between'}
                                    >
                                        <Box display={'flex'} flexDirection={'column'}>
                                            <Typography variant="body2" fontWeight={'medium'}>
                                                {row.item_name}
                                            </Typography>
                                            <Typography variant={'body2'} color="text.secondary">
                                                {`${currentCity.currency_symbol}
                                ${Number(row.rate).toFixed(currentCity.decimal_value)} * 
                                ${row.qty}
                                ${row.tax > 0 ? ` • ${row.tax}% ${t('tax')}` : ''} 
                                ${row.tax > 0 ? (row.tax_type == 1 ? t('excl') : t('incl')) : ''}
                                ${
                                    row.discount > 0
                                        ? `• ${`${row.discount}% ${t('discount')}.`}`
                                        : ''
                                } 
                                 `}
                                            </Typography>
                                        </Box>
                                        <Box display={'flex'} alignItems={'center'} gap={2}>
                                            <Box
                                                display={'flex'}
                                                flexDirection={'column'}
                                                alignItems={'flex-end'}
                                            >
                                                <Typography
                                                    variant={'caption'}
                                                    color="text.secondary"
                                                >
                                                    {row.created_on}
                                                </Typography>
                                                <Typography variant={'subtitle2'}>{`${
                                                    currentCity.currency_symbol
                                                }${Number(row.total_price).toFixed(
                                                    currentCity.decimal_value
                                                )}`}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {parts_list.length > 0 && (
                        <Box sx={{ px: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                gap={6}
                                py={2}
                            >
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    flex={1}
                                    justifyContent={'space-between'}
                                >
                                    <Typography variant="body1">{t('subtotal')}</Typography>
                                    <Typography variant={'subtitle2'}>
                                        {` ${currentCity.currency_symbol} ${Number(
                                            parts_list.reduce(
                                                (a, b) => a + Number(b.total_price),
                                                0
                                            )
                                        ).toFixed(currentCity.decimal_value)}`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Card>
        </>
    );
}
