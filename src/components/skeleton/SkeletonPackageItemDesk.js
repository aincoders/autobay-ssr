import { Box, Paper, Skeleton } from '@mui/material';

export default function SkeletonPackageItemDesk() {
    return (
        <Box display={'flex'} flexDirection="column" gap={2}>
            <Skeleton variant="rounded" sx={{ height: 400 }} />
            {[...Array(3)].map((_, index) => (
                <Paper variant="outlined" key={index} sx={{ p: 2 }}>
                    <Box display="flex" flexDirection={'row'} gap={2} alignItems="stretch">
                        <Skeleton variant="rounded" sx={{ height: 280, width: 280 }} />
                        <Box
                            display={'flex'}
                            flexDirection="column"
                            flex={1}
                            justifyContent="space-between"
                        >
                            <Box display="flex" flexDirection={'column'} flex={1} gap={1}>
                                <Skeleton variant="text" sx={{ width: '35%' }} />
                                <Box display="grid" gridTemplateColumns={'repeat(3,1fr)'} gap={1.5}>
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                    <Skeleton variant="text" sx={{ width: '60%' }} />
                                </Box>
                            </Box>
                            <Skeleton variant="text" sx={{ width: 160 }} />
                        </Box>
                        <Skeleton variant="rounded" sx={{ height: 40, width: 160 }} />
                    </Box>
                </Paper>
            ))}
        </Box>
    );
}
