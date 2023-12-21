import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderContext } from 'src/mycontext/OrderContext';
import { orderStatus } from 'src/utils/StatusUtil';

export default function OrderTitle() {
    const { loading, orderDetails } = useContext(OrderContext);

    const { t } = useTranslation();
    const router = useRouter();

    const theme = useTheme();
    
    const {orderStatusText}= orderStatus(orderDetails.customer_booking_status)

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={1}
                justifyContent={'space-between'}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                p={2}
            >
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <IconButton onClick={() => router.back()}>
                        <Tooltip title={t('prev')}>
                            {theme.direction === 'ltr' ? <ArrowBack /> : <ArrowForward />}
                        </Tooltip>
                    </IconButton>
                    <Box display="flex" flexDirection={'column'}>
                        <Typography variant="h6"> {orderDetails.order_number}</Typography>
                        <Typography variant="body2" color={'text.secondary'}>
                            {orderDetails.order_date_time}
                        </Typography>
                    </Box>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <Typography variant="subtitle2" color={'primary'}>
                        {orderStatusText.toLocaleUpperCase()}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
