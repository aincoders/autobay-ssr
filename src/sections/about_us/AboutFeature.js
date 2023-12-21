import { Box, Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { t } from 'i18next';
import { useContext } from 'react';
import { MotionViewport, varFade } from 'src/components/animate';
import Image from 'src/components/image';
import { APP_NAME, SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { AboutContext } from 'src/mycontext/AboutContext';

export default function AboutFeature() {
    const { loading, featureList } = useContext(AboutContext);
    const isDesktop = useResponsive('up', 'md');

    if (!loading && featureList.length == 0) {
        return null;
    }
    return (
        <>
            <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                <Container maxWidth={'lg'} disableGutters={isDesktop}>
                    <Box display={'flex'} flexDirection="column" gap={3} component={MotionViewport}>
                        <Box display={'flex'} flexDirection={'column'} gap={1}>
                            {featureList
                                .map((work, index) =>
                                    isDesktop ? <OrderItemDesk key={index} number={index} work={work} />
                                        : <OrderItem key={index} number={index} work={work} />
                                )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

function OrderItemDesk({ number, work, }) {
    const isDesktop = useResponsive('up', 'lg');

    const { title, description, media_url, media_url_alt } = work;
    return (
        <Box display={'flex'} alignItems="center" gap={4} flex={1}>
            <m.div variants={varFade().inUp}>
                <Box display={'flex'} alignItems="center" flexDirection={number % 2 === 0 ? 'row' : "row-reverse"} flex={1} gap={3}>
                    <Box flex={1}>
                        <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" textAlign={'left'} flex={1} width={"70%"}>
                            <Box sx={{ bgcolor: "primary.main", px: 1, width: "fit-content", borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                                <Typography variant={'body1'} component="span" color={'background.paper'} >{`${t('feature')} ${number + 1}`}</Typography>
                            </Box>
                            <Typography variant={isDesktop ? 'h5' : 'subtitle2'} >{title}</Typography>
                            <Typography variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight='normal' >{description}</Typography>
                        </Box>
                    </Box>
                    <Box position={'relative'} flex={1}>
                        <Image
                            src={media_url}
                            alt={media_url_alt}
                            sx={{ width: '50%', margin:number % 2 === 0 ?  "auto":"" }}
                        />
                    </Box>

                </Box>
            </m.div>
        </Box>
    );
}
function OrderItem({ number, work, isLast }) {
    const isDesktop = useResponsive('up', 'lg');
    const { title, description, media_url, media_url_alt } = work;
    return (
        <Box display={'flex'} alignItems="center" gap={4} flex={1}>
            <m.div variants={varFade().inUp}>
                <Box display={'flex'} alignItems="center" flexDirection={'column'} flex={1} gap={2}>
                <Box position={'relative'} flex={1}>
                        <Image
                            src={media_url}
                            alt={media_url_alt}
                            sx={{height:200}}
                        />
                    </Box>
                    <Box flex={1}>
                        <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" textAlign={'left'} flex={1}>
                            <Box sx={{ bgcolor: "primary.main", px: 1, width: "fit-content", borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                                <Typography variant={'body1'} component="span" color={'background.paper'} >{`${t('feature')} ${number + 1}`}</Typography>
                            </Box>
                            <Typography variant={isDesktop ? 'h4' : 'subtitle2'} component="span">{title}</Typography>
                            <Typography variant={isDesktop ? 'subtitle1' : 'caption'} fontWeight='normal' >{description}</Typography>
                        </Box>
                    </Box>
                </Box>
            </m.div>
        </Box>
    );
}
