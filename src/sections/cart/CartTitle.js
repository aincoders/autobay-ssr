import { useTheme } from '@emotion/react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';

export default function CartTitle() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <>
            <AppBar
                position="sticky"
                sx={{ bgcolor: 'background.paper', display: { xs: 'block', md: 'none' } }}
            >
                <Toolbar>
                    <Box display={'flex'} flexDirection="column" gap={3}>
                        <Box display={'flex'} justifyContent="space-between">
                            <Box display={'flex'} gap={1} alignItems="center">
                                <IconButton onClick={() => router.back()} size="small">
                                    <Tooltip title={t('prev')}>
                                        {theme.direction === 'ltr' ? (
                                            <ArrowBack />
                                        ) : (
                                            <ArrowForward />
                                        )}
                                    </Tooltip>
                                </IconButton>
                                <Box display={'flex'} flexDirection="column">
                                    <Typography color={'text.primary'} variant={'subtitle2'}>
                                        {t('cart')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
}
