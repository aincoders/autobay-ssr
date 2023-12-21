import { useTheme } from '@emotion/react';
import { ArrowBack, ArrowForward, Done, Star } from '@mui/icons-material';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Image from 'src/components/image/Image';
import createAvatar from 'src/utils/createAvatar';
import useResponsive from '../../hooks/useResponsive';
import { MakeMasterModal } from '../../master';
import { PackageDetailContext } from '../../mycontext/PackageDetailContext';

export default function PackageDetailInfo() {
    const { loading, packageDetails, packagetimeLineList } = useContext(PackageDetailContext);
    const { booking_type_list, service_group_name, package_category_name, total_review, rating_star } = packageDetails
    const [makeModal, setMakeModal] = useState(false);
    function makeModalClose(value) {
        setMakeModal(value.status);
    }
    const theme = useTheme();
    const router = useRouter();

    const isDesktop = useResponsive('up', 'lg');

    return (
        <>
            <Box display={'flex'} flexDirection="column" gap={2}>
                <Box display={'flex'} justifyContent="space-between">
                    <Box display={'flex'} gap={2} alignItems="center">
                        {/* <IconButton onClick={() => router.back()} size="small" variant="soft" color="inherit">
                            <Tooltip title={t('prev')}>
                                {theme.direction === 'ltr' ? <ArrowBack /> : <ArrowForward />}
                            </Tooltip>
                        </IconButton> */}
                        <Box display={'flex'} flexDirection="column">
                            <Typography variant={isDesktop ? 'h4' : 'subtitle1'}>{service_group_name}</Typography>
                                <Box display={'flex'} flexDirection="row" flexWrap={'wrap'} gap={1} alignItems="center">
                                    {booking_type_list?.map((tag, k) => (
                                        <Box key={k} display="flex"
                                            sx={{
                                                color: `${createAvatar(tag.booking_type).color}.main`,
                                                pr: 1,
                                                borderRadius: 1
                                            }}>
                                            <Typography variant="caption" fontWeight={'medium'} textTransform="uppercase">
                                                {tag.booking_type}
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                     
                    </Box>

                    {total_review > 0 && (
                        <Box display={'flex'} flexDirection="column" alignItems="center" gap={0.5}>
                        <Box display="flex" gap={0.5} alignItems="center" sx={{ bgcolor: 'success.main', color: '#fff', p: 0.5, px: 1, borderRadius: 1 }}>
                            <Typography variant="body1" fontWeight='bold'>{rating_star}</Typography>
                            <Star fontSize="inherit" />
                        </Box>
                        <Box display={'flex'} flexDirection="column" alignItems='flex-start'>
                            <Typography variant="button" color={'text.secondary'}>{`${total_review} ${t('reviews')}`}</Typography>
                        </Box>
                    </Box>
                    )}
                </Box>
                {packagetimeLineList && isDesktop ? (
                    <Box display={'grid'} gridTemplateColumns={'repeat(3,1fr)'} gap={1} rowGap={2}>
                        {packagetimeLineList.map((timeline, k) => (
                            <Box key={k} display="flex" alignItems={'center'} gap={1} sx={{ color: 'text.secondary' }}>
                                {timeline.media_url
                                    ? <Image alt={timeline.title} src={timeline.media_url} sx={{ width: 32, height: 32 }} />
                                    : <Done fontSize={'small'} />
                                }
                                <Typography variant="button">{timeline.title}</Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box display="grid" gridTemplateColumns={'repeat(1,1fr)'} gap={1} flexDirection="column">
                        {packagetimeLineList.map((timeline, i) => (
                            <Box key={i} display="flex" alignItems={'center'} gap={{ xs: 1, md: 2 }}>
                                {timeline.media_url
                                    ? (<Image alt={timeline.title} src={timeline.media_url} sx={{ width: 32, height: 32 }} />)
                                    : (<Done fontSize={'small'} />)
                                }
                                <Typography variant={'caption'} fontWeight={'medium'}>{timeline.title}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <MakeMasterModal open={makeModal} onClose={makeModalClose} />
        </>
    );
}
