import { Box, Card, Grid, Skeleton, Stack } from '@mui/material';

export default function SkeletonGridRowItem() {
    return (
        <>
            {[...Array(8)].map((_, index) => (
                <Grid item xs={12} key={index}>
                    <Stack spacing={2} sx={{ py: 1.5, px: 2.5 }}>
                        <Box
                            display={'flex'}
                            justifyContent="flex-start"
                            alignItems="center"
                            gap={1.5}
                        >
                            <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
                            <Box>
                                <Skeleton variant="text" height={14} width={100} />
                                <Skeleton variant="text" height={18} width={130} />
                                <Skeleton variant="text" height={16} width={200} />
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            ))}
        </>
    );
}
