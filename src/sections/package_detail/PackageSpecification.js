import { Done } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { t } from 'i18next';
import { useContext } from 'react';
import Image from 'src/components/image/Image';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';

export default function PackageSpecification() {
    const { packageSpecificationList } = useContext(PackageDetailContext);
    const isDesktop = useResponsive('up', 'lg');

    if (packageSpecificationList.length == 0) return null;

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={2}>
                <Box display={'flex'} flexDirection="column">
                    <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                        {t('package_specification')}
                    </Typography>
                </Box>

                {isDesktop ? (
                    <Box display={'grid'} gridTemplateColumns={'repeat(3,1fr)'} gap={1.5}>
                        {packageSpecificationList.map((specification, i) => (
                            <Box
                                key={i}
                                display="flex"
                                flexDirection={'row'}
                                alignItems={'center'}
                                gap={1.5}
                            >
                                {specification.media_url ? (
                                    <Image
                                        alt={specification.media_url_alt}
                                        src={specification.media_url}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <Done fontSize={'small'} />
                                )}
                                <Box display={'flex'} flexDirection="column">
                                    <Typography variant="body1">{specification.title}</Typography>
                                    <Typography variant="caption" color={'text.secondary'}>
                                        {specification.description}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box display={'grid'} gridTemplateColumns={'repeat(1,1fr)'} gap={1}>
                        {packageSpecificationList.map((specification, i) => (
                            <Box
                                key={i}
                                display="flex"
                                flexDirection={'row'}
                                alignItems={'center'}
                                gap={1.5}
                            >
                                {specification.media_url ? (
                                    <Image
                                        alt={specification.media_url_alt}
                                        src={specification.media_url}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <Done
                                        fontSize="small"
                                        sx={{
                                            color: green[600],
                                            width: 32,
                                            height: 16,
                                        }}
                                    />
                                )}
                                <Typography variant="caption" color={'text.secondary'}>
                                    {specification.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </>
    );
}
