import { Done, TaskAlt } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { t } from 'i18next';
import { useContext } from 'react';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';

export default function PackageBenefit() {
    const { packageBenefitList, packageServiceList } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');

    if (packageBenefitList.length == 0 || packageServiceList.length == 1) return null;

    return (
        <Box display={'flex'} flexDirection="column" gap={2}>
            <Box display={'flex'} flexDirection="column">
                <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                    {t('additional_services')}
                </Typography>
            </Box>
            {isDesktop ? (
                <Box display={'grid'} gridTemplateColumns={'repeat(3,1fr)'} gap={1.5}>
                    {packageBenefitList.map((benefit, i) => (
                        <Box
                            key={i}
                            display="flex"
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1.5}
                        >
                            {benefit.media_url ? (
                                <Image
                                    alt={benefit.media_url_alt}
                                    src={benefit.media_url}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <Done fontSize={'small'} />
                            )}
                            <Box display={'flex'} flexDirection="column">
                                <Typography variant="body1">{benefit.title}</Typography>
                                <Typography variant="caption" color={'text.secondary'}>
                                    {benefit.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box display={'grid'} gridTemplateColumns={'repeat(1,1fr)'} gap={1}>
                    {packageBenefitList.map((benefit, i) => (
                        <Box
                            key={i}
                            display="flex"
                            flexDirection={'row'}
                            alignItems={'center'}
                            gap={1.5}
                        >
                            {benefit.media_url ? (
                                <Image
                                    alt={benefit.media_url_alt}
                                    src={benefit.media_url}
                                    sx={{ width: 32, height: 32 }}
                                />
                            ) : (
                                <Done
                                    fontSize="small"
                                    sx={{
                                        color: green[600],
                                        width: 16,
                                        height: 16,
                                    }}
                                />
                            )}
                            <Box display={'flex'} flexDirection="column">
                                <Typography variant="caption" color={'text.secondary'}>
                                    {benefit.title}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
