import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Image from '../../components/image';
import { HEADER } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { PackageListContext } from '../../mycontext/PackageListContext';

export default function PackageCategory() {
    const { categoryList, currentPackageCategory, setCurrentPackageCategory, currentVehicle, rfqTitle, rfqIcon,setLoading } = useContext(PackageListContext);
    const make = currentVehicle?.make || ''; 
    const model = currentVehicle?.model || ''; 

    const router = useRouter();
    const { city } = router.query;
    const isDesktop = useResponsive('up', 'lg');


    const handleTabChange = (value) => {
        if (value == t('request_a_quote')) {
            router.push('/request-quote')
        } else {
            const getUrl = `/${city}/${value}/${model ? model.vehicle_model_slug : (make && make.vehicle_make_slug)}`;
            router.push(`/[city]/[...category]?packageCategory=true`, getUrl);
            setCurrentPackageCategory(value);
        }
    };


    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                position: 'sticky',
                top: { xs: HEADER.MOBILE_HEIGHT, md: HEADER.DASHBOARD_DESKTOP_HEIGHT },
                zIndex: 1,
            }}
        >
            <AppBar position="sticky" color="transparent">
                <Box component={Toolbar}>
                    <Container maxWidth="lg" disableGutters={!isDesktop}>
                        {categoryList.length > 0 && (
                            <Tabs
                                variant="scrollable"
                                scrollButtons="auto"
                                value={currentPackageCategory}
                                onChange={(e, value) => handleTabChange(value)}
                                TabIndicatorProps={{ sx: { height: '3px', borderRadius: 5 }, }}
                            >
                                {categoryList.map((tab) => (
                                    <Tab
                                        sx={{ py: 2 }}
                                        key={tab.package_id}
                                        value={tab.package_category_slug}
                                        label={
                                            <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center">
                                                <Image
                                                    src={tab.media_url}
                                                    alt={tab.package_category_name}
                                                    sx={{ width: { xs: 32, md: 40, }, height: { xs: 32, md: 40, }, }}
                                                />
                                                <Typography
                                                    variant={isDesktop ? 'body2' : 'caption'}
                                                    fontWeight={tab.package_category_slug == currentPackageCategory ? 'bold' : 'normal'}
                                                >
                                                    {tab.package_category_name}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                ))}

                                {rfqTitle && <Tab
                                    value={t('request_a_quote')}
                                    sx={{ py: 2 }}
                                    label={
                                        <Box display={'flex'} flexDirection="column" gap={0.5} alignItems="center">
                                            <Image src={rfqIcon} sx={{ width: { xs: 28, md: 40, }, height: { xs: 28, md: 40, }, p: 0.7 }} />
                                            <Typography variant={isDesktop ? 'body2' : 'caption'} fontWeight={'normal'}>{rfqTitle}</Typography>
                                        </Box>
                                    }
                                />}
                            </Tabs>
                        )}
                    </Container>
                </Box>
            </AppBar>
        </Box>
    );
}
