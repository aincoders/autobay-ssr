import { alpha, Box, Chip, Typography } from '@mui/material';
import { useContext } from 'react';
import { PackageDetailContext } from '../../mycontext/PackageDetailContext';
import useResponsive from '../../hooks/useResponsive';

export default function PackageTag() {
    const { packageTagList } = useContext(PackageDetailContext);
    const isDesktop = useResponsive('up', 'lg');
    if (packageTagList.length === 0) return null;
    return (
        <Box display={'flex'} flexDirection="row" gap={2} flexWrap="wrap">
            {packageTagList.map((tag, i) => (
                <Box
                    key={i}
                    display="flex"
                    sx={{
                        bgcolor: alpha(tag.color, 0.12),
                        color: tag.color,
                        p: 0.5,
                        px: 1,
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="caption" fontWeight={'bold'} textTransform="uppercase">
                        {tag.title}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
