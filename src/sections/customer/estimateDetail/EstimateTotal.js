import { Box, Card, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from 'src/components/settings';
import { EstimateContext } from 'src/mycontext/EstimateContext';

export default function EstimateTotal() {
    const { estimateDetails } = useContext(EstimateContext);
    const { order_service_group, labour_list, parts_list } = estimateDetails;

    const { t } = useTranslation();
    const { currentCity } = useSettingsContext();

    const EstimateTotalAmount =
        labour_list.reduce((a, b) => a + Number(b.total_price), 0) +
        parts_list.reduce((a, b) => a + Number(b.total_price), 0);

    return (
        <Box>
            <Card sx={{ p: 2 }}>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    gap={1}
                    justifyContent={'space-between'}
                >
                    <Typography variant="subtitle2" textTransform={'capitalize'}>
                        {t('estimated_amount')}
                    </Typography>
                    <Typography variant={'subtitle1'}>{`${currentCity.currency_symbol}${Number(
                        EstimateTotalAmount
                    ).toFixed(currentCity.decimal_value)}`}</Typography>
                </Box>
            </Card>
        </Box>
    );
}
