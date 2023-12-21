import { Box, Typography } from '@mui/material';
import { useContext } from 'react';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { ReviewContext } from 'src/mycontext/ReviewContext';

export default function ReviewTitle() {
    const { orderDetails, } = useContext(ReviewContext);


    return (
        <>
            <Box display='flex' alignItems='center' gap={3} sx={{ p: 2, }} justifyContent='center'>
                <Box display={'flex'} flexDirection='column' alignItems={'center'} justifyContent='center'>
                    <LauncherIcon sx={{ my: 1 }} />

                    <Typography variant='h4'>{`LEAVE A REVIEW`}</Typography>
                    <Typography variant='subtitle1'>{`THANK YOU FOR YOUR ORDER ${orderDetails.order_number}`}</Typography>
                </Box>
            </Box>
            <Box sx={{ borderBlock: '1px solid', borderColor: "divider", p: 2 }}>
                <Typography variant='body2' sx={{ whiteSpace: 'pre-line', textAlign: "justify", letterSpacing: 0.5 }}>
                    {` Dear Customer,
                        Thank you for choosing Autobay for your car service. Please leave us a review for the services.
                        This will help improve our operations and services to give you a better experience the next time.`}
                </Typography>
            </Box>
        </>
    );
}
