import { Box, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CancelOrderModal } from 'src/master';
import { OrderContext } from 'src/mycontext/OrderContext';

export default function OrderCancel() {
    const { loading, orderDetails, CancelOrder } = useContext(OrderContext);
    const { t } = useTranslation();

    const [cancelModal, setCancelModal] = useState(false);

    function cancelModalClose(value) {
        if (value.data) {
            CancelOrder(value.data);
        }
        setCancelModal(value.status);
    }

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                gap={1}
                justifyContent={'space-between'}
                pt={0}
            >
                <Button
                    variant="soft"
                    color="primary"
                    fullWidth
                    sx={{ textTransform: 'uppercase' }}
                    onClick={() => setCancelModal(true)}
                >
                    {t('cancel_order')}
                </Button>
            </Box>

            <CancelOrderModal open={cancelModal} onClose={cancelModalClose} NeedSelect />
        </>
    );
}
