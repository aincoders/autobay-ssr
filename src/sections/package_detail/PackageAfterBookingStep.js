import { Box, Card, lighten, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';

export default function PackageAfterBookingStep() {
    const { afterBookingStep } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');

    if (afterBookingStep.length == 0) return null;

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={2}>
                <Box display={'flex'} flexDirection="column">
                    <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                        {t('step_after_booking')}
                    </Typography>
                </Box>
                <Card sx={{ p: 2 }}>
                    {isDesktop ? (
                        <Box display={'flex'} flexDirection={'column'} gap={2.5}>
                            {afterBookingStep.map((step, i) => (
                                <Box
                                    display={'flex'}
                                    alignItems="center"
                                    gap={2}
                                    key={i}
                                    position="relative"
                                >
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: (theme) =>
                                                lighten(theme.palette.primary.main, 0.9),
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <Typography variant={'subtitle2'}>{i + 1}</Typography>
                                        {i === afterBookingStep.length - 1 ? null : (
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    top: '100%',
                                                    width: '2px',
                                                    position: 'absolute',
                                                    bgcolor: (theme) =>
                                                        lighten(theme.palette.primary.main, 0.9),
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Box display={'flex'} alignItems="center" flex={1}>
                                        <Box display="flex" flexDirection="column" flex={1}>
                                            <Typography
                                                variant={'subtitle2'}
                                                fontWeight="500"
                                                component="span"
                                            >
                                                {step.title}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box display={'flex'} flexDirection={'column'} gap={2.5}>
                            {afterBookingStep.map((step, i) => (
                                <Box display={'flex'} alignItems="center" gap={2} key={i}>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: (theme) =>
                                                lighten(theme.palette.primary.main, 0.9),
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <Typography variant={'subtitle2'}>{i + 1}</Typography>

                                        {i === afterBookingStep.length - 1 ? null : (
                                            <Box
                                                sx={{
                                                    height: '100%',
                                                    top: '100%',
                                                    width: '2px',
                                                    position: 'absolute',
                                                    bgcolor: (theme) =>
                                                        lighten(theme.palette.primary.main, 0.9),
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Box display={'flex'} alignItems="center" flex={1}>
                                        <Box display="flex" flexDirection="column" flex={1}>
                                            <Typography
                                                variant={'body2'}
                                                fontWeight="500"
                                                component="span"
                                            >
                                                {step.title}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Card>
            </Box>
        </>
    );
}
