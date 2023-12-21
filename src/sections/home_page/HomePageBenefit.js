import { Box, Card, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import Image from '../../components/image';
import { SPACING } from '../../config-global';
import useResponsive from '../../hooks/useResponsive';
import { HomePageContext } from '../../mycontext/HomePageContext';

export default function HomePageBenefit() {
    const { loading, benefitList,currentCity,currentVehicle } = useContext(HomePageContext);
    const isDesktop = useResponsive('up', 'lg');

    const replaceString = (value = '') =>
    value.replace(/\$(CITY_NAME|MAKE_NAME|MODEL_NAME|CATEGORY_NAME)/g, (match) => {
        if (match === '$CITY_NAME') return currentCity?.city_name || '';
        if (match === '$VEHICLE_MODEL_NAME') return currentVehicle?.make?.vehicle_make_name || '';
        return '';
    });

    if (!loading && benefitList.sub_list.length == 0) {
        return null;
    }

    return (
        <Box sx={{ py: { xs: SPACING.xs, md: SPACING.md } }}>
            <Box display={'flex'} flexDirection="column" gap={3}>
                <Box display={'flex'} flexDirection="column" sx={{ textAlign: 'left' }}>
                    <Typography variant={isDesktop ? 'h3' : 'h6'}>
                        {replaceString(benefitList.homepage_section_title)}
                    </Typography>
                    <Typography variant={isDesktop ? 'body1' : 'caption'} color={'text.secondary'}>
                        {replaceString(benefitList.homepage_section_description)}
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {!loading &&
                        benefitList.sub_list.map((benefit, index) => (
                            <Grid item xs={12} md={3} key={index}>
                                <Card sx={{ p: 2, height: '100%' }}>
                                    <Box display={'flex'} alignItems="center" gap={2}>
                                        <Image src={benefit.media_url} alt={benefit.media_url_alt} sx={{ height: { xs: 36, md: 66 }, minWidth: { xs: 36, md: 66 } }} />
                                        <Box>
                                            <Typography variant={isDesktop ? 'h6' : 'subtitle2'}>{benefit.title}</Typography>
                                            <Typography variant={isDesktop ? 'body1' : 'caption'} color="text.secondary">
                                                {benefit.description}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>
        </Box>
    );
}