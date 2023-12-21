import { useTheme } from '@emotion/react';
import { Box, Card, lighten, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MilesContext } from 'src/mycontext/MilesContext';

export default function MilesInfo() {
    const { milesDetails } = useContext(MilesContext);
    const theme = useTheme();
    const router = useRouter();
    return (
        <>
            <Card sx={{ py: 6, bgcolor: (theme) => lighten(theme.palette.primary.main, 0.85) }}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                    <Box />
                    <Box display={'flex'} alignItems="center" flexDirection={'column'} gap={0.5}>
                        <Typography variant="h3" fontWeight={'400'}>
                            Become A Turbo Member
                        </Typography>
                        <Typography variant="h4">& Save Upto 250 BHD</Typography>
                        <Typography variant="subtitle2" mt={2} fontWeight={'normal'}>
                            Exclusive Offers | Priority Service | Freebles
                        </Typography>
                    </Box>
                    <Box />
                </Box>
            </Card>
        </>
    );
}
