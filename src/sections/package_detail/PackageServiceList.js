import { Box, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useContext } from 'react';
import Scrollbar from '../../components/scrollbar';
import useResponsive from '../../hooks/useResponsive';
import Image from 'src/components/image/Image';
import { PackageDetailContext } from 'src/mycontext/PackageDetailContext';
import { Done } from '@mui/icons-material';
import { green } from '@mui/material/colors';

export default function PackageServiceList() {
    const { packageServiceList, packageBenefitList } = useContext(PackageDetailContext);
    const isDesktop = useResponsive('up', 'lg');
    if (packageServiceList.length == 1 && packageBenefitList.length == 0) return null;

    return (
        <Box display={'flex'} flexDirection="column" gap={2}>
            <Box display={'flex'} flexDirection="column">
                <Typography variant={isDesktop ? 'h6' : 'subtitle1'}>
                    {t('included_services')}
                </Typography>
            </Box>
            {isDesktop ? (
                <>
                    {packageServiceList.length > 1 && (
                        <Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={4}>
                            {packageServiceList.length > 1 &&
                                packageServiceList.map((service, i) => (
                                    <Box
                                        key={i}
                                        display="flex"
                                        flexDirection={'column'}
                                        alignItems={'center'}
                                        gap={1.5}
                                    >
                                        <Image
                                            alt={service.service_master_photo_alt}
                                            src={service.media}
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: 1,
                                            }}
                                        />
                                        <Tooltip title={service.description}>
                                            <Typography variant="body2" fontWeight={'medium'}>
                                                {service.title}
                                            </Typography>
                                        </Tooltip>
                                    </Box>
                                ))}
                        </Box>
                    )}

                    {packageServiceList.length == 1 && (
                        <Box
                            display={'grid'}
                            gridTemplateColumns={'repeat(3,1fr)'}
                            gap={1}
                            rowGap={2}
                        >
                            {packageBenefitList.map((benefit, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <Done fontSize={'small'} />
                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant="body1">{benefit.title}</Typography>
                                        <Typography variant="caption" color={'text.secondary'}>
                                            {benefit.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </>
            ) : (
                <Scrollbar>
                    {packageServiceList.length > 1 && (
                        <Box display={'flex'} flexDirection="row" flexWrap={'nowrap'} gap={1.5}>
                            {packageServiceList.map((service, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    flexDirection={'column'}
                                    alignItems={'center'}
                                    gap={1.5}
                                >
                                    <Image
                                        alt={service.service_master_photo_alt}
                                        src={service.media}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 1,
                                        }}
                                    />
                                    <Tooltip title={service.description}>
                                        <Typography variant="caption" fontWeight={'medium'}>
                                            {service.title}
                                        </Typography>
                                    </Tooltip>
                                </Box>
                            ))}
                        </Box>
                    )}
                    {packageServiceList.length == 1 && (
                        <Box
                            display={'grid'}
                            gridTemplateColumns={'repeat(1,1fr)'}
                            gap={1}
                            rowGap={2}
                        >
                            {packageBenefitList.map((benefit, i) => (
                                <Box
                                    key={i}
                                    display="flex"
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                >
                                    <Done
                                        fontSize={'small'}
                                        sx={{
                                            color: green[600],
                                            width: 16,
                                            height: 16,
                                        }}
                                    />
                                    <Box display={'flex'} flexDirection="column">
                                        <Typography variant="caption">{benefit.title}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Scrollbar>
            )}
        </Box>
    );
}
