import { Box, Container, Typography } from '@mui/material';
import { useContext } from 'react';
import Image from 'src/components/image/Image';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { AboutContext } from 'src/mycontext/AboutContext';

export default function AboutSubInfo() {
    const { loading, aboutUsInfo } = useContext(AboutContext);
    const { sub_media_url, sub_title, sub_description } = aboutUsInfo

    const isDesktop = useResponsive('up', 'lg');

    if (!loading && !sub_title && !sub_description) {
        return null;
    }
    return (
        <>
            <Box>
                <Container maxWidth={'lg'} disableGutters={isDesktop}>
                    <Box display={'flex'} flexDirection="column" gap={3} sx={{bgcolor:"background.neutral",py: { xs: SPACING.xs, md: SPACING.md },}}>

                        <Box display={'flex'} flexDirection={isDesktop ? 'row' : 'column'} gap={2} alignItems='center'>
                            <Box position={'relative'} flex={1}>
                                <Image
                                    src={sub_media_url}
                                    alt={sub_media_url}
                                    sx={{ width: '40%',margin:"auto" }}
                                />
                            </Box>
                            <Box flex={1}>
                                <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" textAlign={'left'} flex={1} width={"70%"}>
                                    <Typography variant={isDesktop ? 'h4' : 'subtitle2'} >{sub_title}</Typography>
                                    <Typography variant={isDesktop ? 'subtitle1' : 'caption'}  fontWeight='normal' >{sub_description}</Typography>
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

