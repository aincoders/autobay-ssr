import { Box, Button, Typography, useTheme } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { APP_NAME } from 'src/config-global';
import { ReviewContext } from 'src/mycontext/ReviewContext';

export default function ReviewSuccess() {
    const { orderDetails, } = useContext(ReviewContext);
    const theme = useTheme()

    const SVG_ICON =
    <Box className='feedback-success'>
        <svg width="72" height="72">
            <g fill="none" stroke={theme.palette.error.main} strokeWidth="2">
                <circle cx="36" cy="36" r="35" style={{ strokeDasharray: '240px', strokeDashoffset: "480px" }} ></circle>
                <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style={{ strokeDasharray: "50px", strokeDashoffset: '0px' }} ></path>
            </g>
        </svg>
    </Box >

    return (
        <>
            <Box>
                <Box display='flex' alignItems='center' gap={3} sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }} justifyContent='center'>
                    <Box display={'flex'} flexDirection='column' alignItems={'center'} justifyContent='center'>
                        <LauncherIcon sx={{ my: 2 }} />

                        <Typography variant='h6'>{`${t('order_number')} - ${orderDetails.order_number}`}</Typography>
                        <Typography variant='body2' color='text.secondary' >
                            {t('thanks_order_message').replace('%1$s', APP_NAME)}
                        </Typography>
                    </Box>
                </Box>
                <Box display={'flex'} flexDirection='column' p={4} alignItems='center' gap={2}>
                    {SVG_ICON}
                    <Typography variant='h6'>{t('feedback_submitted')}</Typography>
                    <Button LinkComponent={'a'} href={'/'} color="primary" variant="soft" >{t('continue_shopping')}</Button>
                </Box>
            </Box>
        </>
    );
}
