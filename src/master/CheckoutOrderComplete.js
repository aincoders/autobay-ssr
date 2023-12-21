import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import PropTypes from 'prop-types';
import OrderCompleteIllustration from 'src/assets/illustrations/OrderCompleteIllustration';
import { DialogAnimate } from 'src/components/animate';
import Iconify from 'src/components/iconify';

CheckoutOrderComplete.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
};

export default function CheckoutOrderComplete({ open, onClose, referenceData }) {
    return (
        <DialogAnimate
            fullScreen
            open={open}
            PaperProps={{sx: {maxWidth: { md: 'calc(100% - 48px)' },maxHeight: { md: 'calc(100% - 48px)' },},}}
        >
            <Stack spacing={4} sx={{ m: 'auto', maxWidth: 480, textAlign: 'center', px: { xs: 0, sm: 0 }, }}>
                <Box>
                    <Typography variant="h4">{t('thanks_for_service_booking')}</Typography>
                    <Typography variant="body2" color={'text.secondary'}>{t('we_will_let_you_know_once_your_booking_is_approved')}</Typography>
                </Box>
                <Box>
                    <Typography variant="h6">{t('order_number')}</Typography>
                    <Typography variant="h5" color={'primary'}>
                        {referenceData.order_number}
                    </Typography>
                </Box>

                <OrderCompleteIllustration sx={{ height: 260 }} />

                <Typography variant="body2" color={'text.secondary'}>{t('we_will_call_you_shortly_to_confirm_your_order_and_assign_you_a_mechanic')}</Typography>

                <Divider sx={{ borderStyle: 'dashed' }} />
                
                <Stack spacing={2} justifyContent="space-between" direction={{ xs: 'column-reverse', sm: 'row' }}>
                    <Button fullWidth color="primary" variant="soft" onClick={onClose} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}>
                        {t('continue_shopping')}
                    </Button>
                </Stack>
            </Stack>
        </DialogAnimate>
    );
}
