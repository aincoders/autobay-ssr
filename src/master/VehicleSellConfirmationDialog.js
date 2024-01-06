import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Dialog, Typography, Zoom } from "@mui/material";
import { Box } from "@mui/system";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";


const Transition = forwardRef((props, ref) => <Zoom ref={ref} {...props} />);

export default function  VehicleSellConfirmation({ open,onClose,description}) {
    const { t } = useTranslation();

    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={() => onClose({ status: false, confirmation: false })}
        >
            <Box sx={{ p: 2 }}>
                <Box display={'flex'} flexDirection="column" gap={2} alignItems='center'>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CheckCircleOutline fontSize='large' color="success"  />
                    </Box>
                    <Typography variant={'subtitle1'} fontWeight='normal' textAlign={'center'}>
                        {description}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="soft" onClick={() => onClose({ status: false, confirmation: false })}>{t('dismiss')}</Button>
            </Box>
        </Dialog>
    );
}