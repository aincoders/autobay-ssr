import { alpha, Box, Button, Container, Typography } from '@mui/material';
import { t } from 'i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useResponsive from 'src/hooks/useResponsive';

export default function FooterGetQuote() {
    const isDesktop = useResponsive('up', 'lg');

    const router = useRouter();

    if (router.route == '/request-quote')
        return <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />;

    return (
        <>
            <Box
                sx={{
                    py: { xs: 2, md: 7 },
                    bgcolor: (theme) => theme.palette.secondary.main,
                    color:'background.paper'
                }}
            >
                <Container maxWidth="lg" >
                    <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
                        <Box display={'flex'} flexDirection="column">
                            <Typography variant={isDesktop ? 'h3' : 'h6'}>{t('request_a_quote')}</Typography>
                            <Typography variant={isDesktop ? 'body1' : 'caption'}>{t('request_quote_desc')}</Typography>
                        </Box>
                        <Button variant="contained" size={isDesktop ? 'large' : 'medium'}>
                            <Link
                                href={`/request-quote`}
                                prefetch={false}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {t('get_a_quote')}
                            </Link>
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
