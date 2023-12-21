import { Box, Typography } from '@mui/material';
import { m } from 'framer-motion';
import Head from 'next/head';
import CustomLayoutWithoutSlug from 'src/layouts/custom/CustomLayoutWithoutSlug';
import { PageNotFoundIllustration } from '../assets/illustrations';
import { MotionContainer, varBounce } from '../components/animate';

Page404.getLayout = (page) => <CustomLayoutWithoutSlug>{page}</CustomLayoutWithoutSlug>;

export default function Page404() {
    return (
        <>
            <Head>
                <title> 404 Page Not Found</title>
            </Head>

            <MotionContainer>
                <Box sx={{ margin: 'auto', textAlign: 'center', py: { xs: 5, sm: 10 } }}>
                    <m.div variants={varBounce().in}>
                        <Typography variant="h3" paragraph>
                            Sorry, page not found!
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
                            mistyped the URL? Be sure to check your spelling.
                        </Typography>
                    </m.div>

                    <m.div variants={varBounce().in}>
                        <PageNotFoundIllustration
                            sx={{
                                height: 260,
                                mt: { xs: 5, sm: 10 },
                            }}
                        />
                    </m.div>
                </Box>
            </MotionContainer>
        </>
    );
}
