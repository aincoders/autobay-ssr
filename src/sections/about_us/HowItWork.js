import { Box, Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { useContext } from 'react';
import { MotionViewport, varFade } from 'src/components/animate';
import Image from 'src/components/image';
import { APP_NAME, SPACING } from 'src/config-global';
import useResponsive from 'src/hooks/useResponsive';
import { AboutContext } from 'src/mycontext/AboutContext';

export default function HowItWorks() {
    const { loading, howItWorkList } = useContext(AboutContext);
    const isDesktop = useResponsive('up', 'lg');

    if (!loading && howItWorkList.length == 0) {
        return null;
    }
    return (
        <>
            <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
                <Container maxWidth={'lg'} disableGutters={isDesktop}>
                    <Box display={'flex'} flexDirection="column" gap={3} component={MotionViewport}>
                        <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                            <Typography
                                variant={isDesktop ? 'h3' : 'h6'}
                            >{`How ${APP_NAME} works?`}</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={isDesktop ? 'row' : 'column'} gap={2}>
                            {howItWorkList
                                .slice(0, 3)
                                .map((work, index) =>
                                    isDesktop ? (
                                        <OrderItemDesk
                                            key={index}
                                            number={index}
                                            work={work}
                                            isLast={index === 2}
                                        />
                                    ) : (
                                        <OrderItem
                                            key={index}
                                            number={index}
                                            work={work}
                                            isLast={index === 2}
                                        />
                                    )
                                )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}

function OrderItemDesk({ number, work, isLast }) {
    const isDesktop = useResponsive('up', 'lg');

    const { title, description, media_url, media_url_alt } = work;
    return (
        <Box display={'flex'} alignItems="center" gap={4} flex={1}>
            <m.div variants={varFade().inUp}>
                <Box display={'flex'} alignItems="center" flexDirection={'column'} flex={1}>
                    <Box position={'relative'}>
                        <Image
                            src={media_url}
                            alt={media_url_alt}
                            sx={{ height: { xs: 46, md: 150 }, width: { xs: 46, md: 150 } }}
                        />
                        {isLast ? null : (
                            <Box
                                sx={{
                                    top: '50%',
                                    left: '130%',
                                    position: 'absolute',
                                    color: 'primary.main',
                                }}
                            >
                                <Image
                                    src={
                                        'https://www.svgheart.com/wp-content/uploads/2020/09/curly-arrow-free-svg-file.png'
                                    }
                                />
                            </Box>
                        )}
                    </Box>
                    <Box
                        display="flex"
                        gap={{ xs: 0, md: 0.8 }}
                        flexDirection="column"
                        textAlign={'center'}
                        flex={1}
                    >
                        <Typography variant={isDesktop ? 'h6' : 'subtitle2'} component="span">{`${
                            number + 1
                        }. ${title}`}</Typography>
                        <Typography
                            variant={isDesktop ? 'body1' : 'caption'}
                            sx={{ color: 'text.secondary' }}
                        >
                            {description}
                        </Typography>
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
        <Box display={'flex'} alignItems="center" gap={2}>
            <Box
                sx={{
                    width: { xs: 36, md: 56 },
                    height: { xs: 36, md: 56 },
                    bgcolor: 'background.neutral',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>{number + 1}</Typography>
                {isLast ? null : (
                    <Box
                        sx={{
                            height: '110%',
                            top: '100%',
                            width: '2px',
                            position: 'absolute',
                            bgcolor: 'background.neutral',
                        }}
                    />
                )}
            </Box>

            <Box display={'flex'} alignItems="center" flex={1}>
                <Box display="flex" gap={{ xs: 0, md: 0.8 }} flexDirection="column" flex={1}>
                    <Typography variant={isDesktop ? 'h6' : 'subtitle2'} component="span">
                        {title}
                    </Typography>
                    <Typography
                        variant={isDesktop ? 'body1' : 'caption'}
                        sx={{ color: 'text.secondary' }}
                    >
                        {description}
                    </Typography>
                </Box>
                <Image
                    src={media_url}
                    alt={media_url_alt}
                    sx={{ height: { xs: 46, md: 100 }, width: { xs: 46, md: 100 } }}
                />
            </Box>
        </Box>
    );
}
