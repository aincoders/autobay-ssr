import { TaskAlt } from '@mui/icons-material';
import { Box, Rating, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { t } from 'i18next';
import { useContext } from 'react';
import Image from '../../components/image';
import { PackageDetailContext } from '../../mycontext/PackageDetailContext';
import useResponsive from '../../hooks/useResponsive';

export default function PackageExpertRating() {
    const { packageExpertRatingList } = useContext(PackageDetailContext);

    const isDesktop = useResponsive('up', 'lg');

    if (packageExpertRatingList.length === 0) return null;

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" flexDirection="column">
                <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>
                    {t('expert_rating')}
                </Typography>
            </Box>
            {isDesktop ? (
                <Box display="grid" gridTemplateColumns="repeat(4,1fr)" gap={1.5}>
                    {packageExpertRatingList.map((benefit, i) => (
                        <Box
                            key={i}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={1.5}
                        >
                            <TaskAlt fontSize="small" sx={{ color: green[600] }} />
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body2" fontWeight="bold">
                                    {benefit.title}
                                </Typography>
                                <Rating
                                    value={Number(benefit.expert_rating)}
                                    size="small"
                                    readOnly
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box display="grid" gridTemplateColumns="repeat(1,1fr)" gap={1}>
                    {packageExpertRatingList.map((benefit, i) => (
                        <Box
                            key={i}
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={1.5}
                        >
                            <Box display="flex" flexDirection="column">
                                <Typography variant="body2" fontWeight="bold">
                                    {benefit.title}
                                </Typography>
                                <Rating
                                    value={Number(benefit.expert_rating)}
                                    size="small"
                                    readOnly
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}
