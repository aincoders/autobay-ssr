import { Box, Paper, Skeleton } from '@mui/material';

export default function SkeletonPackageItemMobile() {
    return (
        <Box display={'flex'} flexDirection="column" gap={2}>
            <Skeleton variant="rectangular" sx={{ height: 180 }} />
            {[...Array(3)].map((_, index) => (
                <Paper variant="outlined" key={index} sx={{ p: 2, mx: 1 }}>
                    <Box display="flex" flexDirection={'row'} gap={2} alignItems="stretch">
                        <Skeleton variant="rounded" sx={{ height: 72, width: 72 }} />
                        <Box
                            display={'flex'}
                            flexDirection="column"
                            flex={1}
                            justifyContent="space-between"
                        >
                            <Box display="flex" flexDirection={'column'} flex={1} gap={1}>
                                <Skeleton variant="text" sx={{ width: '35%' }} />
                                <Box display="grid" gridTemplateColumns={'repeat(1,1fr)'} gap={0.5}>
                                    <Skeleton variant="text" sx={{ width: '60%', height: 12 }} />
                                    <Skeleton variant="text" sx={{ width: '60%', height: 12 }} />
                                    <Skeleton variant="text" sx={{ width: '60%', height: 12 }} />
                                </Box>
                            </Box>
                        </Box>
                        <Skeleton variant="rounded" sx={{ height: 30, width: 80 }} />
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}
