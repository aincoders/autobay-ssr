import { Event } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderContext } from 'src/mycontext/OrderContext';

export default function OrderDateTime() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { timeslot_booking_date, timeslot } = orderDetails;

    const { t } = useTranslation();

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={1}
                justifyContent={'space-between'}
                px={2}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                pb={2}
                flex={1}
            >
                <Box
                    display={'flex'}
                    flex={1}
                    justifyContent="space-between"
                    variant="elevation"
                    sx={{ height: '100%' }}
                >
                    <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="start">
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: 'background.neutral',
                                width: 48,
                                height: 48,
                            }}
                        >
                            <Event color="primary" />
                        </Avatar>
                        <Box>
                            <Typography variant={'body1'} fontWeight="bold">
                                {timeslot_booking_date}
                            </Typography>
                            <Typography variant="caption" color={'text.secondary'}>
                                {timeslot}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
