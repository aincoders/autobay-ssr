import { Grid, Skeleton } from '@mui/material';

export default function SkeletonPackageCategory() {
    return (
        <>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={4} sm={4} md={1.5} key={index}>
                    <Skeleton
                        variant="rectangular"
                        height={140}
                        sx={{ width: '140', borderRadius: 1 }}
                    />
                </Grid>
            ))}
        </>
    );
}
