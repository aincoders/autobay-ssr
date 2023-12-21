import { Avatar, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderContext } from 'src/mycontext/OrderContext';
import { getAddressIcon } from 'src/utils/StatusUtil';

export default function OrderAddress() {
    const { loading, orderDetails } = useContext(OrderContext);
    const { address_type, address_full_name, address_phone, address_line1, address_line2 } =
        orderDetails;

    const { t } = useTranslation();

    return (
        <>
            <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'space-between'} px={2} flex={1}>
                <Box display={'flex'} flex={1} justifyContent="space-between" variant="elevation" sx={{ height: '100%' }}>
                    <Box display={'flex'} gap={2} alignItems={'center'} justifyContent="start">
                        <Avatar variant="rounded" sx={{ bgcolor: 'background.neutral', width: 48, height: 48, color: 'primary.main'}}>
                            <Box component={getAddressIcon(address_type)} />
                        </Avatar>
                        <Box>
                            <Typography variant='body1' fontWeight="bold">{`${address_full_name} - ${address_phone}`}</Typography>
                            <Typography variant="caption" color={'text.secondary'}>{`${address_line1},${address_line2}`}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
