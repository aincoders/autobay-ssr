import { DeleteOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, Typography, Zoom } from '@mui/material/';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

export default function ConfirmDialog({ icon = <DeleteOutlined />, title, description, open, onClose }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={() => onClose({ status: false, confirmation: false })}
        >
            <Box sx={{ p: 2 }}>
                <Box display={'flex'} flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        {icon}
                        <Typography variant={'h6'} fontWeight="500">{`${title}?`}</Typography>
                    </Box>
                    <Typography variant={'body2'} color={'text.secondary'} sx={{ whiteSpace: 'pre-line' }}>
                        {description}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                <Button variant="outlined" fullWidth onClick={() => onClose({ status: false, confirmation: false })}>{t('cancel')}</Button>
                <LoadingButton
                    variant="contained"
                    loading={loading}
                    fullWidth
                    onClick={() => { setLoading(true); onClose({ status: false, confirmation: true }) }}
                >
                    {title}
                </LoadingButton>
            </Box>
        </Dialog>
    );
}
