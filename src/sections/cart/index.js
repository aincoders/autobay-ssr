import { Box, Container, styled } from '@mui/material';
import Head from 'next/head';
import { useContext } from 'react';
import LoadingScreen from 'src/components/loading-screen';
import { useSettingsContext } from 'src/components/settings';
import { SPACING } from 'src/config-global';
import { CartPageContext } from 'src/mycontext/CartPageContext';
import { META_TAG } from 'src/utils/constant';
import CartTitle from './CartTitle';
import ItemList from './ItemList';

export default function CartPageItem() {
    const { loading } = useContext(CartPageContext);
    const {  currentCity } = useSettingsContext();

    const StyleRoot = styled('div')(({ theme }) => ({
        [theme.breakpoints.down('md')]: {
            position: 'fixed',
            top: '0',
            zIndex: '1101',
            left: 0,
            height: '100%',
            width: '100%',
            overflow: 'scroll',
            background: theme.palette.background.paper,
        },
    }));

    if (loading) {
        return <LoadingScreen isDashboard />;
    }

    return (
        <>
            <Head>
                <title>{META_TAG.cartTitle.replaceAll('$CITY_NAME', currentCity?.city_name)}</title>
                <meta name="description" content={META_TAG.cartDesc.replaceAll('$CITY_NAME', currentCity?.city_name)} />
                <meta property="og:title" content={META_TAG.cartTitle.replaceAll('$CITY_NAME', currentCity?.city_name)} />
                <meta property="og:description" content={META_TAG.cartDesc.replaceAll('$CITY_NAME', currentCity?.city_name)} />
            </Head>
            <StyleRoot>
                <CartTitle />
                <Box sx={{ bgcolor: 'background.paper', py: { xs: SPACING.xs, md: SPACING.md }, }}>
                    <Container maxWidth="xl">
                        <Box display={'flex'} flexDirection="column" gap={3}>
                            <ItemList />
                        </Box>
                    </Container>
                </Box>
            </StyleRoot>
        </>
    );
}
