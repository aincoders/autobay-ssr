import { Box } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';
import DownloadApp from './DownloadApp';
import FooterBottombar from './FooterBottombar';
import FooterGetQuote from './FooterGetQuote';
import FooterNavigation from './FooterNavigation';
import FooterTopbar from './FooterTopbar';

export default function Footer() {
    const isDesktop = useResponsive('up', 'md');

    return (
        <>
            <Box sx={{ bgcolor: 'background.paper' }}>
                <DownloadApp />
                <FooterGetQuote />
                <FooterTopbar />
                <FooterBottombar />
            </Box>
            {!isDesktop && (
                <Box sx={{ mt: 7 }}>
                    <FooterNavigation />
                </Box>
            )}
        </>
    );
}
