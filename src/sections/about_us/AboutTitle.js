import { alpha, Box, Container, Typography } from '@mui/material';
import { t } from 'i18next';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';

export default function AboutTitle() {
    const isDesktop = useResponsive('up', 'lg');

    return (
        <Box
            sx={{
                py: { xs: SPACING.xs * 1.5, md: SPACING.md * 1.5, },
                bgcolor: (theme) => theme.palette.secondary.main,
                color:'background.paper'
            }}
        >
            <Container maxWidth={'lg'} disableGutters={isDesktop}>
                <Box display={'flex'} flexDirection="column" gap={3}>
                    <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'center' }}>
                        <Typography variant={isDesktop ? 'h3' : 'h6'}>
                            {t('about_us')}
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
