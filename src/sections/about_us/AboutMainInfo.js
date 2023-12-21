import { Box, Container, Typography } from '@mui/material';
import { useContext } from 'react';
import Image from 'src/components/image';
import { SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { AboutContext } from 'src/mycontext/AboutContext';

export default function AboutMainInfo() {
    const { loading, aboutUsInfo } = useContext(AboutContext);
    const { media_url, mail_title, main_description } = aboutUsInfo

    const isDesktop = useResponsive('up', 'lg');

    if (!loading && !mail_title && !main_description) {
        return null;
    }
    return (
        <>
            <Box>
                <Container maxWidth={'lg'} disableGutters={isDesktop}>
                    <Box display={'flex'} flexDirection="column" gap={3} >
                        <Box display={'flex'} flexDirection={isDesktop ? 'row' : 'column'} gap={2} alignItems='center'>
                            <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" textAlign={'center'} justifyContent='center' flex={1}>
                                <Typography variant={isDesktop ? 'h4' : 'subtitle2'} >{mail_title}</Typography>
                                <Typography variant={isDesktop ? 'subtitle1' : 'caption'}  fontWeight='normal' >{main_description}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    {media_url && <Image src={media_url} alt={media_url} sx={{ mt:3,borderRadius:2}} />}
                </Container>
            </Box>
        </>
    );
}

