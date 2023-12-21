import { useTheme } from '@emotion/react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { AppBar, Box, Divider, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import LauncherIcon from 'src/assets/logo/LauncherIcon';
import { MilesContext } from 'src/mycontext/MilesContext';

export default function MilesTitle() {
    const { milesDetails } = useContext(MilesContext);
    const theme = useTheme();
    const router = useRouter();
    return (
        <>
            <AppBar sx={{ bgcolor: 'background.paper' }}>
                <Toolbar>
                    <Box display={'flex'} justifyContent="space-between" sx={{ width: '100%' }}>
                        <IconButton onClick={() => router.back()} size="small">
                            <Tooltip title={t('prev')}>
                                {theme.direction === 'ltr' ? <ArrowBack /> : <ArrowForward />}
                            </Tooltip>
                        </IconButton>
                        <Box display={'flex'} alignItems="center" gap={2}>
                            <LauncherIcon />
                            <Divider orientation="vertical" flexItem />
                            <Typography variant="h4" color={'primary'}>
                                {milesDetails.title}
                            </Typography>
                        </Box>
                        <Box />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}
