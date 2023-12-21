import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import Image from 'src/components/image';
import Scrollbar from 'src/components/scrollbar';
import useResponsive from 'src/hooks/useResponsive';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';

export default function PackageInspection() {
    const { packageInspectionList } = useContext(PackageDetailContext);
    const isDesktop = useResponsive('up', 'lg');

    if (packageInspectionList.length == 0) return null;

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={2}>
                <Box display={'flex'} flexDirection="column">
                    <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                        {t('included_inspection')}
                    </Typography>
                </Box>
                {isDesktop ? (
                    <Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={4}>
                        {packageInspectionList.map((inspection, i) => (
                            <Box
                                key={i}
                                display="flex"
                                flexDirection={'column'}
                                alignItems={'center'}
                                gap={1.5}
                            >
                                <Image
                                    alt={inspection.service_master_photo_alt}
                                    src={inspection.media}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        borderRadius: 1,
                                    }}
                                />
                                <Typography variant="body2" fontWeight={'medium'}>
                                    {inspection.title}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Scrollbar>
                        <Box display={'flex'} flexDirection="row" flexWrap={'nowrap'} gap={1.5}>
                            {packageInspectionList.map((inspection, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    flexDirection={'column'}
                                    alignItems={'center'}
                                    gap={1.5}
                                >
                                    <Image
                                        alt={inspection.service_master_photo_alt}
                                        src={inspection.media}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 1,
                                        }}
                                    />
                                    <Typography variant="caption" fontWeight={'medium'}>
                                        {inspection.title}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Scrollbar>
                )}
            </Box>
        </>
    );
}
