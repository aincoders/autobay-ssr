import { Box, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import Image from 'src/components/image/Image';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';

export default function PackagePartList() {
    const { packagePartList } = useContext(PackageDetailContext);
    const isDesktop = useResponsive('up', 'lg');

    if (packagePartList.length == 0) return null;

    return (
        <Box display={'flex'} flexDirection="column" gap={2}>
            <Box display={'flex'} flexDirection="column">
                <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                    {t('included_parts')}
                </Typography>
            </Box>

            {isDesktop ? (
                <Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={4}>
                    {packagePartList.map((sparePart, i) => (
                        <Box
                            key={i}
                            display="flex"
                            flexDirection={'column'}
                            alignItems={'center'}
                            gap={1.5}
                        >
                            <Image
                                alt={sparePart.media_url_alt}
                                src={sparePart.media_url}
                                sx={{ width: 140, height: 140, borderRadius: 1 }}
                            />
                            <Tooltip title={sparePart.description}>
                                <Typography variant="body2" fontWeight={'medium'}>
                                    {sparePart.title}
                                </Typography>
                            </Tooltip>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Scrollbar>
                    <Box display={'flex'} flexDirection="row" flexWrap={'nowrap'} gap={1.5}>
                        {packagePartList.map((sparePart, i) => (
                            <Box
                                key={i}
                                display="flex"
                                flexDirection={'column'}
                                alignItems={'center'}
                                gap={1.5}
                            >
                                <Image
                                    alt={sparePart.media_url_alt}
                                    src={sparePart.media_url}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 1,
                                    }}
                                />
                                <Tooltip title={sparePart.description}>
                                    <Typography variant="caption" fontWeight={'medium'}>
                                        {sparePart.title}
                                    </Typography>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                </Scrollbar>
            )}
        </Box>
    );
}
